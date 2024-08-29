"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Demande_1 = require("../entities/Demande");
const DemandeEtat_1 = require("../entities/DemandeEtat");
const router = (0, express_1.Router)();
router.get('/requests', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const demandeRepository = (0, typeorm_1.getRepository)(Demande_1.Demande);
    try {
        const demandes = yield demandeRepository.find({
            where: { etat: { id: 2 } }, // Remplacez 2 par l'ID correspondant à "en cours"
            relations: ['itineraire', 'user']
        });
        res.json(demandes);
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
    }
}));
router.post('/approve-request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const demandeRepository = (0, typeorm_1.getRepository)(Demande_1.Demande);
    const demandeEtatRepository = (0, typeorm_1.getRepository)(DemandeEtat_1.DemandeEtat);
    try {
        const demande = yield demandeRepository.findOne(id);
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }
        const etat = yield demandeEtatRepository.findOne({ where: { etat: 'validé par TME' } });
        if (!etat) {
            return res.status(400).json({ message: 'État non trouvé' });
        }
        demande.etat = etat;
        demande.date_validation = new Date();
        yield demandeRepository.save(demande);
        res.json({ message: 'Demande approuvée avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'approbation de la demande' });
    }
}));
router.post('/reject-request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const demandeRepository = (0, typeorm_1.getRepository)(Demande_1.Demande);
    const demandeEtatRepository = (0, typeorm_1.getRepository)(DemandeEtat_1.DemandeEtat);
    try {
        const demande = yield demandeRepository.findOne(id);
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }
        const etat = yield demandeEtatRepository.findOne({ where: { etat: 'rejeté par TME' } });
        if (!etat) {
            return res.status(400).json({ message: 'État non trouvé' });
        }
        demande.etat = etat;
        demande.date_rejet = new Date();
        yield demandeRepository.save(demande);
        res.json({ message: 'Demande rejetée avec succès' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erreur lors du rejet de la demande' });
    }
}));
exports.default = router;
//# sourceMappingURL=tme.js.map