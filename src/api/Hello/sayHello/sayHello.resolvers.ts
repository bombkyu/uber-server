import { SayHelloQueryArgs, sayHelloResponse } from "../../../types/graph";

const resolvers = {
    Query : {
        sayHello: (_, args:SayHelloQueryArgs): sayHelloResponse => {
            return {
                "text":`Hello ${args.name}`,
                "error":false
            }
        }
    }
}
export default resolvers;