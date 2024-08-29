import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Demande } from "./Demande";
import { User } from "./User";
import { DemandeEtat } from "./DemandeEtat";

@Entity('action_demande')
export class ActionDemande {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Demande)
    @JoinColumn({ name: "demande_id" })
    demande!: Demande;

    @ManyToOne(() => User)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => DemandeEtat)
    @JoinColumn({ name: "etat_id" })
    etat!: DemandeEtat;

    @Column('timestamp')
    date_action!: Date;

    @Column('text')
    commentaire!: string;
}
