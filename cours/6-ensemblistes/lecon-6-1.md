# Union

L'**union** est une opération ensembliste qui consiste à prendre les éléments présents dans *A* et dans *B*, *A* et *B* étant deux ensembles obtenus grâce à des requêtes, et réuni grâce à l'opérateur `UNION`. L'exemple ci-dessous renvoie tous les clients qui sont français (premier `SELECT`) ou dont le contact est le propriétaire de l'entreprise (deuxième `SELECT`).

```sql
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Pays = "France"
UNION
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Fonction = "Propriétaire";
``` 

Il faut noter que les deux `SELECT` doivent absolument renvoyer les mêmes champs.

## Ordre et limite

Si l'on souhaite faire un tri du résultat, et/ou se limiter aux premières lignes, les commandes `ORDER BY` et `LIMIT` doivent se placer tout à la fin. Par exemple, nous trions ici la réquête précédente sur le nom de la société.

```sql
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Pays = "France"
UNION
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Fonction = "Propriétaire"
ORDER BY 1;
```

Et si l'on veut se limiter aux 10 premières lignes, la requête devient la suivante.

```sql
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Pays = "France"
UNION 
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Fonction = "Propriétaire"
ORDER BY 1
LIMIT 10;
```

## Résultats dupliqués

Il arrive que des lignes soient présentes dans les deux requêtes. Ici, cela est le cas pour les entreprises françaises dont le contact est le propriétaire de l'entreprise. Dans la version précédente, ces entreprises n'apparaissent qu'une seule fois. Si l'on veut avec les doublons, on rajoute `ALL` à la suite du terme `UNION`. Ce qui revient à la requête suivante (avec un tri sur le nom pour mieux voir les doublons).

```sql
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Pays = "France"
UNION ALL 
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Fonction = "Propriétaire"
ORDER BY 1;
```

## Exercices

En utilisant la clause `UNION` :

1. Lister les employés (nom et prénom) étant `"Représentant(e)"` ou étant basé au `"Royaume-Uni"`
1. Lister les clients (société et pays) ayant commandés via un employé situé à Londres (`"London"` pour rappel) ou ayant été livré par `"Speedy Express"`

