# Fonctions sur chaînes de caractères

## Concaténation

La première opération que l'on souhaite faire avec des chaînes de caractères est la concaténation : le regroupement des deux chaînes en une seule. Par exemple, la concaténation de `"bon"` et de `"jour"` donne la chaîne `"bonjour"`. L'opérateur dédié en `SQL` est `||`. L'exemple ci-dessous nous permet d'avoir le nom et le prénom dans une seule chaîne.

```sql
SELECT NoEmp, Nom || Prenom
    FROM Employe;
```

Avec la requête ci-dessus, les deux chaînes sont collées, i.e. il n'y a pas d'espace entre les deux. Pour cela, il est tout à fait possible de concaténer en une expression plusieurs chaînes pour introduire un espace, comme ci-après.

```sql
SELECT NoEmp, Nom || " " || Prenom
    FROM Employe;
```

## Extraction d'une sous-chaîne

Une commande intéressante sur les chaînes est la commande `SUBSTR(chaine, debut, longueur)` qui permet d'extraire une sous-chaîne d'une chaîne, en partant du caractère précisé dans `debut` et sur une longueur précisé par `longueur`. Dans l'exemple ci-dessous, nous extrayons l'initiale du prénom.

```sql
SELECT NoEmp, Nom || " " || SUBSTR(Prenom, 1, 1)
    FROM Employe;
```

Et on ajoute un `"."` pour indiquer que c'est une initiale. Il n'y a pas de limite sur le nombre de chaînes que l'on peut concaténer en une seule expression.

```sql
SELECT NoEmp, Nom || " " || SUBSTR(Prenom, 1, 1) || "."
    FROM Employe;
```

## Majuscule/Minuscule

Pour pouvoir transformer une chaîne en majuscule (et respectivement en minuscule), nous avons à disposition la commande `UPPER(chaine)` (et resp. `LOWER(chaine)`). Cette commande, comme toutes les autres, peut aussi être utilisé dans un `WHERE`.

```sql
SELECT NoEmp, UPPER(Nom) || " " || SUBSTR(Prenom, 1, 1) || "."
    FROM Employe;
```

La commande `LENGTH(chaine)` permet de renvoyer la longueur de la chaîne (i.e. le nombre de caractères, y compris les espaces).

```sql
SELECT NoEmp, Nom, LENGTH(Nom)
    FROM Employe;
```

## Modification d'une sous-chaîne

La commande `REPLACE(chaîne, sc1, sc2)` permet de remplacer la sous-chaîne `sc1` par la sous-chaîne `sc2` dans la chaîne de caractères passée en premier paramètre. Ci-dessous, nous remplaçons donc le terme `"Chef"` par le terme `"Responsable"` dans les titres de fonction des employés.

```sql
SELECT Nom, Prenom, Fonction,
        REPLACE(Fonction, "Chef", "Responsable")
    FROM Employe;
```

## Recherche d'une sous-chaîne

Pour rechercher la première apparition d'une sous-chaîne dans une chaîne, nous disposons de la commande `INSTR(chaîne, souschaine)`. Celle-ci recherche donc à quelle position dans la chaîne se trouve la première occurence de la sous-chaîne. Si la sous-chaîne n'est pas présente, la fonction renvoie `0`.

Ci-dessous, nous cherchons la présence du terme `"Ave."` dans l'adresse des employés. 

```sql
SELECT Nom, Adresse,
        INSTR(Adresse, "Ave.")
    FROM Employe;
```

## Exercices

Dans une même requête, sur la table `Client` : 

1. Concaténer les champs `Adresse`, `Ville`, `CodePostal` et `Pays` dans un nouveau champ nommé `Adresse complète`, pour avoir :
```
Adresse, CodePostal Ville, Pays
```
2. Extraire les deux derniers caractères des codes clients
3. Mettre en minuscule le nom des sociétés
4. Remplacer le terme `"marketing"` par `"mercatique"` dans la fonction des contacts
5. Indiquer la présence du terme `"Chef"` dans la fonction du contact
