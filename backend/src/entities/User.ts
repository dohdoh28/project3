import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Role } from "./Role";
import { Demande } from "./Demande";  // Importez l'entité Demande

@Entity('users')  // Spécifie le nom exact de la table dans la base de données
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    firstName!: String;

    @Column()
    lastName!: string;

    @Column()
    mobile!: string;

    @Column()
    address!: string;

    @Column()
    profile!:string;
    

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })  // Spécifie le nom exact de la colonne dans la base de données
    role!: Role;

    @Column({ default: 'accepted' })
    status: string = 'accepted';

    @OneToMany(() => Demande, demande => demande.user)
    demandes!: Demande[];
}
