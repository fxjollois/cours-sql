# Requêtage simple

## Exercice 1

> Lister tous les produits vendus en bouteilles ou en canettes

Dans cette requête, nous devons commencer à regarder le contenu de la table `Produit`, et en particulier la colonne `QteParUnit`.

```sql
SELECT DISTINCT QteParUnit
    FROM Produit;
```

On remarque que les mots `"bouteille"` et `"canette"` apparaissent, avec un certain nombre de caractères avant ou après. Dans ce cas, nous allons utiliser l'opérateur de comparaison `LIKE`, qui nous permet d'utiliser le caractère spécifique `%`. Celui-ci nous permet de dire qu'à cette position de la chaîne de caractères, il peut y avoir (ou non) un ou plusieurs caractères. On va donc avoir la requête suivante

```sql
SELECT *
    FROM Produit
    WHERE QteParUnit LIKE "%bouteille%"
    OR QteParUnit LIKE "%canette%";
```

Vous remarquerez que nous prenons le singulier, car certains produits sont vendus à l'unité.

## Exercice 2

> Lister les fournisseurs français, en affichant uniquement le nom, le contact et la ville, trié par ville

Ici, nous allons d'abord nous concentrer sur les fournisseurs français. Ce sont ceux pour lesquels l'attribut `Pays` est égal à la chaîne `"France"`.

Ensuite, on indique dans la partie `SELECT` le nom des attributs que l'on veut récupérer au final (ici `Societe`, `Contact` et `Ville`).

Enfin, puisqu'il est demandé de trier par ville, sans précision sur l'ordre, on va l'indiquer dans le `ORDER BY`.

```sql
SELECT Societe, Contact, Ville
    FROM Fournisseur
    WHERE Pays = "France"
    ORDER BY Ville;
```

## Exercice 3

> Lister les produits (nom en majuscule et référence) du fournisseur n° 8 dont le prix unitaire est entre 10 et 100 euros, en renommant les attributs pour que ce soit explicite

Ici, rien de compliqué non plus. On fait une restriction aux produits du fournisseur numéro 8 (avec `NoFour = 8`) et aux produits dont le prix est entre 10 et 100 (avec `PrixUnit BETWEEN 10 AND 100`).

Le seul changement ici est de modifier le nom des colonnes (avec `AS`) pour avoir un rendu plus informatif.

```sql
SELECT NomProd as "Produit du fournisseur 8",
        RefProd AS "Référence"
    FROM Produit
    WHERE NoFour = 8
    AND PrixUnit BETWEEN 10 AND 100;
```

## Exercice 4

> Lister les numéros d'employés ayant réalisé une commande (cf table Commande) à livrer en France, à Lille, Lyon ou Nantes

Cette demande se retreint à des numéros d'employés. Nous allons donc mettre uniquement `NoEmp` dans la partie `SELECT`, en précisant que nous ne voulons pas deux fois le même numéro (avec `DISTINCT`).

Ensuite, nous nous restrignons aux commandes livrées en France (avec `PaysLiv = "France"`). Pour les villes, puisque nous avons 3 valeurs recherchées, le mieux est d'utiliser l'opérateur `IN`. Celui permet de lister les valeurs recherchées dans un vecteur indiqué par des `()`, les valeurs étant séparées par des `,`. 

Enfin, pour avoir un résultat plus lisible, il est préférable ici d'ordonner celui-ci, afin d'avoir les numéro d'employé dans l'ordre.

```sql
SELECT DISTINCT NoEmp
    FROM Commande
    WHERE PaysLiv = "France"
    AND VilleLiv IN ("Lille", "Lyon", "Nantes")
    ORDER BY 1;
```

## Exercice 5

> Lister les produits dont le nom contient le terme "tofu" ou le terme "choco", dont le prix est inférieur à 100 euros (attention à la condition à écrire)

Pour cette dernière requête, on reprend l'opérateur `LIKE` pour chercher les chaînes `tofu` ou `choco` dans le nom du produit. Et on se restreint en plus au produit dont le prix est inférieur à 100.

Mais il faut faire attention lorsqu'on écrit la condition. En effet, si on enlève les parenthèses dans la requête suivante, le résultat change. Il faut toujours être prudent quand on mélange des `AND` et des `OR` (comme lorsqu'on mélange des `+` et des `-`). Mieux vaut avoir trop de parenthèses que pas assez.

```sql
SELECT NomProd AS Produit, PrixUnit as Prix
    FROM Produit
    WHERE (NomProd LIKE "%tofu%" OR NomProd LIKE "%choco%")
    AND PrixUnit < 100;
```
