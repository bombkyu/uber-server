import { FacebookConnectMutationArgs, FacebookConnectResponse } from '../../../types/graph';
import {Resolvers} from "../../../types/resolvers";
import User from '../../../entities/User';

const resolvers: Resolvers = {
	Mutation: {
        FacebookConnect: async (
            _, args:FacebookConnectMutationArgs
        ): Promise<FacebookConnectResponse> => {
            const {fbId} = args;
            // Facebook으로 가입했는지 확인한다.
            try {
                const existingUser = await User.findOne({fbId})
                // 만약 이미 가입을 했다면 그냥 넘어간다.
                if(existingUser) {
                    return {
                        ok:true,
                        error:null,
                        token:"Comming Soon, already"
                    }
                } 
            } catch(error) {
                // 문제가 생기면 FacebookConnectResponse형태로 리턴한다.
                return {
                    ok:false,
                    error:error.message,
                    token:null
                }
            }
            // Facebook 계정으로 가입하지 않았다면 가입을 한다.
            try {
                await User.create({...args, profilePhoto:`http://graph.facebook.com/${fbId}/picture?type=square`}).save();
        
                return {
                    ok:true,
                    error:null,
                    token:"comming soon, created"
                }
               
            } catch(error) {
                return {
                    ok: false,
                    error: error.message,
                    token: null
                }
            }
        }
    },
};

export default resolvers;