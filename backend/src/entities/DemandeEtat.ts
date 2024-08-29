import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('demande_etat')
export class DemandeEtat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    etat!: string;

    @Column('text')
    description!: string;
}
