# Intersection

L'**intersection**, avec l'opérateur `INTERSECT`, entre deux ensembles *A* et *B*, obtenus grâce à deux requêtes, permet de ne récupérer que les lignes présentes dans les deux ensembles. En reprenant l'exemple précédent, nous récupérons ici tous les clients français dont le contact est le propriétaire de l'entreprise.

```sql
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Pays = "France"
INTERSECT
SELECT Societe, Fonction, Pays
    FROM Client
    WHERE Fonction = "Propriétaire";
``` 

Tout comme l'union, les champs des deux `SELECT` doivent être identiques.

Les règles pour le tri et la limitation des résultats sont aussi les mêmes.

## Exercices

Avec l'opérateur `INTERSECT` :

1. Lister les employés (nom et prénom) étant `"Représentant(e)"` et étant basé au `"Royaume-Uni"` 
1. Lister les clients (société et pays) ayant commandés via un employé basé à `"Seattle"` et ayant commandé des `"Desserts"`

