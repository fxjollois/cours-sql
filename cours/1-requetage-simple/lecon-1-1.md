# Introduction

Une base de données est un ensemble de **tables** (ou aussi *relation* - d'où le nom de **base de données relationnelles**), dont le contenu est la description d'**entités** (clients, produits, étudiants, matières, ...) ou d'**associations** (achat d'un produit par un client, note d'un étudiant à une matière, ...). 

Elle a pour but de simplifier le fonctionnement d'une organisation ou d'une entreprise via une ou plusieurs applications informatiques.

Nous devons utiliser ce qu'on appelle un **Système de Gestion de Bases de Données** (ou *SGBD*) pour gérer ces bases et faire toutes les opérations nécessaires sur celles-ci (création, insertion, modification, interrogation, suppression).

## Exemple de table

Voici un exemple de table simple, décrivant des étudiants. Chaque ligne est appelée un **tuple** ou *enregistrement*. Chaque colonne est appelée un **attribut** ou une *variable*. 

Table `Etudiant`: 

 IdEtu | Nom | Prenom | Sexe | Age 
-------|-----|--------|------|----
 1     | Remin	| Norbert	| H	| 19 
 3     | Constant	| Raphaelle	| F	| 20 
 4     | Fleurot	| Isabelle	| F	| 19 
 5     | Yannic	| Sandrine	| F	| 18 
 6     | Josse	| Francis	| H	| 20 
 
## Modèle relationnel

Afin de créer des bases de données, il a été défini un modèle relationnel permettant d'établir des contraintes de construction de celles-ci. Ces contraintes ont pour but de limiter le plus possible les problèmes à gérer plus tard. On parle de règles d'intégrité structurelle.

### Contrainte de domaine

Tout attribut a un **domaine** de valeurs, qui sont ici les suivants :

- `IdEtu` : entier,
- `Nom`, `Prenom` : chaîne de caractères
- `Sexe` : un seul caractère, éventuellement limité à `H` et `F`
- `Age` : entier aussi

Ceci a pour but d'éviter au maximum les erreurs introduites lors d'insertion de données.

### Unicité de la clé

Comme nous pouvons le remarquer dans l'exemple de table, le premier attribut `IdEtu`est un entier différent pour chaque ligne. C'est ce qu'on appelle une **clé primaire**. Celle-ci est un attribut (ou groupe d'attributs) permettant d'identifier chaque ligne de la table de manière unique. Cela permettra de faire des liens entre lignes de plusieurs tables sans ambiguïté.

### Contrainte d'entité

Une *clé primaire* ne peut pas avoir de valeur `NULL` (non-présence de l'information). Il doit absolument y avoir une valeur pour l'attribut, ou pour chaque attribut dans le cas d'une clé multiple.

### Contrainte de référence

On peut imaginer la table suivante :

Table `Note` :

 IdEtu | Matière | Note
-------|---------|------
 1 | SQL | 19
 1 | Stat | 11
 2 | Stat | 7
 ... | ... | ...

L'attribut `IdEtu` présent ici fait **référence** à l'attribut `IdEtu` de la table `Etudiant` vue plus haut. On parle aussi de **clé externe** ou de ** clé étrangère**. C'est un attribut d'une relation devant apparaître comme clé primaire dans une autre relation.

La contrainte de référence veut que toute valeur présente dans la colonne `IdEtu` de la table `Note` doit être présente dans la colonne `IdEtu` de la table `Etudiant`. Cela évite de mettre une note à un étudiant qui n'existe pas.

## Langage SQL

Le langage `SQL` est la norme internationale pour interroger une base de données relationnelles (comme Oracle, SQL Server, SQLite, DB2, ...). L'intérêt de ce langage est qu'il est très puissant et très bien documenté (nombreux livres et sites internet dédiés).

Il permet, via ce qu'on appelle des **requêtes**, de créer, manipuler, interroger, modifier, supprimer toutes les données présentes. Dans ce cours, nous nous limiterons à son usage pour l'interrogation de données.
