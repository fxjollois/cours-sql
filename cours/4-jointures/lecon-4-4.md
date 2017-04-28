# Jointures *à la main*

Comme dit précédemment, le défaut des jointures *internes* (et dans une moindre mesure *naturelles*) est la lourdeur du code écrit dans le cas de plusieurs jointures.

## Principe

### Produit cartésien

On parle de **produit cartésien** quand on cherche à coupler toutes les lignes d'une table avec chaque ligne de l'autre table. Considérons que la table `A` à `nbA` lignes, et la table `B` `nbB` lignes. En résultat, nous obtenons donc une table avec `nbA * nbB` lignes. Ce qui peut vite faire beaucoup. Par exemple, la table `Client` fait 94 lignes, la table `Commande` 830. Le produit cartésien des deux tables produit une table de 78020 lignes. Il faut donc faire attention quand on fait une telle opération.

Pour mieux comprendre le produit cartésien, on peut regarder la requête suivante. Elle associe chaque produit (84 lignes), avec chaque catégorie (8 lignes), ce qui fait une table résultat de 672 lignes. Vous remarquerez que la requête est un peu lente à être exécutée.

```sql
SELECT *
    FROM Produit, Categorie;
```

### Restriction sur produit cartésien

Bien évidemment, dans un produit cartésien, toutes les lignes ne sont pas intéressantes dans le résultat. Celles qui nous intéresse est celles où il y a correspondance entre certains attributs de chaque table. Une **jointure** est finalement une **restriction** sur **produit cartésien**, celle-ci apparaissant dans le `WHERE`.

Pour reprendre notre exemple précédent, pour faire correspondre chaque produit avec sa catégorie via une jointure *à la main*, nous allons réaliser la requête suivante.

```sql
SELECT *
    FROM Produit, Categorie
    WHERE Produit.CodeCateg = Categorie.CodeCateg;
```

Comme précédemment, il est aussi possible de renommer temporairement les tables pour simplifier l'écriture de la requête.

```sql
SELECT *
    FROM Produit P, Categorie C
    WHERE P.CodeCateg = C.CodeCateg;
```

## Jointures multiples

Nous allons comparer ici les requêtes permettant de réaliser de multiples jointures. Si nous souhaitons compter pour chaque client et pour chaque messager, le nombre de commandes passées, nous devons réaliser les requêtes suivantes.

### Jointure naturelle

Cette requête ne fonctionne pas, car l'attribut `Tel` est présent dans `Client` et dans `Messager`. Il va donc chercher l'égalité sur cet attribut aussi. Et il y a peu de chances qu'un client ait le même numéro de téléphone qu'un messager.

```sql
SELECT Societe, NomMess, COUNT(*)
    FROM (Client NATURAL JOIN Commande)
        NATURAL JOIN Messager
    GROUP BY Societe, NomMess;
```

### Jointure interne

Pour qu'elle fonctionne, nous devons passer par des jointures internes. Cette requête s'écrit donc de la manière suivante. La lecture n'est pas la plus aisée, surtout pour repérer les tables prises en compte.

```sql
SELECT Societe, NomMess, COUNT(*)
    FROM (Client Cl INNER JOIN Commande Co
            ON Cl.CodeCli = Co.CodeCli)
        INNER JOIN Messager M
            ON Co.NoMess = M.NoMess
    GROUP BY Societe, NomMess;
```

### Jointure *à la main*

Dans ce type de jointure, nous devons déjà lister dans le `FROM` les tables nécessaires, puis dans le `WHERE` mettre les conditions de jointures. Il en résulte une requête plus facile à décoder dans la lecture des tables prises en compte.

```sql
SELECT Societe, NomMess, COUNT(*)
    FROM Client Cl, Commande Co, Messager M
    WHERE Cl.CodeCli = Co.CodeCli
    AND Co.NoMess = M.NoMess
    GROUP BY Societe, NomMess;
```

## Limitations

Ce type de jointure ne permet pas de faire de *jointure externe*. 

## Exercices

1. Récupérer les informations des fournisseurs pour chaque produit, avec jointure *à la main*
2. Afficher les informations des commandes du client `"Lazy K Kountry Store"`, avec jointure *à la main*
3. Afficher le nombre de commande pour chaque messager (en indiquant son nom), avec jointure *à la main*
