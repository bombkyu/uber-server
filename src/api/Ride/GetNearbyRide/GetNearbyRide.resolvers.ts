import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../../utils/privateResolver";
import { GetNearbyRideResponse } from "../../../types/graph";
import User from "../../../entities/User";
import { getRepository, Between } from "../../../../node_modules/typeorm";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
	Query: {
		GetNearbyRides:privateResolver (async (_,__,{req}) : Promise<GetNearbyRideResponse> => {
            const user:User = req.user;
            if(user.isDriving) {
                const { lastLat, lastLng } = user;

                try {
                    // If you want to find Object with Condition,
                    // You have to use getRepository
                    const ride = await getRepository(Ride).findOne({
                        status: 'REQUESTING',
                        pickUpLat: Between(lastLat - 0.05, lastLat + 0.05),
                        pickUpLng: Between(lastLng - 0.05, lastLng + 0.05),
                    });
                    if(ride) {
                        return {
                            ok:true,
                            error:null,
                            ride
                        }
                    } else {
                        return {
                            ok:false,
                            error:"There is no ride",
                            ride:null
                        }
                    }
                   
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message,
                        ride: null
                    }
                }
            } else {
                return {
                    ok:false,
                    error:"You are not driving",
                    ride:null
                }
            }
        })
	},
};

export default resolvers;