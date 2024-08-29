import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Demande } from '../entities/Demande';
import { Itineraire } from '../entities/Itineraire';
import { Reseau } from '../entities/Reseau';
import { DemandeEtat } from '../entities/DemandeEtat';
import { ActionDemande } from '../entities/ActionDemande';
import { User } from '../entities/User';
const router = Router();

// Route pour récupérer les demandes en cours
router.get('/requests', async (req, res) => {
    const demandeRepository = getRepository(Demande);
    try {
        const demandes = await demandeRepository.find({
            where: { etat: { id: 2 } }, // Remplacez 2 par l'ID correspondant à "en cours"
            relations: ['itineraire', 'user', 'etat'],
            select: ['id', 'date_creation', 'email_client','telephone', 'nom_societe', 'matricule_remorque','espacement_essieux','poids_total_tonnes','longueur_m','largeur_m','type_operation','point_sortie','etat','date_validation','date_rejet','nombre_essieux_arriere','hauteur_m'] // Sélection des colonnes nécessaires
        });

        // Optionnel: Formatage des données pour le frontend
        const demandesFormatted = demandes.map(demande => ({
            id: demande.id,
            demandeur: demande.user?.username, // Assurez-vous que le champ 'nom_complet' existe dans l'entité 'user'
            date_creation: demande.date_creation,
            email: demande.email_client,
            telephone:demande.telephone,
            societe: demande.nom_societe,
            matricule: demande.matricule_remorque,
            espacement_essieux:demande.espacement_essieux,
            poids_total_tonnes:demande.poids_total_tonnes,
            longueur_m:demande.longueur_m,
            largeur_m:demande.largeur_m,
            type_operation:demande.type_operation,
            point_sortie:demande.point_sortie,
            etat:demande.etat,
            date_validation:demande.date_validation,
            date_rejet:demande.date_rejet,
            hauteur_m:demande.hauteur_m,

            nombre_essieux_arriere:demande.nombre_essieux_arriere

        }));

        res.json(demandesFormatted);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des demandes' });
    }
});


// Route pour approuver une demande
router.post('/accept-request/:id', async (req, res) => {
    const { id } = req.params;
    const { itineraire_id } = req.body;  // Assurez-vous que vous récupérez l'itinéraire_id depuis le corps de la requête

    const demandeRepository = getRepository(Demande);
    const itineraireRepository = getRepository(Itineraire);
    const demandeEtatRepository = getRepository(DemandeEtat);
    const actionDemandeRepository=getRepository(ActionDemande);


    try {
        const demande = await demandeRepository.findOneBy({ id: parseInt(id, 10) });
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        const itineraire = await itineraireRepository.findOneBy({ id: parseInt(itineraire_id, 10) });
        if (!itineraire) {
            return res.status(404).json({ message: 'Itinéraire non trouvé' });
        }

        const etat = await demandeEtatRepository.findOne({ where: { etat: 'validé par TME' } });
        if (!etat) {
            return res.status(400).json({ message: 'État non trouvé' });
        }

        demande.etat = etat;
        demande.date_validation = new Date();
        demande.itineraire = itineraire;  // Associez l'itinéraire à la demande
        await demandeRepository.save(demande);


        //Enregistrer l'action dans la table action_demande

        const acttionDemande= new ActionDemande;
        acttionDemande.demande=demande;
        acttionDemande.user=demande.user;
        acttionDemande.etat=etat;
        acttionDemande.date_action=new Date();


        await actionDemandeRepository.save(acttionDemande);


        res.json({ message: 'Demande acceptée avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande :', error);
        res.status(500).json({ message: 'Erreur lors de l\'acceptation de la demande' });
    }
});

// Route pour rejeter une demande
router.post('/reject-request', async (req, res) => {
    const { id,motif } = req.body;
    const demandeRepository = getRepository(Demande);
    const demandeEtatRepository = getRepository(DemandeEtat);
    const actionDemandeRepository=getRepository(ActionDemande);
    const userRepository=getRepository(User);

    try {
        // Utilisation de findOneBy pour rechercher par ID
        const demande = await demandeRepository.findOneBy({ id: parseInt(id, 10) });
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        const etat = await demandeEtatRepository.findOne({ where: { etat: 'rejeté par TME' } });
        if (!etat) {
            return res.status(400).json({ message: 'État non trouvé' });
        }

        demande.etat = etat;
        demande.date_rejet = new Date();
        await demandeRepository.save(demande);

     


        //Enregistrer l'action dans la table action_demande

        const acttionDemande= new ActionDemande;
        acttionDemande.demande=demande;
        acttionDemande.user=demande.user;
        acttionDemande.etat=etat;
        acttionDemande.date_action=new Date();
        acttionDemande.commentaire=motif;


        await actionDemandeRepository.save(acttionDemande);


        res.json({ message: 'Demande rejetée avec succès' });
    } catch (error) {
        console.error('Erreur lors du rejet de la demande :', error);
        res.status(500).json({ message: 'Erreur lors du rejet de la demande' });
    }
});

// Route pour récupérer les itinéraires compatibles avec une demande
router.get('/compatible-itineraries/:demandeId', async (req, res) => {
    const { demandeId } = req.params;
    const demandeRepository = getRepository(Demande);
    const itineraireRepository = getRepository(Itineraire);

    try {
        // Utilisation de findOneBy pour rechercher par ID
        const demande = await demandeRepository.findOneBy({ id: parseInt(demandeId, 10) });
        if (!demande) {
            return res.status(404).json({ message: 'Demande non trouvée' });
        }

        // Récupération des itinéraires dont la capacité et la largeur sont supérieures à celles du convoi
        const itineraries = await itineraireRepository
            .createQueryBuilder('itineraire')
            .where('itineraire.capacite >= :poids', { poids: demande.poids_total_tonnes })
            .andWhere('itineraire.largeur >= :largeur', { largeur: demande.largeur_m })
            .getMany();

        res.json(itineraries);
    } catch (error) {
        console.error('Erreur lors de la récupération des itinéraires compatibles :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des itinéraires compatibles' });
    }
});

// Route pour récupérer les tronçons géométriques pour un itinéraire
router.get('/mapdata/:itineraireId', async (req, res) => {
    const { itineraireId } = req.params;
    const itineraireRepository = getRepository(Itineraire);
    const reseauRepository = getRepository(Reseau);

    try {
        // Utilisation de findOneBy pour rechercher par ID
        const itineraire = await itineraireRepository.findOneBy({ id: parseInt(itineraireId, 10) });
        if (!itineraire) {
            return res.status(404).json({ message: 'Itinéraire non trouvé' });
        }

        // Récupération des géométries des tronçons associés à cet itinéraire
        const troncons = await reseauRepository.findByIds(itineraire.troncons);

        const geojson = {
            type: "FeatureCollection",
            features: troncons.map(troncon => ({
                type: "Feature",
                geometry: troncon.geom,
                properties: {
                    site: troncon.site,
                },
            })),
        };

        res.json(geojson);
    } catch (error) {
        console.error('Erreur lors de la récupération des données géospatiales :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des données géospatiales' });
    }
});

export default router;
