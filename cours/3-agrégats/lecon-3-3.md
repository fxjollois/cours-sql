# Agrégats selon attribut(s)

Si l'on désire avec un calcul statistique selon un critère (que l'on appellera *critère d'agrégation*), il n'est pas nécessaire de répéter la requête autant de fois qu'on a de valeurs pour le critère. Il existe pour cela la commande `GROUP BY`, qui permet de faire un calcul d'agrégat (`COUNT()`, `SUM()`, `AVG()`, ...) pour chaque valeur du critère d'agrégation.

Le `GROUP BY` doit être obligatoirement placé après le `WHERE` dans la requête.

## Agrégat simple 

Le critère d'agrégation est souvent un seul attribut (par exemple, on souhaite le nombre d'étudiants de chaque sexe).

### Utilisation classique

Le premier exemple que nous allons voir est le dénombrement. Nous désirons le nombre de clients de la société, pour chaque pays d'origine. Donc, nous voudrions voir afficher l'attribut `Pays` en plus du compte. La requête suivante, *erronée*, est celle qu'on pourrait écrire en premier.

```sql
SELECT Pays, COUNT(*)
	FROM Client;
```

Une fois exécutée, on se rend compte qu'elle ne renvoie qu'une seule ligne, avec un seul pays (celui en dernier dans la table) et le nombre total de clients. Pour être correct, il faut spécifier le critère d'agrégation (ici le pays) dans la clause `GROUP BY`, comme ci-dessous.

```sql
SELECT Pays, COUNT(*)
	FROM Client
	GROUP BY Pays;
```

Ici, le résultat est ordonné par pays. On peut améliorer la lisibilité du résultat en renommant le dénombrement et en ordonnant de manière décroissante par celui-ci.

```sql
SELECT Pays, COUNT(*) AS "Nb clients"
	FROM Client
	GROUP BY Pays
	ORDER BY 2 DESC;
```

Ce mécanisme fonctionne bien évidemment avec tous les autres calculs d'agrégats que nous avons vu précédemment (`SUM()`, `AVG()`, ...).

### Combinaison d'agrégats

Il est aussi possible de calculer directement plusieurs agrégats en une seule requête, comme ci-dessous. Nous cherchons donc à avoir, pour chaque fournisseur :

- le nombre de produits
- le prix moyen (arrondi à l'entier)
- le prix minimum
- le prix maximum

```sql
SELECT NoFour, 
        COUNT(*) AS "Nb produits",
        ROUND(AVG(PrixUnit)) AS "Prix moyen",
        MIN(PrixUnit) as "Prix minimum",
        MAX(PrixUnit) as "Prix maximum"
	FROM Produit
	GROUP BY NoFour;
```

## Agrégat complexe

Par contre, il arrive que nous souhaitions avoir un critère d'agrégation prenant en compte plusieurs attributs. Par exemple, on peut vouloir connaître le nombre d'étudiants en DUT STID par sexe et par année (1ère ou 2ème). Dans ce cas, nous aurons à calculer quatre valeurs :

- le nombre d'hommes en 1ère année
- le nombre d'hommes en 2ème année
- le nombre de femmes en 1ère année
- le nombre de femmes en 2ème année

Dans ce cas, il faut spécifier les attributs à la fois dans le `SELECT` et dans le `GROUP BY`. Ci-dessous, nous cherchons donc à connaître le nombre de produits pour chaque fournisseur et chaque catégorie. La première ligne nous indique qu'on a 2 produits en stock du fournisseur 1 et de la catégorie 1.

```sql
SELECT NoFour, CodeCateg, COUNT(*)
	FROM Produit
	GROUP By NoFour, CodeCateg;
```

Plus généralement, il est obligatoire que les attributs présents dans le `SELECT` soient aussi présents dans le `GROUP BY`. Dans le cas contraire, le résultat ne correspondra pas à ce qu'on cherche à obtenir et ce n'est pas toujours facile à repérer.

Par exemple ici, en ne mettant pas CodeCateg dans le `GROUP BY`, on a bien un résultat mais seul un numéro de catégorie est retenu (a priori, le dernier dans la table) pour chaque fournisseur. Le fournisseur 4, qui a trois catégories (6, 7 et 8) avec chacune 1 seul produit, n'est plus que sur une seule ligne (avec la catégorie 7 affichée, mais bien 3 produits en tout).

```sql
SELECT NoFour, CodeCateg, COUNT(*)
	FROM Produit
	GROUP By NoFour;
```
## Exercices

1. Donner le nombre d'employés par fonction
2. Donner le montant moyen du port par messager
3. Donner le nombre de catégories de produits fournis par chaque fournisseur
4. Donner le prix moyen des produits pour chaque fournisseur et chaque catégorie de produits fournis par celui-ci
