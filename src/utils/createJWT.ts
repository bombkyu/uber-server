// First, Install yarn add jsonwebtoken, @types/jsonwebtoken --dev
// Import it.
// So what this file does?
// This will get userId from the user and encrypt with some key to make ugly string.
// Send that ugly string to the user back.
// Whenever user requests something user will send token.
// And server will check if it is right token and id.

import jwt from 'jsonwebtoken';

const createJWT = (id:number) : string => {
    const token = jwt.sign({ 
            id 
        }, 
        process.env.JWT_TOKEN || ""
    );

    return token;
}

export default createJWT;