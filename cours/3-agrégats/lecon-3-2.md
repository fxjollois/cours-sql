# Calculs statistiques simples

Outre les dénombrements, il est possible de faire quelques calculs statistiques de base, tels que somme, moyenne, minimum et maximum. 

## Somme

La fonction `SUM(attribut)` permet donc de faire la somme des valeurs non nulles de l'attribut passé en paramètre. La requête suivante nous permet d'avoir le nombre total d'unités de produits en stock.

```sql
SELECT SUM(UnitesStock)
	FROM Produit;
```

Bien évidemment, ce calcul peut se faire suite à une restriction, c'est-à-dire sur un sous-ensemble de la table. Ici, nous calculons le nombre d'unités en stock pour tous les produits de la catégorie `1`.

```sql
SELECT SUM(UnitesStock)
	FROM Produit
	WHERE CodeCateg = 1;
```

## Moyenne et médiane

Bien qu'avec un `SUM()` et un `COUNT()`, on puisse obtenir la moyenne, il existe la fonction `AVG(attribut)` (pour *average*) permettant de la calculer directement. La requête ci-dessous permet de calculer le prix unitaire moyen des produits.

```sql
SELECT AVG(PrixUnit)
	FROM Produit;
```

Dans la plupart des cas, il sera nécessaire d'améliorer la lisibilité du résultat en arrondissant les valeurs, très souvent à 2 décimales, comme ci-après.

```sql
SELECT ROUND(AVG(PrixUnit), 2)
	FROM Produit;
```

En statistique, il est souvent préférable de calculer la médiane plutôt que la moyenne, ce qu'on peut faire avec la fonction `MEDIAN(attribut)`, tel que l'on peut voir dans la requête suivante.

```sql
SELECT MEDIAN(PrixUnit)
	FROM Produit;
```

## Minimum et maximum

Enfin, deux autres fonctions utiles sont disponibles : `MIN(attribut)` et `MAX(attribut)`, permettant d'obtenir respectivement le minimum et le maximum d'un attribut, sans tenir compte des valeurs nulles. Nous obtenons donc avec cette requête le prix minimum et le prix maximum.

```sql
SELECT MIN(PrixUnit), MAX(PrixUnit)
	FROM Produit
```

## Exercices

1. Calculer le coût moyen du port pour les commandes du client dont le code est `"QUICK"` (attribut `CodeCli`) 
2. Calculer le coût du port minimum et maximum des commandes
3. Pour chaque messager (par leur numéro : `1`, `2` et `3`), donner le montant total des frais de port leur correspondant
    - il faut faire 3 requêtes différentes donc
