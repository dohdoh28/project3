import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('registration_requests')  // Spécifie le nom exact de la table dans la base de données
export class RegistrationRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;
}
