# Calculs arithmétiques


## Calcul simple

Il est possible d'effectuer des calculs arithmétiques dans un `SELECT`, à l'aide des opérateurs classiques : `+`, `-`, `*`, `/`, `()`. 

Voici un premier exemple de calcul dans une requête. On additionne les unités en stock avec les unités commandées, pour chaque produit.

```sql
SELECT *, UnitesStock + UnitesCom
    FROM Produit;
```

Bien évidemment, on peut vouloir faire aussi un projection en même temps, en n'affichant que la référence du produit.

```sql
SELECT RefProd, UnitesStock + UnitesCom
    FROM Produit;
```

### Renommage 

Pour plus de lisibilité, il est d'usage de renommer un calcul, grâce à `AS`. Si l'on désire mettre des accents (en français) et/ou des espaces, il est nécessaire d'ajouter les `"..."` (ou `'...'`). 

```sql
SELECT RefProd AS Reference, 
		UnitesStock + UnitesCom AS "Unités disponibles"
    FROM Produit;
```

Vous remarquerez qu'il est possible de passer à la ligne suivante dans un `SELECT` pour rendre le code plus simple à lire. En effet, en `SQL`, on peut écrire tout sur une même ligne, jusqu'à un mot par ligne. Le moteur du SGBD supprime les espaces inutiles et les sauts de lignes avant l'exécution de la requête. Mais il est important d'avoir un **code lisible** (débugage plus simple, compréhension de celui-ci par un autre aisée, réutilisation facilitée, ...).

Dans cet exemple, nous utilisons la multiplication `*` pour calculer le montant en stock pour chaque produit, égal au prix unitaire multiplié par la quantité de produits en stock.

```sql
SELECT RefProd, 
		PrixUnit * UnitesStock AS "Montant en stock"
    FROM Produit;
```

### Combinaison de clauses

Puisque nous sommes dans une requête `SELECT`, nous pouvons bien évidemment utiliser toutes les restrictions que l'on désire, dans le `WHERE`.

```sql
SELECT RefProd, 
		PrixUnit * UnitesStock AS "Montant en stock indisponible"
    FROM Produit
    WHERE Indisponible = 1;
```

Et bien évidemment, on peut aussi trier le résultat, à l'aide de `ORDER BY`, et se limiter à n lignes, à l'aide de `LIMIT`. Nous avons donc ici les trois produits indisponibles avec le plus haut montant en stock.

```sql
SELECT RefProd, 
		PrixUnit * UnitesStock AS "Montant en stock"
    FROM Produit
    WHERE Indisponible = 1
    ORDER BY 2 DESC
    LIMIT 3;
```

### Calcul complexe

Les calculs peuvent être un peu plus complexes, grâce à l'utilisation des parenthèses. Par exemple, considérons que nous voulons garder au moins 10 unités de chaque produit. Nous calculons dans la requête suivante le montant en stock directement disponible, en tenant compte de la contrainte précédente.

```sql
SELECT RefProd, 
		PrixUnit * (UnitesStock - 10)
    FROM Produit
    WHERE UnitesStock >= 10;
```

Toute expression mathématique combinant les opérateurs classiques est donc acceptable à ce niveau.

### Arrondi

Il est possible d'obtenir l'arrondi d'un réel grâce à la fonction `ROUND()`. Dans l'exemple ci-dessous, nous calculons une augmentation de 5% des prix des produits.

```sql
SELECT RefProd, 
		ROUND(PrixUnit * 1.05) AS "Nouveau Prix"
    FROM Produit;
```

L'arrondi ci-dessus est à l'entier. Si l'on désire un arrondi à 2 décimales (et donc les centimes dans notre cas), il faut ajouter un 2 comme second paramètre de la fonction `ROUND()`.

```sql
SELECT RefProd, 
		ROUND(PrixUnit * 1.05, 2) AS "Nouveau Prix"
    FROM Produit;
```

## Exercices

La table `DetailCommande` contient l'ensemble des lignes d'achat de chaque commande. Calculer, pour la commande numéro `10251`, pour chaque produit acheté dans celle-ci, le montant de la ligne d'achat en incluant la remise (stockée en proportion dans la table). Afficher donc :
	- le prix unitaire, 
	- la remise, 
	- la quantité, 
	- le montant de la remise, 
	- le montant à payer pour ce produit
