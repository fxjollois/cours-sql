# Différence

Enfin, la **différence** entre deux éléments *A* et *B*, renvoie les éléments de *A* qui ne sont pas présents dans *B*. Il faut donc faire attention à l'ordre des `SELECT`, puisque les résultats ne seront pas identiques entre *A - B*  et *B - A*. L'opérateur est `EXCEPT` en `SQL` classique (et `MINUS` dans certains cas - Oracle par exemple). En reprenant le même exemple, la requête suivante renvoie les clients français dont le contact n'est pas propriétaire.

```sql
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Pays = "France"
EXCEPT
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Fonction = "Propriétaire";
``` 

De même que l'union et l'intersection, les champs des deux `SELECT` doivent être les mêmes. 

Et le tri et la limitation doivent se faire aussi à la fin.

## Exercices

Avec l'opérateur `EXCEPT` :

1. Lister les employés (nom et prénom) étant `"Représentant(e)"` mais n'étant basé au `"Royaume-Uni"` 
1. Lister les clients (société et pays) ayant commandés via un employé situé à Londres (`"London"` pour rappel) et n'ayant jamais été livré par `"United Package"`

