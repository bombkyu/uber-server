import cors from 'cors';
import {GraphQLServer, PubSub} from 'graphql-yoga';
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from './utils/decodeJWT';
import { NextFunction, Response } from '../node_modules/@types/express';

class App {
    public app:GraphQLServer;
    public pubSub: any;
    
    constructor() {
        // pubSub is for Subscription.
        // Subscription is a notification.
        this.pubSub = new PubSub();
        this.pubSub.ee.setMaxListeners(99);
        
        // GraphQLSever를 생성하려면
        // Schema, resolver가 있어야한다.
        
        this.app = new GraphQLServer({ 
            // We are making not just one big Schema and resolver.
			// So we are going to merge all the schemas and resolvers and
			// put it inside "schema" object.
            schema,

            // If we define Context here then you can access request from all the resolvers.
            // Context is something that goes to all the resolvers.
            context: req => {
                // request(req) is from not only http request but also websocket request.
                // That's why you can access to the currentUser from the subscription.
                // console.log(req.connection.context.currentUser);
                const {connection : {context = null} = {}} = req;
				return { 
                    req: req.request, 
                    pubSub: this.pubSub,
                    context 
                };
            } 
        });
        // We are using the middlewares that was defined in the bottom in GraphQL Server. 
        this.middlewares();
        
    }
    // GraphQLServer에서 작동하는 express를 사용한다.
    // 그리고 필요한 미들웨어를 적용한다.
    private middlewares = () : void => {
        this.app.express.use(cors());
        this.app.express.use(logger("dev"));
        this.app.express.use(helmet());
        this.app.express.use(this.jwt);
    }

    // This is JWT Middleware
    // Decode Token and check if it is the right user.
    private jwt = async (req, res:Response, next:NextFunction) : Promise<void>=> {
        // The token sent from user is included in request header
        const token = req.get("X-JWT");
        if(token) {

            // decodeJWT will return a user if the token has appropriate id.
            const user = await decodeJWT(token);

            // Attach user to the request header, 
            // so after we pass all the Middlewares 
            // we can use User on the GraphQL Server
            if(user) {
                req.user = user;
            } else {
                req.user = undefined;
            }
        }
        // if jwt middleware is finished, go and run next middleware
        next();
    }
}

export default new App().app;