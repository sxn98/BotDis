import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:'log_config'})
export class LogConfig{
    @PrimaryGeneratedColumn()
    ID:number;

    @Column({name:'guild_id'})
    GuildID:string;

    @Column({name:'log_channel',nullable:true})
    LogChannel:string;

    @Column({name:'msg_deleted_content',default:false})
    MsgDeletedContent:boolean;

    @Column({name:'msg_edited_content',default:false})
    MsgEditedContent:boolean;

    @Column({name:'nickname_changes',default:false})
    NicknameChanges:boolean;

    @Column({name:'user_forcefully_disconnected',default:false})
    UserForcefullyDisconnected:boolean;

    @Column({name:'user_forcefully_moved',default:false})
    UserForcefullyMoved:boolean;
}