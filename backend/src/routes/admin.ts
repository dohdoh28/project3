import { Router } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { RegistrationRequest } from '../entities/RegistrationRequest';
import { authorize } from '../middlewares/authorize';
import { authenticate } from '../middlewares/authenticate';


const router = Router();

// Route pour récupérer les demandes d'inscription
router.get('/registration-requests',authenticate,authorize(['manage_users','view_requests','approve_requests']), async (req, res) => {
    const registrationRequestRepository = getRepository(RegistrationRequest);
    try {
        const requests = await registrationRequestRepository.find();
        res.json(requests);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la récupération des demandes d\'inscription:', error.message);
            res.status(500).json({ message: 'Erreur lors de la récupération des demandes d\'inscription', error: error.message });
        } else {
            console.error('Erreur inconnue lors de la récupération des demandes d\'inscription');
            res.status(500).json({ message: 'Erreur inconnue lors de la récupération des demandes d\'inscription' });
        }
    }
});

// Route pour accepter une demande d'inscription
router.post('/accept-request',authenticate,authorize(['manage_users','view_requests','approve_requests']), async (req, res) => {
    const { id } = req.body;
    const registrationRequestRepository = getRepository(RegistrationRequest);
    const userRepository = getRepository(User);
    const roleRepository = getRepository(Role);
    try {
        const request = await registrationRequestRepository.findOne({ where: { id } });
        if (!request) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        const role = await roleRepository.findOne({ where: { name: 'demandeur' } });
        if (!role) {
            return res.status(400).json({ message: 'Rôle non trouvé' });
        }

        const hashedPassword = await bcrypt.hash(request.password, 10);
        const user = new User();
        user.username = request.username;
        user.email = request.email;
        user.password = hashedPassword;
        user.role = role;

        await userRepository.save(user);
        await registrationRequestRepository.delete(id);

        res.json({ message: 'Demande acceptée et utilisateur créé' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de l\'acceptation de la demande:', error.message);
            res.status(500).json({ message: 'Erreur lors de l\'acceptation de la demande', error: error.message });
        } else {
            console.error('Erreur inconnue lors de l\'acceptation de la demande');
            res.status(500).json({ message: 'Erreur inconnue lors de l\'acceptation de la demande' });
        }
    }
});

// Route pour rejeter une demande d'inscription
router.post('/reject-request',authenticate,authorize(['manage_users','view_requests','approve_requests']), async (req, res) => {
    const { id } = req.body;
    const registrationRequestRepository = getRepository(RegistrationRequest);
    try {
        await registrationRequestRepository.delete(id);
        res.json({ message: 'Demande rejetée' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors du rejet de la demande:', error.message);
            res.status(500).json({ message: 'Erreur lors du rejet de la demande', error: error.message });
        } else {
            console.error('Erreur inconnue lors du rejet de la demande');
            res.status(500).json({ message: 'Erreur inconnue lors du rejet de la demande' });
        }
    }
});

// Route pour créer un utilisateur interne
router.post('/create-user',authenticate,authorize(['manage_users','view_requests','approve_requests']),  async (req, res) => {
    const { username, email, password, role: roleName } = req.body;

    if (!username || !email || !password || !roleName) {
        return res.status(400).json({ message: 'Nom d\'utilisateur, email, mot de passe et rôle sont requis' });
    }

    const userRepository = getRepository(User);
    const roleRepository = getRepository(Role);

    try {
        const role = await roleRepository.findOne({ where: { name: roleName } });
        if (!role) {
            return res.status(400).json({ message: 'Rôle invalide' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = hashedPassword;
        user.role = role;

        await userRepository.save(user);

        res.json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la création de l\'utilisateur interne:', error.message);
            res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur interne', error: error.message });
        } else {
            console.error('Erreur inconnue lors de la création de l\'utilisateur interne');
            res.status(500).json({ message: 'Erreur inconnue lors de la création de l\'utilisateur interne' });
        }
    }
});

// Route pour récupérer les utilisateurs internes
// Route pour récupérer les utilisateurs internes
router.get('/internal-users',authenticate,authorize(['manage_users','view_requests','approve_requests']), async (req, res) => {

    // Récupérer les paramètres de pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    try {
        const userRepository = getRepository(User);

        const [users, total] = await userRepository.findAndCount({
            relations: ['role'],
            where: [
                { role: { name: 'TME' } },
                { role: { name: 'capitaine' } },
                { role: { name: 'exploitation' } }
            ],
            skip: (page - 1) * limit,
            take: limit
                // assurez-vous que la relation est correctement chargée
        });
        // Ajouter cette partie pour transformer les données envoyées au frontend
        const formattedUsers = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role_name: user.role.name // Assurez-vous que `role.name` est accessible
        }));


        res.json({data: formattedUsers, total: total});
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la récupération des utilisateurs internes :', error.message);
            res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs internes', error: error.message });
        } else {
            console.error('Erreur inconnue lors de la récupération des utilisateurs internes');
            res.status(500).json({ message: 'Erreur inconnue lors de la récupération des utilisateurs internes' });
        }
    }
});



// Route pour supprimer un utilisateur interne
router.delete('/delete-user/:id', authenticate, authorize(['manage_users']), async (req, res) => {
    const id = parseInt(req.params.id); // Convertir l'ID en nombre
    const userRepository = getRepository(User);

    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID invalide' }); // Vérifiez si l'ID est valide après conversion
    }

    try {
        const user = await userRepository.findOne({ where: { id } });
        
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        await userRepository.remove(user);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error.message);
            res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
        } else {
            console.error('Erreur inconnue lors de la suppression de l\'utilisateur');
            res.status(500).json({ message: 'Erreur inconnue lors de la suppression de l\'utilisateur' });
        }
    }
});


export default router;
