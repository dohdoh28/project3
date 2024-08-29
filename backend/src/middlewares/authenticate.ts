// middlewares/authenticate.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entities/User';

// Définissez le type de userId que vous attendez dans le payload
interface TokenPayload extends JwtPayload {
  userId: number;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    // Vérifiez si le payload contient userId
    if (typeof decoded === 'object' && 'userId' in decoded) {
      const userId = decoded.userId;

      // Rechercher l'utilisateur dans la base de données
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({
        where: { id: userId },
        relations: ['role', 'role.permissions'],
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Assurez-vous que `req` possède une propriété `user` correctement typée
      (req as any).user = user; // Attacher l'utilisateur à la requête
      next();
    } else {
      res.status(401).json({ message: 'Token invalide ou expiré' });
    }
  } catch (error) {
    console.error('Erreur lors de l\'authentification:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
