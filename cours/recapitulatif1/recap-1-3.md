# Agrégats

## Exercice 1

> Donner la quantité totale commandée pour chaque produit

Pour rappel, la table `DetailCommande` contient toutes les lignes d'achat pour chaque commande. C'est dans celle-ci que l'on connaît combien d'unités de produit (avec la colonne `Qte`) a été acheté. Il faut donc faire une somme de cet attribut. Et puisque la demande est pour chaque produit, nous devons faire un regroupement (via `GROUP BY`) sur la référence du produit (`RefProd`).

```sql
SELECT RefProd, SUM(Qte) AS "Quantité commandée"
    FROM DetailCommande
    GROUP BY RefProd;
```

## Exercice 2

> Donner les cinq clients avec le plus de commandes, triés par ordre décroissant

Ici, la première opération à faire est de calculer le nombre de commandes de chaque client. Puisqu'une ligne de la table `Commande` correspond à une commande d'un client, il suffit de compter le nombre de lignes (avec `COUNT(*)`) pour chaque client (avec `GROUP BY`).

Puisqu'on veut les clients avec le plus de commandes, il est nécessaire de faire un tri (avec `ORDER BY`), celui-ci devant ien évidemment être décroissant (avec `DESC`).

Enfin, on se limite aux 5 premiers clients avec `LIMIT 5`.

```sql
SELECT CodeCli, COUNT(*) AS NbCommande
    FROM Commande
    GROUP BY CodeCli
    ORDER BY NbCommande DESC
    LIMIT 5;
```

## Exercice 3

> Calculer le montant total des lignes d'achats de chaque commande, sans et avec remise sur les produits

Ici, le but est donc de calculer le montant de chaque commande (hors frais de port), sans et avec remise. Il faut donc faire un calcul pour chaque commande, ce qui implique `GROUP BY NoCom`. 

Ensuite, il est totalement possible de faire un calcul dans la fonction `SUM()` comme fait ici.

```sql
SELECT NoCom, 
        SUM(PrixUnit * Qte) AS "Montant sans remise",
        SUM(PrixUnit * Qte * (1 - Remise)) AS "Montant avec remise"
    FROM DetailCommande
    GROUP BY NoCom;
```

## Exercice 4

> Pour chaque catégorie avec au moins 10 produits, calculer le montant moyen des prix

Cette requête nécessite deux calculs d'agrégats

- un dénombrement (avec `COUNT(*)`) pour savoir combien de produits existent pour chaque catégorie
- une moyenne (avec `AVG()`) pour calculer le prix moyen

Mais nous n'avons besoin que du second dans l'affichage (et donc dans la partie `SELECT`). Le premier calcul nous sert uniquement à se restreindre (avec `HAVING` donc) aux catégories ayant plus de 10 produits.

```sql
SELECT CodeCateg, 
        ROUND(AVG(PrixUnit), 2) AS "Prix moyen"
    FROM Produit
    GROUP BY CodeCateg
    HAVING COUNT(*) >= 10;
```

## Exercice 5

> Donner le numéro de l'employé ayant fait le moins de commandes

Dans le même ordre idée que précédemment, nous n'avons pas spécifiquement besoin de l'affichage du nombre de commandes. Le `COUNT(*)` nous sert uniquement à effectuer l'ordre des employés, ce que nous pouvons faire parce que nous avons aussi spécifier `GROUP BY NoEmp`. Une fois le tri fait, l'employé avec le moins de commandes est le premier de la liste (d'où le `LIMIT 1`).

```sql
SELECT NoEmp AS "Employé avec le moins de commande"
    FROM Commande
    GROUP BY NoEmp
    ORDER BY COUNT(*)
    LIMIT 1;
```
