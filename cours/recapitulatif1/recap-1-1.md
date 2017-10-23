# Présentation de la base

Dans ce TP, nous utilisons la base de donnes `Gymnase2000`, contenant les informations d'un petit club de banlieue nord parisienne. En regardant la liste des tables, vous trouverez les 7 suivantes :

- **`Sports`** : sports pratiqués
- **`Sportifs`** : sportifs inscrits 
- **`Gymnases`** : gymnases utilisés
- **`Seances`** : séances prévues (pour un sport, et entraînées chacune par un sportif)
- **`Jouer`** : qui joue à quoi ?
- **`Arbitrer`** : qui arbitre quoi ?
- **`Entrainer`** : qui entraîne quoi ?

Dans la table `Seances` et dans la table `Entrainer`, l'identifiant des sportifs entraîneurs est nommé `IdSportifEntraineur`. Et il  faut faire attention aux minuscules/majuscules dans les différents champs de type texte. Si un sportif a un conseiller éventuellement, l'identifiant de celui-ci est indiqué dans `IdSportifConseiller` (`NULL` sinon).
