# Requêtage simple

La requête la plus simple est celle permettant de récupérer l'ensemble des données d'une table. Toute requête d'interrogation de données commence par le mot-clé **`SELECT`** et termine normalement par un point-virgule ("**`;`**").

Voici la requête permettant de récupérer la liste des clients présents dans la base de données (ici, nous utilisons une BD nommée *Comptoir2000*).

```sql
SELECT *
    FROM Client;
```

Voici quelques explications :

- Le terme **`SELECT`** indique donc que nous souhaitons récupérer des données ;
- Le caractère **`*`** indique que l'on veut tous les attributs de la table ;
- Le terme **`FROM`** permet d'indiquer à partir de quelle table nous devons récupérer les données.

## Limitation des résultats

Il est parfois utile de n'avoir que les premières lignes d'une table, pour comprendre son contenu par exemple. Dans ce cas, il est possible d'ajouter en fin de requête le terme **`LIMIT`** suivi du nombre de lignes souhaité.

```sql
SELECT *
    FROM Client
    LIMIT 3;
```

## Ordre des résultats

De même, on est souvent appelé à faire un tri des données (ascendant ou descendant). Le terme **`ORDER BY`**, à placer en fin de requête aussi, mais avant le `LIMIT` si nécessaire, permet de réaliser un tel tri. Il faut bien noter que le tri ne se fait qu'à l'affichage et que la table n'est en rien modifiée. De plus, celui-ci peut se faire sur tout type de données.

Il est possible d'indiquer de deux façons le ou les attributs à prendre en compte pour le tri :

- par leur nom
- par leur position dans la table

Les deux requêtes suivantes sont les mêmes et permettent toutes deux d'avoir la liste des employés triés dans l'ordre croissant de leur nom (attribut `Nom` placé en 2ème position).

```sql
SELECT * 
    FROM Employe
    ORDER BY Nom;
```

```sql
SELECT * 
    FROM Employe
    ORDER BY 2;
```

Dans un souci de clarté, il est tout de même préférable d'utiliser la première option.

Ensuite, pour modifier le type de tri, il est possible d'ajouter le terme **`DESC`** pour indiquer qu'on souhaite un tri décroissant. Par défaut, c'est donc un tri croissant qui est fait. 

```sql
SELECT * 
    FROM Employe
    ORDER BY Nom DESC;
```

Il est possible d'avoir plusieurs critères de tri. Pour cela, il faut séparer les différents attributs (nom ou position) par une virgule (*`,`*). La requête suivante permet donc d'avoir les employés triés d'abord par leur fonction, puis par leur nom.

```sql
SELECT * 
    FROM Employe
    ORDER BY Fonction, Nom;
```

Voici la même requête que précédemment, avec les fonctions triées par ordre alphabétique décroissant.

```sql
SELECT * 
    FROM Employe
    ORDER BY Fonction DESC, Nom;
```

## Exercices

1. Lister le contenu de la table `Produit`
2. N'afficher que les 10 premiers produits
3. Trier tous les produits par leur prix unitaire (attribut `PrixUnit`)
4. Lister les trois produits les plus chers


 
