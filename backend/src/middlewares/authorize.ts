// middlewares/authorize.ts
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { Permission } from '../entities/Permission';

// Middleware pour vérifier les autorisations
export const authorize = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Assurez-vous que l'utilisateur est déjà authentifié et que l'objet utilisateur est attaché à la requête
      const user = (req as any).user as User;
      
      if (!user) {
        return res.status(403).json({ message: 'Utilisateur non authentifié.' });
      }

      // Charger les permissions de l'utilisateur
      const userRepository = getRepository(User);
      const fullUser = await userRepository.findOne({
        where: { id: user.id },
        relations: ['role', 'role.permissions'], // Charge les rôles et les permissions
      });

      if (!fullUser) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Extraire les noms des permissions de l'utilisateur
      const userPermissions = fullUser.role.permissions.map((permission: Permission) => permission.name);

      // Vérifier si toutes les permissions requises sont présentes
      const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

      if (!hasPermission) {
        return res.status(403).json({ message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.' });
      }

      // Passer à la prochaine fonction middleware
      next();
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
};
