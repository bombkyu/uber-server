import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import {rideStatus} from "../types/type";
import User from "./User";

@Entity()
class Ride extends BaseEntity {
	@PrimaryGeneratedColumn() id: number;

	@Column({ 
		type: 'text', 
		enum:["ACCEPTED", "FINISHED", "CANCELED", "REQUESTING", "ONROUTE"],
		default:"REQUESTING" })
	status: rideStatus;

	@Column({ type: 'text' })
	pickUpAddress: string;

	@Column({ type: 'double precision', default: 0 })
	pickUpLat: number;

	@Column({ type: 'double precision', default: 0 })
	pickUpLng: number;

	@Column({ type: 'text' })
	dropOffAddress: string;

	@Column({ type: 'double precision', default: 0 })
	dropOffLat: number;

	@Column({ type: 'double precision', default: 0 })
	dropOffLng: number;

	@Column({ type: 'double precision', default: 0 })
	price: number;

	@Column({ type: 'text' })
	distance: string;

	@Column({ type: 'text' })
	duration: string;

	@Column({nullable:true})
	driverId:number;

	@ManyToOne(type=>User, user=>user.ridesAsDriver)
	driver: User;

	@Column({nullable:true})
	passengerId:number;

	@ManyToOne(type => User, user => user.ridesAsPassenger, {nullable:true})
	passenger: User;

	@CreateDateColumn() createdAt: string;
	@UpdateDateColumn() updatedAt: string;
}
export default Ride;