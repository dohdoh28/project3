import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Role } from "./Role";

@Entity('permissions')  // Spécifie le nom exact de la table dans la base de données
export class Permission {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles!: Role[];
}
