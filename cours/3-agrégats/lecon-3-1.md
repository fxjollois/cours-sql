# Dénombrements

Les dénombrements sont très utilisés en `SQL`. D'une part, car il est important de savoir combien il y a de clients, commandes, ... D'autre part, c'est un moyen intéressant de contrôler son travail lors de l'écriture d'un programme complexe, demandant plusieurs requêtes.

C'est le premier **agrégat** (ou *calcul d'agrégat*) à voir. Nous utilisons pour cela la commande `COUNT()`.

## Nombre de lignes d'une table

Pour calculer le nombre de lignes d'une table, quelque soit les valeurs dans celle-ci, le plus correct est d'utiliser `COUNT(*)`. L'étoile ici indique que l'on prend toute la table, comme dans une requête `SELECT * FROM table`.

Nous avons donc ici le nombre de clients contenus dans la base de données.

```sql
SELECT COUNT(*) 
    FROM Client;
```

## Nombre de valeurs d'un attribut

Il est possible de spécifier un attribut dans le `COUNT()`. Ceci permettra de compte combien il y a de lignes avec une valeur dans cet attribut. Si on l'utilise sur une *clé primaire*, nous devrions obtenir le même résultat que précédemment.

```sql
SELECT COUNT(CodeCli) 
    FROM Client;
```

Par contre, si on indique un attribut dans lequel il y a des valeurs manquantes (i.e. `NULL` en `SQL`), nous n'aurons pas le même résultat. Nous aurons donc le nombre de valeurs non nulles de cet attribut. Ici, l'attribut est le numéro de fax du client. Comme il y a quelques clients sans numéro de fax, nous n'obtenons pas le même résultat.

```sql
SELECT COUNT(Fax) 
    FROM Client;
```

## Nombre de valeurs distinctes d'un attribut

Pour aller plus loin, il est aussi possible d'ajouter la clause `DISTINCT` avant l'attribut, pour obtenir le nombre de valeurs distincts de cet attribut. Ci-dessous, nous avons donc le nombre de valeurs distinctes de l'attribut `Pays`. Ce qui nous donne le nombre de pays de la clientèle.

```sql
SELECT COUNT(DISTINCT Pays) 
    FROM Client;
```

Ce nombre correspond au nombre de lignes de la table résultante de la requête suivante.

```sql
SELECT DISTINCT Pays
    FROM Client;
```

## Restriction dans le dénombrement

Pour dénombrer des sous-ensembles d'une table, il est bien évidemment possible d'ajouter des restrictions à la requête. Par exemple, ci-dessous, nous calculons le nombre de clients français présents dans la base.

```sql
SELECT COUNT(*) 
    FROM Client
    WHERE Pays = "France";
```

## Exercices

1. Calculer le nombre d'employés qui sont `"Représentant(e)"`
2. Calculer le nombre de produits de moins de 50 euros
3. Calculer le nombre de produits de catégorie 2 et avec plus de 10 unités en stocks
4. Calculer le nombre de produits de catégorie 1, des fournisseurs 1 et 18
5. Calculer le nombre de pays différents de livraison
6. Calculer le nombre de commandes réalisées le 28/03/2016.
