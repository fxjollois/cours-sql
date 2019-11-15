# Jointures naturelles


Une **jointure** entre deux tables permet de combiner l'information contenue entre les deux tables. Comme vous avez pu le remarquer, les données sont découpées de façon très détaillées dans différentes tables, ceci pour différentes raisons. Pour recouper ces données, il est nécessaire de les combiner et donc de faire des jointures.


## Principe

La **jointure naturelle** (`NATURAL JOIN`) permet de recouper les lignes de chaque table ayant les mêmes valeurs pour les attributs ayant le même nom entre les deux tables.

Par exemple, nous souhaitons connaître le nom de la catégorie de chaque produit. Pour cela, nous devons joindre les deux tables `Produit` et `Categorie`. Dans les deux, il existe l'attribut `CodeCateg`. La jointure va donc permettre d'ajouter, pour chaque produit, le nom de la catégorie (`NomCateg`) et la descrition (`Description`).

```sql
SELECT *
	FROM Produit NATURAL JOIN Categorie;
```

Bien évidemment, il est possible de réaliser toute autre opération vu précédemment, dont les projections. Ici, nous nous restreignons à la référence du produit, son nom et la catégorie de celui-ci.

```sql
SELECT RefProd, NomProd, NomCateg
	FROM Produit NATURAL JOIN Categorie;
```

Si on souhaite avoir l'ensemble des colonnes d'une des tables, il est aussi possible de l'indiquer dans le `SELECT` avec le formalisme `table.*`: 

```sql
SELECT RefProd, NomProd, Categorie.*
	FROM Produit NATURAL JOIN Categorie;
```

Ce processus nous permet aussi de se faire des restrictions sur un attribut d'une table pour qu'elles soient répercuter sur l'autre. Par exemple, ici, on ne retient que les produits fournis par des entreprises françaises.

```sql
SELECT NomProd, Societe
	FROM Produit NATURAL JOIN Fournisseur
	WHERE Pays = "France";
```

Mais il est d'autant plus intéressant quand on veut faire des agrégats. Par exemple, si nous souhaitons connaître le nombre de produits par catégorie, plutôt que de présenter les codes de catégorie, nous allons chercher à présenter le nom des catégories. Le résultat sera ainsi plus parlant.

```sql
SELECT NomCateg, COUNT(*) AS "Nb Produits"
	FROM Produit NATURAL JOIN Categorie
	GROUP BY NomCateg
	ORDER BY 2 DESC;
```


## Multiples jointures

Il est bien sûr possible de faire plusieurs jointures naturelles dans une même requête. Pour cela, il faut ajouter des parenthèses chaque `NATURAL JOIN` (et les tables concernées).

Ici, nous ajoutons à la fois les informations de `Categorie`, mais aussi de `Fournisseur`, à la table `Produit`.

```sql
SELECT *
    FROM (Produit NATURAL JOIN Categorie) 
    	NATURAL JOIN Fournisseur;
```


## Problème possible

Des problèmes peuvent survenir quand les tables ont des noms de variables identiques, mais qu'on ne souhaite pas à ce qu'elles servent pour la jointure. Dans les tables `Client` et `Employe`, il existe les attributs `Ville`, `Pays`, ... présents dans les deux tables. Ceci va perturber la jointure, puisqu'il va chercher à faire correspondre (i.e. chercher l'égalité) tous les attributs ayant le même nom.

```sql
SELECT *
    FROM (Commande NATURAL JOIN Client) 
    	NATURAL JOIN Employe;
```

Un **jointure naturelle** n'est donc pas réalisable lorsque :

- les tables ont des attributs ayant le même nom qu'on ne cherche pas à mettre en relation
- les tables n'ont pas d'attributs avec le même nom

## Exercices

1. Récupérer les informations des fournisseurs pour chaque produit
2. Afficher les informations des commandes du client `"Lazy K Kountry Store"`
3. Afficher le nombre de commande pour chaque messager (en indiquant son nom)
