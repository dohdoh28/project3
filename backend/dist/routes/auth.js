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
const bcrypt_1 = __importDefault(require("bcrypt"));
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const RegistrationRequest_1 = require("../entities/RegistrationRequest");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const registrationRequestRepository = (0, typeorm_1.getRepository)(RegistrationRequest_1.RegistrationRequest);
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        const request = new RegistrationRequest_1.RegistrationRequest();
        request.username = username;
        request.email = email;
        request.password = hashedPassword;
        const result = yield registrationRequestRepository.save(request);
        res.status(201).json({ message: 'Registration request submitted successfully', id: result.id });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error submitting registration request:', error.message);
            res.status(500).json({ message: 'Error submitting registration request', error: error.message });
        }
        else {
            console.error('Unknown error submitting registration request');
            res.status(500).json({ message: 'Unknown error submitting registration request' });
        }
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    try {
        const user = yield userRepository.findOne({ where: { username }, relations: ['role'] });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }
        const roleName = user.role ? user.role.name : 'inconnu';
        res.json({ role: roleName });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la connexion :', error.message);
            res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
        }
        else {
            console.error('Erreur inconnue lors de la connexion');
            res.status(500).json({ message: 'Erreur inconnue lors de la connexion' });
        }
    }
}));
exports.default = router;
//# sourceMappingURL=auth.js.map