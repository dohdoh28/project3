import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { getRepository } from 'typeorm';
import { User } from '../entities/User';
import { RegistrationRequest } from '../entities/RegistrationRequest';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const registrationRequestRepository = getRepository(RegistrationRequest);
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const request = new RegistrationRequest();
        request.username = username;
        request.email = email;
        request.password = hashedPassword;

        const result = await registrationRequestRepository.save(request);
        res.status(201).json({ message: 'Registration request submitted successfully', id: result.id });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error submitting registration request:', error.message);
            res.status(500).json({ message: 'Error submitting registration request', error: error.message });
        } else {
            console.error('Unknown error submitting registration request');
            res.status(500).json({ message: 'Unknown error submitting registration request' });
        }
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userRepository = getRepository(User);
    try {
        const user = await userRepository.findOne({ where: { username }, relations: ['role'] });
        if (!user) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Identifiants incorrects' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
            expiresIn: '1h', // Expiration du token
        });


        res.json({ token, role: user.role.name });


    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la connexion :', error.message);
            res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
        } else {
            console.error('Erreur inconnue lors de la connexion');
            res.status(500).json({ message: 'Erreur inconnue lors de la connexion' });
        }
    }
});

export default router;
