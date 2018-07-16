import bcrypt from "bcrypt";
import {IsEmail} from "class-validator";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

const BCRYPT_ROUNDS = 10;

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"text", unique:true})
    @IsEmail()
    email:string;

    @Column({ type: "boolean", default: false })
    verifiedEmail: boolean;

    @Column({ type: "text" })
    firstName: string;

    @Column({ type: "text" })
    lastName: string;

    @Column({ type: "int" })
    age: number;

    @Column({ type: "text" })
    password: string;

    @Column({ type: "text" })
    phoneNumber: string;

    @Column({ type: "boolean", default: false })
    verifiedPhonenNumber: boolean;

    @Column({ type: "text" })
    profilePhoto: string;

    @Column({ type: "boolean", default: false })
    isDriving: boolean;

    @Column({ type: "boolean", default: false })
    isRiding: boolean;

    @Column({ type: "boolean", default: false })
    isTaken: boolean;

    @Column({ type: "double precision", default: 0 })
    lastLng: number;

    @Column({ type: "double precision", default: 0 })
    lastLat: number;

    @Column({ type: "double precision", default: 0 })
    lastOrientation: number;

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    // 사용자가 비밀번호를 입력하면(12345)
    // 이 비밀번호를 암호화 작업을 해서 리턴한다
    private hashPassword(password:string): Promise<string> {
        return bcrypt.hash(password, BCRYPT_ROUNDS );
    }

    // 사용자가 입력한 비밀번호화 암호화된 비밀번호가 같은지 확인하는 작업이다.
    public comparePassword(password:string): Promise<boolean> {
        return bcrypt.compare(password, this.password)
    }

    @CreateDateColumn() 
    createdAt: string;

    @UpdateDateColumn() 
    updatedAt: string;

    // 비밀번호를 유저가 입력한 번호가 아닌 암호화된 글자로 만든다.
    @BeforeInsert()
    @BeforeUpdate()
    async savePassword(): Promise<void> {
        if(this.password) {
            const hashedPassword = await this.hashPassword(this.password);
            this.password = hashedPassword;
        }
    }
}

export default User