import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'guild_config'})
export class GuildConfig{

    @PrimaryGeneratedColumn()
    ID: number;

    @Column({unique:true, name:'guild_id'})
    GuildID:string;

    @Column({default:'.'})
    prefix:string;

    @Column({name:'welcome_channel_id',nullable:true})
    WelcomeChannelID:string;

    @Column({name:'welcome_channel_string', nullable:true})
    WelcomeChannelString:string
}