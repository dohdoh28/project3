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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../entities/User");
const Role_1 = require("../entities/Role");
const RegistrationRequest_1 = require("../entities/RegistrationRequest");
const router = (0, express_1.Router)();
// Route pour récupérer les demandes d'inscription
router.get('/registration-requests', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const registrationRequestRepository = (0, typeorm_1.getRepository)(RegistrationRequest_1.RegistrationRequest);
    try {
        const requests = yield registrationRequestRepository.find();
        res.json(requests);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la récupération des demandes d\'inscription:', error.message);
            res.status(500).json({ message: 'Erreur lors de la récupération des demandes d\'inscription', error: error.message });
        }
        else {
            console.error('Erreur inconnue lors de la récupération des demandes d\'inscription');
            res.status(500).json({ message: 'Erreur inconnue lors de la récupération des demandes d\'inscription' });
        }
    }
}));
// Route pour accepter une demande d'inscription
router.post('/accept-request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const registrationRequestRepository = (0, typeorm_1.getRepository)(RegistrationRequest_1.RegistrationRequest);
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    const roleRepository = (0, typeorm_1.getRepository)(Role_1.Role);
    try {
        const request = yield registrationRequestRepository.findOne({ where: { id } });
        if (!request) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }
        const role = yield roleRepository.findOne({ where: { name: 'demandeur' } });
        if (!role) {
            return res.status(400).json({ message: 'Rôle non trouvé' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(request.password, 10);
        const user = new User_1.User();
        user.username = request.username;
        user.email = request.email;
        user.password = hashedPassword;
        user.role = role;
        yield userRepository.save(user);
        yield registrationRequestRepository.delete(id);
        res.json({ message: 'Demande acceptée et utilisateur créé' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de l\'acceptation de la demande:', error.message);
            res.status(500).json({ message: 'Erreur lors de l\'acceptation de la demande', error: error.message });
        }
        else {
            console.error('Erreur inconnue lors de l\'acceptation de la demande');
            res.status(500).json({ message: 'Erreur inconnue lors de l\'acceptation de la demande' });
        }
    }
}));
// Route pour rejeter une demande d'inscription
router.post('/reject-request', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const registrationRequestRepository = (0, typeorm_1.getRepository)(RegistrationRequest_1.RegistrationRequest);
    try {
        yield registrationRequestRepository.delete(id);
        res.json({ message: 'Demande rejetée' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors du rejet de la demande:', error.message);
            res.status(500).json({ message: 'Erreur lors du rejet de la demande', error: error.message });
        }
        else {
            console.error('Erreur inconnue lors du rejet de la demande');
            res.status(500).json({ message: 'Erreur inconnue lors du rejet de la demande' });
        }
    }
}));
// Route pour créer un utilisateur interne
router.post('/create-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, role: roleName } = req.body;
    if (!username || !email || !password || !roleName) {
        return res.status(400).json({ message: 'Nom d\'utilisateur, email, mot de passe et rôle sont requis' });
    }
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    const roleRepository = (0, typeorm_1.getRepository)(Role_1.Role);
    try {
        const role = yield roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new User_1.User();
        user.username = username;
        user.email = email;
        user.password = hashedPassword;
        user.role = role;
        yield userRepository.save(user);
        res.json({ message: 'Utilisateur créé avec succès !' });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la création de l\'utilisateur interne:', error.message);
            res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur interne', error: error.message });
        }
        else {
            console.error('Erreur inconnue lors de la création de l\'utilisateur interne');
            res.status(500).json({ message: 'Erreur inconnue lors de la création de l\'utilisateur interne' });
        }
    }
}));
// Route pour récupérer les utilisateurs internes
router.get('/internal-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    try {
        const users = yield userRepository.find({
            relations: ['role'], // assurez-vous que la relation est correctement chargée
            where: { role: { name: 'TME' } }
        });
        res.json(users);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la récupération des utilisateurs internes :', error.message);
            res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs internes', error: error.message });
        }
        else {
            console.error('Erreur inconnue lors de la récupération des utilisateurs internes');
            res.status(500).json({ message: 'Erreur inconnue lors de la récupération des utilisateurs internes' });
        }
    }
}));
exports.default = router;
//# sourceMappingURL=admin.js.map