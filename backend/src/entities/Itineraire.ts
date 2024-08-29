import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Reseau } from './Reseau';

@Entity('itineraire')
export class Itineraire {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    type_flux!: string;

    @Column('double precision')
    capacite!: number;

    @Column('double precision')
    largeur!: number;

    @Column("int", { array: true })
    troncons!: number[];
}

