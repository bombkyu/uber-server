import {ConnectionOptions} from "typeorm";

const connectionOptions: ConnectionOptions = {
    type:"postgres",
    database:"uber",
    synchronize:true,
    logging:true,
    entities:["entities/**/*.*"],
    host:process.env.DB_ENDPOINT,
    port:5432,
    username:process.env.USERNAME,
    password:process.env.PASSWORD
}

export default connectionOptions