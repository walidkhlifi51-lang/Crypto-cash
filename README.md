# CryptoCash Tap to Pay (Stripe)

Application mobile (React Native / Expo) destinée aux commerçants pour encaisser via **Tap to Pay**, enregistrer des cartes clients (SetupIntent), rembourser rapidement et exporter l'historique en PDF.

## Fonctionnalités clés
- Authentification simple par email ou téléphone + mot de passe.
- Encaissement **Tap to Pay** avec Stripe Terminal (lecteur logiciel iOS/Android, simulé dans cette démo).
- Enregistrement et débit de cartes sauvegardées via Stripe SetupIntent.
- Historique filtrable (jour/mois/année, statut) et **export PDF** pour la comptabilité.
- Remboursement total ou partiel depuis l'ID du PaymentIntent.

## Structure
- `App.tsx` : navigation simple entre les écrans et initialisation Stripe.
- `src/services/stripeTerminal.ts` : intégration Tap to Pay, connexion Terminal, sauvegarde carte, remboursement.
- `src/screens/*` : écrans Login/Inscription, Accueil, Paiement, Historique + PDF, Remboursement, Cartes enregistrées.
- `src/components/*` : filtres, cartes récap, liste des transactions.

## Démarrage
```bash
npm install
npm run start
```
Puis lancer sur un simulateur ou appareil réel (Tap to Pay requiert un appareil compatible et des clés Stripe). Remplacez dans `App.tsx` :
- `PUBLISHABLE_KEY` par votre clé Stripe test ou live.
- `TERMINAL_BASE_URL` par votre backend Stripe Terminal (endpoints `connection_token`, `create_payment_intent`, `refund`).
- `SETUP_INTENT_CLIENT_SECRET` + `DEMO_CUSTOMER_ID` par les valeurs renvoyées par votre backend pour enregistrer une carte.

## Sécurité/Production
- Stocker les tokens de session dans `expo-secure-store` (déjà préparé dans `AuthContext`).
- Ne jamais mettre de clés secrètes dans l'app : tous les appels sensibles doivent passer par votre API sécurisée.
- Activer 3DS et la fraude Stripe Radar côté backend.

## TODO production
- Remplacer les données de démonstration (`demoTransactions`) par des appels API.
- Ajouter une navigation complète (React Navigation) et la gestion des états de connexion Terminal.
- Couvrir les tests E2E (Detox) pour les flux de paiement et remboursement.
