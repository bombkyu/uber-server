import User from '../../../entities/User';
import { EmailSignInMutationArgs, EmailSignInResponse } from '../../../types/graph';
import { Resolvers } from "../../../types/resolvers";
import createJWT from '../../../utils/createJWT';
import Verification from '../../../entities/Verification';
import { sendVerificationEmail } from '../../../utils/sendEmail';


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
                        ok:false,
                        error:"You already have an account",
                        token:null
                    }
                } else {
                   const newUser = await User.create({...args}).save();
                   if(newUser.email) {
                       const emailVerification = await Verification.create({
                           payload:newUser.email,
                           target:"EMAIL"
                       }).save();
                       await sendVerificationEmail(
                           newUser.fullName,
                           emailVerification.key
                       )
                   }
                    const token = createJWT(newUser.id);
                    return {
                        ok:true,
                        error:null,
                        token
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