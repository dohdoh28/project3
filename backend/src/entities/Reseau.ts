import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('reseau')
export class Reseau {
    @PrimaryGeneratedColumn()
    gid!: number;

    @Column()
    id!: number;

    @Column()
    site!: string;

    @Column('geometry')
    geom!: string;
}
