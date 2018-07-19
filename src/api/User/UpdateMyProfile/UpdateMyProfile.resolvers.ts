import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "../../../types/graph";
import User from "../../../entities/User";
import cleanNullArgs from "../../../utils/cleanNullArgs";

const resolvers: Resolvers = {
	Mutation: {
        UpdateMyProfile:privateResolver(async (_, args:UpdateMyProfileMutationArgs, {req}) : Promise<UpdateMyProfileResponse> => {
            
            // I'm getting a user from a context.
            const user: User = req.user;
            
            // When Updating arguments that User request,
            // There might be a null args.
            // And We don't want to change it to null.
            // To prevent this, I created new objects that only takes not null arguments
            // And this notNull object will be passed to Update function.
            const notNull = cleanNullArgs(args);

            // Update a user profile.
            // update takes two argument
            // 1. What do you want to update
            // 2. How would you like to update
            try {
                // Why do we need this part?
                // Well, If we just call update() function, then from the User Entity 
                // the @BeforeUpdate is not going to called,
                // and this will make password unhashed.
                // Then when does @BeforeUpdate, @BeforeInsert get triggered?
                // They will be triggered when I change user object property and save it.
                // That's why I set the user.password and user.save()
                if(args.password !== null) {
                    user.password = args.password;
                    user.save();
                }
                await User.update({ id: user.id }, { ...notNull })
                return {
                    ok:true,
                    error:null
                }
            } catch(error) {
                return {
                    ok:false,
                    error:error.message
                }
            }
            
        })
    }
};

export default resolvers;