import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { User, RequestEmailVerificationResponse } from "../../../types/graph";
import Verification from "../../../entities/Verification";
import { sendVerificationEmail } from "../../../utils/sendEmail";

const resolvers: Resolvers = {
	Mutation: {
		RequestEmailVerification: privateResolver(async(_, __, {req}) : Promise<RequestEmailVerificationResponse>=> {
            const user: User = req.user;
            if(user.email && !user.verifiedEmail) {
                try {
                    const oldVerification = await Verification.findOne({payload:user.email})
                    if(oldVerification) {
                        oldVerification.remove();
                    }
                    const newVerification = await Verification.create({
                        payload:user.email,
                        target:"EMAIL"
                    }).save();
                    if(user.fullName) {
                        await sendVerificationEmail(user.fullName, newVerification.key);
                        return {
                            ok:true,
                            error:null
                        }
                    } else {
                        return {
                            ok:false,
                            error:"no Full name"
                        }
                    }
                } catch (error) {
                    return {
                        ok:false,
                        error:error.message
                    }
                }
            } else {
                return {
                    ok:false,
                    error:"You have no email to verify"
                }
            }
        }) 
	},
};

export default resolvers;