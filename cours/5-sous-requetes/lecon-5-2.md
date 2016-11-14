# Opérateur  `EXISTS`

L'opérateur `EXISTS` permet de tester si une sous-requête renvoie un résultat ou non. En faisant en plus référence à une valeur d'un attribut de la table dans la première requête, cela permet de tester des existences de faits.

Par exemple, si l'on souhaite avoir les clients ayant au moins une commande, on peut faire comme ci-dessous.

```sql
SELECT *
    FROM Client Cl
    WHERE EXISTS (SELECT *
                    FROM Commande
                    WHERE CodeCli = Cl.CodeCli);
```

On peut faire aussi l'inverse de cette requête en cherchant les clients n'ayant pas de commande.

```sql
SELECT *
    FROM Client Cl
    WHERE NOT EXISTS (SELECT *
                        FROM Commande
                        WHERE CodeCli = Cl.CodeCli);
```

Dans les deux requêtes ci-dessous, il est possible de faire autrement car nous ne comparons qu'avec un seul attribut (`CodeCli`). On aurait pu donc passer par une joitnure ou un `IN` (ou `NOT IN`) avec une sous-requête.

Par contre, si on cherche à comparer plus d'un attribut, il devient difficile (voire impossible parfois) d'utiliser l'opérateur `=` ou `IN`, ou une jointure. On passe donc par `EXISTS`.

On cherche ici à trouver des clients qui habitent dans la même ville (et donc le même pays) qu'un employé. 

```sql
SELECT Societe, Ville, Pays
	FROM Client Cl
	WHERE EXISTS (SELECT *
	                FROM Employe
	                WHERE Ville LIKE Cl.Ville
	                AND Pays LIKE Cl.Pays);
```

## Exercices

1. Lister les produits n'ayant jamais été commandés, à l'aide de l'opérateur `EXISTS`
1. Lister les fournisseurs dont au moins un produit a été livré en France
1. Liste des fournisseurs qui ne proposent que des boissons
