"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    var _a;
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token invalide' });
            }
            req.userId = user.id; // Associe l'ID utilisateur à la requête
            next();
        });
    }
    else {
        res.status(401).json({ message: 'Token non fourni' });
    }
};
exports.authenticateJWT = authenticateJWT;
//# sourceMappingURL=authenticateJWT.js.map