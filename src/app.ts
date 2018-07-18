import cors from 'cors';
import {GraphQLServer} from 'graphql-yoga';
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from './utils/decodeJWT';

class App {
    public app:GraphQLServer;
    constructor() {
        // GraphQLSever를 생성하려면
        // Schema, resolver가 있어야한다.
        this.app = new GraphQLServer({
            schema
        });
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
    private jwt = async (req, res, next) : Promise<void>=> {
        // The token sent from user is included in request header
        const token = req.get("X-JWT");
        if(token) {

            // decodeJWT will return a user if the token has appropriate id.
           const user = await decodeJWT(token);
           console.log(user);
        }
        // if jwt middleware is finished, go and run next middleware
        next();
    }
}

export default new App().app;