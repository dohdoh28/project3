"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Demande = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const DemandeEtat_1 = require("./DemandeEtat");
const Itineraire_1 = require("./Itineraire");
let Demande = class Demande {
};
exports.Demande = Demande;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Demande.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", User_1.User)
], Demande.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => DemandeEtat_1.DemandeEtat),
    (0, typeorm_1.JoinColumn)({ name: "etat_id" }),
    __metadata("design:type", DemandeEtat_1.DemandeEtat)
], Demande.prototype, "etat", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Demande.prototype, "date_creation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Demande.prototype, "date_validation", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp', { nullable: true }),
    __metadata("design:type", Date)
], Demande.prototype, "date_rejet", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "matricule_remorque", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Demande.prototype, "nombre_essieux_arriere", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], Demande.prototype, "espacement_essieux", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Demande.prototype, "fiche_technique", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], Demande.prototype, "poids_total_tonnes", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], Demande.prototype, "longueur_m", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], Demande.prototype, "largeur_m", void 0);
__decorate([
    (0, typeorm_1.Column)('double precision'),
    __metadata("design:type", Number)
], Demande.prototype, "hauteur_m", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "type_operation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "point_sortie", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Demande.prototype, "date_operation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "demandeur", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "email_client", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Demande.prototype, "nom_societe", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Itineraire_1.Itineraire),
    (0, typeorm_1.JoinColumn)({ name: "id_itineraire" }),
    __metadata("design:type", Itineraire_1.Itineraire)
], Demande.prototype, "itineraire", void 0);
exports.Demande = Demande = __decorate([
    (0, typeorm_1.Entity)('demande')
], Demande);
//# sourceMappingURL=Demande.js.map