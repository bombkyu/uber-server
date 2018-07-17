import User from '../../../entities/User';
import { EmailSignInMutationArgs, EmailSignInResponse } from '../../../types/graph';
import { Resolvers } from "../../../types/resolvers";


const resolvers:Resolvers = {
    Mutation: {
        EmailSignUp: async (_,args:EmailSignInMutationArgs) : Promise<EmailSignInResponse> => {
            const {email} = args;
            try{
                const existingUser = await User.findOne({
                    email
                })
                if(existingUser) {
                    return {
                        ok:true,
                        error:"You already have an account",
                        token:null
                    }
                } else {
                    const newUser = await User.create({...args}).save();
                    return {
                        ok:true,
                        error:null,
                        token:"Coming Soon"
                    }
                }
            }catch(error) {
                return {
                    ok:false,
                    error:error.message,
                    token:null
                }
            }
        }
    }
}

export default resolvers;