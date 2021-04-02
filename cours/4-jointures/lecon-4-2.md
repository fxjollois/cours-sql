# Jointures internes

## Principe

Une **jointure interne** (`INNER JOIN`) est faite pour pallier aux problèmes de la *jointure naturelle*. Ici, nous allons préciser sur quel(s) attribut(s) nous allons chercher l'égalité. Si les attributs ont le même nom entre les 2 tables, on peut utiliser le mot-clé `USING`. En reprenant le premier exemple précédent, voici la requête reliant les produits avec les catégories, réalisée avec une jointure interne.

```sql
SELECT *
	FROM Produit INNER JOIN Categorie
		USING (CodeCateg);
```

Par contre, on peut aussi préciser explicitement quel attribut de chaque table on veut utiliser. Ceci est utile quand les attributs n'ont pas le même nom (ce qui arrive). Attention, si un attribut est présent dans les deux tables, il va falloir préciser auquel on fait référence en indiquant la table d'origine avant (avec le formalisme `table.attribut`). Voici donc une autre façon de réaliser une jointure interne.

```sql
SELECT *
	FROM Produit INNER JOIN Categorie
		ON Produit.CodeCateg = Categorie.CodeCateg;
```

De même pour les jointures naturelles, il est possible de réaliser d'autres opérations, en plus de la jointure. 

Si nous souhaitons refaire la requête récupérant les produits (nom du produit et du fournisseur) fournis par des entreprises françaises, nous aurons la requête suivante.

```sql
SELECT NomProd, Societe
	FROM Produit INNER JOIN Fournisseur
		USING (NoFour)
	WHERE Pays = "France";
```

Si on souhaite maintenant le nom de catégorie et le nombre de produits associés, avec une jointure interne, voici comment faire.

```sql
SELECT NomCateg, COUNT(*) AS "Nb Produits"
	FROM Produit INNER JOIN Categorie
		USING (CodeCateg)
	GROUP BY NomCateg
	ORDER BY 2 DESC;
```


## Alias pour les tables

Pour simplifier l'écriture des requêtes, il est possible de renommer temporairement une table (valable uniquement dans la requête présente), avec l'opérateur `AS`.

Reprenons la requête précédent en renommant `Produit` en `P` et `Categorie` en `C`. Ce processus est utile quand on écrit des requêtes longues.

```sql
SELECT *
	FROM Produit AS P INNER JOIN Categorie AS C
		ON P.CodeCateg = C.CodeCateg;
```

Il est aussi possible de ne pas indiquer le terme `AS`, le renommage sera tout de même pris en compte.

Ainsi, la requête précédente devient la suivante.

```sql
SELECT *
	FROM Produit P INNER JOIN Categorie C
		ON P.CodeCateg = C.CodeCateg;
```


## Jointures multiples

De même que pour une jointure naturelle, il est possible d'enchaîner les jointures internes, autant de fois que nécessaire. Ceci peut produire des requêtes très longues et difficiles à lire.

```sql
SELECT *
    FROM Produit 
    	INNER JOIN Categorie USING (CodeCateg)
        INNER JOIN Fournisseur USING (NoFour);
```

## Lignes manquantes

Le défaut de ce type de jointure (*naturelle* ou *interne*) est qu'une ligne d'une table n'ayant pas de correspondances dans l'autre table n'est pas conservé dans le résultat.

Si nous comptons le nombre de clients dans la table `Client`, et le nombre de clients différents dans la table `Commande`, nous voyons que ce n'est pas le même résultat. Certains client de la table `Client` n'ont pas de commandes associés.

```sql
SELECT COUNT(*)
	FROM Client;
```

```sql
SELECT COUNT(DISTINCT CodeCli)
	FROM Commande;
```


## Exercices

1. Récupérer les informations des fournisseurs pour chaque produit, avec une jointure interne
2. Afficher les informations des commandes du client `"Lazy K Kountry Store"`, avec une jointure interne
3. Afficher le nombre de commande pour chaque messager (en indiquant son nom), avec une jointure interne
4. Afficher pour chaque employé le nom et le prénom de son responsable
