import cors from 'cors';
import {GraphQLServer} from 'graphql-yoga';
import helmet from "helmet";
import logger from "morgan";
import schema from "./schema";

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
    }
}

export default new App().app;