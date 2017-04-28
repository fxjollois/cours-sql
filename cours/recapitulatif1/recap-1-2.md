# Calculs et fonctions

## Exercice 1

> Récupérer l'année de naissance et l'année d'embauche des employés

Dans la table `Employe`, les dates de naissance et d'embauche sont stockées au format `VARCHAR2`, c'est-à-dire en chaîne de caractères. Il faut donc extraire l'année à l'aide de la fonction `SUBSTR()`, en indiquant le début de la chaîne à extraire et sa taille.

```sql
SELECT Nom, Prenom,
        SUBSTR(DateNaissance, 6, 4) AS "Année naissance", 
        SUBSTR(DateEmbauche, 6, 4) AS "Année embauche"
    FROM Employe;
```

## Exercice 2

> Calculer à l'aide de la requête précédente l'âge d'embauche et le nombre d'années dans l'entreprise

A la requête précédente, on ajoute le calcul de l'âge d'embauche en soustrayant l'année de naissance à l'année d'embauche. Même si la fonction `STRFTIME()` renvoie une chaîne de caractère, le moteur transforme celle-ci en entier pour pouvoir réaliser la soustraction.

Pour avoir l'année courante, plutôt que de la coder en *dur* (en mettant `2016`), on la calcule à partir de la date courante (`"now"` dans `STRFTIME()`).

```sql
SELECT Nom, Prenom,
        SUBSTR(DateNaissance, 6, 4) AS "Année naissance", 
        SUBSTR(DateEmbauche, 6, 4) AS "Année embauche",
        SUBSTR(DateEmbauche, 6, 4) - SUBSTR(DateNaissance, 6, 4) AS "Age embauche",
        STRFTIME("%Y", "now") - SUBSTR(DateEmbauche, 6, 4) AS "Années en entreprise"
    FROM Employe;
```

## Exercice 3

> Afficher le prix unitaire original, la remise en pourcentage, le montant de la remise et le prix unitaire avec remise (tous deux arrondis aux centimes), pour les lignes de commande dont la remise est strictement supérieure à 10%

La restriction à faire ici est très simple, puisqu'on vérifie uniquement que la remise est supérieure à `.1` (et donc 10%). 

Ensuite, en plus du prix unitaire, on ajoute trois informations

- la remise en pourcentage (on multiplie par 100, on transforme en entier pour ne pas avoir `.0`, et on concatène avec le caractère `"%"`)
- le montant de la remise, arrondi à deux décimales
- le montant du produit après remise, arrondi aussi à deux décimales

```sql
SELECT PrixUnit, 
        CAST(Remise * 100 AS INTEGER) || " %" AS Remise,
        ROUND(PrixUnit * Remise, 2) AS "Montant remise",
        ROUND(PrixUnit * (1 - Remise), 2) AS "Prix avec remise"
    FROM DetailCommande
    WHERE Remise > .1;
```

## Exercice 4

> Calculer le délai de livraison (en jours) pour les commandes dont l'envoi est après la date butoir, ainsi que le nombre de jours de retard

Comme indiqué dans le cours, les comparaisons de date se font très facilement avec les opérateurs classiques. La restriction à faire ici est de vérifier que la date d'envoi (`DateEnv`)  est postérieure à la date limite de livraison (`ALivAvant`). 

Ensuite, pour compter le nombre de jours entre deux dates, le plus simple est de passer par le jour julien. C'est un jour de référence, à partir duquel la fonction `JULIANDAY()` compte le nombre de jours jusqu'à la date passée en paramètre. Ceci permet donc de faire des différences en jours entre dates. 

```sql
SELECT NoCom, CodeCli, DateCom, ALivAvant, DateEnv,
        JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS "Délai livraison",
        JULIANDAY(DateEnv) - JULIANDAY(ALivAvant) AS "Nb jours de retard"
    FROM Commande
    WHERE DateEnv > ALivAvant;
```

## Exercice 5

> Rechercher les sociétés clientes, dont le nom de la société contient le nom du contact de celle-ci

Dans cet exercice, nous souhaitons chercher les sociétés pour lesquels le nom de contact est présent dans le nom de la société. Pour cela, nous utilisons bien évidemment un `LIKE` avec le `"%"`. 

Mais la difficulté réside dans la création de la chaîne contenant le nom du contact avec un `"%"` avant et après. Pour cela, nous utilisons l'opérateur de concaténation de chaînes de caractères `||`.

```sql
SELECT Societe, Contact
    FROM Client
    WHERE Societe LIKE "%" || Contact || "%";
```
