import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'autorole_config'})
export class AutoRoleConfig{

    @PrimaryGeneratedColumn()
    ID: number;

    @Column({ name:'guild_id'})
    GuildID:string;

    @Column({name:'role_id', nullable:true})
    RoleID:string;

    @Column({name:'activity_name',nullable:true})
    ActivityName:string;


}