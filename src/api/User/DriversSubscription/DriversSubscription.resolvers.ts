const resolvers = {
	Subscription: {
		DriversSubscription: {
            // Subscription is a notifcation.
            // When you subscribe some program and program update news, 
            // they will send a notification (subscription).
            subscribe: (_, __,{pubSub} ) => {
                // This is creating a channel called driverUpdate.
                // When somebody updates, the data will be sent here.
                return pubSub.asyncIterator("driverUpdate")
            }
        }
	},
};

export default resolvers;