import { withFilter } from "../../../../node_modules/graphql-yoga";
import User from "../../../entities/User";

const resolvers = {
	Subscription: {
		DriversSubscription: {
            // Subscription is a notifcation.
            // When you subscribe some program and program update news, 
            // they will send a notification (subscription).

            // withFilter function you can filter the notification.
            // EX) If I'm in the Korea, I don't want to get notification from the China.
            subscribe: withFilter((_, __,{pubSub} ) => {
                // This is creating a channel called driverUpdate.
                // When somebody updates, the data will be sent here.
                return pubSub.asyncIterator("driverUpdate")
            }, (payload, _, {context}) => {
                // payload is the data that user send.
                // In this case it will be DriverSubscription:user from Report Movement 
                
                const user:User = context.currentUser;
                const {
                    DriversSubscription:{lastLat:driverLastLat, lastLng:driverLastLng}
                } = payload;

                const {lastLat:userLastLat, lastLng:userLastLng} = user;

                return (
                    driverLastLat >= userLastLat - 0.05 &&
                    driverLastLat <= userLastLat + 0.05 &&
                    driverLastLng >= userLastLng - 0.05 &&
                    driverLastLng <= userLastLng + 0.05
                )
            })
        }
	},
};

export default resolvers;