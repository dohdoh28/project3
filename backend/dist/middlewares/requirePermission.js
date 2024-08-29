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
exports.requirePermission = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const requirePermission = (permissionName) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userRepository = (0, typeorm_1.getRepository)(User_1.User);
        const userId = req.userId;
        if (!userId) {
            return res.status(403).json({ message: 'Utilisateur non authentifié' });
        }
        try {
            const user = yield userRepository.findOne({
                where: { id: userId },
                relations: ['role', 'role.permissions']
            });
            if (!user) {
                return res.status(403).json({ message: 'Utilisateur non trouvé' });
            }
            const hasPermission = user.role.permissions.some(permission => permission.name === permissionName);
            if (!hasPermission) {
                return res.status(403).json({ message: 'Accès interdit : vous n\'avez pas les permissions nécessaires' });
            }
            next();
        }
        catch (error) {
            console.error('Erreur lors de la vérification des permissions:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    });
};
exports.requirePermission = requirePermission;
//# sourceMappingURL=requirePermission.js.map