import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { DemandeEtat } from "./DemandeEtat";
import { Itineraire } from "./Itineraire";

@Entity('demande')
export class Demande {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.demandes)
    @JoinColumn({ name: "user_id" })
    user!: User;

    @ManyToOne(() => DemandeEtat)
    @JoinColumn({ name: "etat_id" })
    etat!: DemandeEtat;

    @Column('timestamp')
    date_creation!: Date;

    @Column('timestamp', { nullable: true })
    date_validation?: Date;

    @Column('timestamp', { nullable: true })
    date_rejet?: Date;

    @Column()
    matricule_remorque!: string;

    @Column()
    nombre_essieux_arriere!: number;

    @Column('double precision')
    espacement_essieux!: number;

    @Column('text')
    fiche_technique!: string;

    @Column('double precision')
    poids_total_tonnes!: number;

    @Column('double precision')
    longueur_m!: number;

    @Column('double precision')
    largeur_m!: number;

    @Column('double precision')
    hauteur_m!: number;

    @Column()
    type_operation!: string;

    @Column()
    point_sortie!: string;

    @Column('timestamp')
    date_operation!: Date;

    @Column()
    demandeur!: string;

    @Column()
    telephone!: string;

    @Column()
    email_client!: string;

    @Column()
    nom_societe!: string;

    @ManyToOne(() => Itineraire)
    @JoinColumn({ name: "id_itineraire" })
    itineraire!: Itineraire;
}
