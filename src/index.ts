import dotenv from 'dotenv';
dotenv.config();

import { Options } from "graphql-yoga"
import {createConnection} from "typeorm";
import app from "./app";
import connectionOptions from "./ormConfig";
import decodeJWT from './utils/decodeJWT';


const PORT : number | string =  process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT : string = "/playground";
const GRAPHQL_ENDPOINT : string = '/graphql'
const SUBSCRIPTION_ENDPOINT : string = '/subscription';

const appOptions : Options = {
    port:PORT,
    playground:PLAYGROUND_ENDPOINT,
    endpoint:GRAPHQL_ENDPOINT,
    subscriptions: {
        path: SUBSCRIPTION_ENDPOINT,
        onConnect: async connectionParams => {
            // connectionParams includes token
            const token = await connectionParams['X-JWT'];
            // console.log(token);
            if(token) {
                const user = await decodeJWT(token);
                // console.log(user);
                if(user) {
                    return {
                        // currentUser key is added automatically to the subscription context
                        // Which is api -> User -> DriverSubscription
                        currentUser:user
                    }
                }
            }
            throw new Error("No JWT, Can't Subscribe");
        }
    }
}

const handleAppStart = () => {
    console.log(`Listening on port ${PORT}`);
}

// DB와 연결이 되면 Server를 시작한다.
// 왜? 
// 서버가 작동할때 DB안에 있는 데이터를 필요로 하는데
// DB와 연결이 안돼있으면 문제가 생길 수 있다.
createConnection(connectionOptions).then(()=> {
    app.start(appOptions, handleAppStart);
})

