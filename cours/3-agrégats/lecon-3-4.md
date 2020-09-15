# Restriction sur agrégats

Il arrive que nous souhaitions restreindre les résultats avec une condition sur un calcul d'agrégat. Par exemple, on peut vouloir chercher le nombre de clients par pays, uniquement pour les pays avec plus de 10 clients. Dans la requête suivante, il faudrait donc chercher *à la main* les pays avec plus de 10 clients, ce qui est à proscrire car non-automatique.

```sql
SELECT Pays, COUNT(*)
    FROM Client
    GROUP BY Pays;
```

La première idée serait de faire une restriction sur le `COUNT(*)` dans la clause `WHERE`, comme ci-dessous. Comme vous pourrez le voir, cette requête ne fonctionne pas, car le `COUNT(*)` est mal placé.

```sql
# /!\ requête renvoyant une erreur
SELECT Pays, COUNT(*) 
    FROM Client
    WHERE COUNT(*) >= 10
    GROUP BY Pays;
```

Pour effectuer ces restrictions, il est nécessaire d'utiliser la clause `HAVING`, situé obligatoirement après le `GROUP BY`. Dans notre exemple, nous devons donc écrire la requête suivante.

```sql
SELECT Pays, COUNT(*) 
    FROM Client
    GROUP BY Pays
    HAVING COUNT(*) >= 10;
```

Pour améliorer la lisibilité, il est aussi possible de renommer le résultat de l'agrégat, et d'utiliser ce nouveau nom dans la condition du `HAVING`.

```sql
SELECT Pays, COUNT(*) AS Nb
    FROM Client
    GROUP BY Pays
    HAVING Nb >= 10;
```

## Placement des différentes clauses

Nous avons maintenant vu tous les clauses existantes dans une requête `SQL` de type `SELECT`. Il est important de se souvenir de l'ordre d'apparition de celles-ci, tel que présenté ci-dessous. Si cet ordre n'est pas respecté, le moteur SGBD ne pourra pas traiter la requête et renverra une erreur.

```sql
# requête à ne pas exécuter
SELECT attributs, calculs, agrégats
	FROM tables
	WHERE conditions
	GROUP BY attributs
	HAVING conditions
	ORDER BY attributs
	LIMIT nombre;
```


## Exercices

1. Lister les fournisseurs ne fournissant qu'un seul produit
2. Lister les catégories dont les prix sont en moyenne supérieurs strictement à 150 euros
3. Lister les fournisseurs ne fournissant qu'une seule catégorie de produits
4. Lister les fonctions pour lesquelles la moyenne d'âge des employés dépasse les 45 ans
