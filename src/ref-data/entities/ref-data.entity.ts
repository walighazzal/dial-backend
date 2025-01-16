import { Users } from "src/user/user.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class RefRole {
    @Column()
    roleName: string;

    @PrimaryColumn()
    roleId: string;

    @OneToMany(() => Users, (user) => user.role)
    users: Users[];
}
