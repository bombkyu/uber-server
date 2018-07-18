import jwt from "jsonwebtoken";

import User from "../entities/User";


// If there is a user with correct id from the token. then return the user or undefined
const decodeJWT = async (token:string) : Promise<User | undefined> => {
    try {
        const decoded:any = jwt.verify(token, process.env.JWT_TOKEN||"");
        const {id} = decoded;
        const user = await User.findOne({id});
        return user;
    } catch(error) {
        return undefined;
    }
}

export default decodeJWT;