# Restriction

Une restriction est une sélection de lignes d'une table, sur la base d'une condition à respecter, définie à la suite du terme **`WHERE`**. Cette condition peut être une combinaison de comparaisons à l'aide de `AND`, de `OR` et de `NOT` (attention donc aux parenthèses dans ce cas).

## Opérateurs classiques

Nous disposons bien sûr de tous les opérateurs classiques de comparaison : `=`, `<>`, `>`, `>=`, `<`, `<=`.

Cette requête permet de lister tous les employés ayant la fonction de représentant.

```sql
SELECT * 
    FROM Employe
    WHERE Fonction = "Représentant(e)";
```

Si l'on souhaite le complément de cette requête, i.e. tous les employés qui ne sont pas représentants, on utilise le symbole `<>` pour indiquer une non-égalité (ce qui revient à faire `NOT(Fonction = "Représentant(e)")`).

```sql
SELECT * 
    FROM Employe
    WHERE Fonction <> "Représentant(e)";
```

Comme indiqué précédemment, il est possible de combiner des comparaisons. La requête suivante permet d'avoir les représentants masculins, avec un numéro d'employé inférieur strictement à 8.

```sql
SELECT * 
    FROM Employe
    WHERE Fonction = "Représentant(e)"
    AND TitreCourtoisie = "M."
    AND NoEmp < 8;
```

Pour les comparaisons de chaînes de caractères, il est important de faire attention à la casse (i.e. minuscule/majuscule). Par définition, un `"a"` est donc différent d'un `"A"`. Pour remédier à ce problème, il existe les fonction **`UPPER()`** et **`LOWER()`** pour transformer une chaîne en respectivement majuscule et minuscule.

```sql
SELECT * 
    FROM Employe
    WHERE UPPER(Ville) = "SEATTLE";
```

## Données manquantes

Une donnée manquante en SQL est repérée par un `NULL`. Il y a plusieurs raisons, bonnes ou mauvaises, pour avoir des données manquantes, et il est parfois utile de tester leur présence. Pour cela, nous allons utiliser le terme **`IS NULL`** comme condition.

Par exemple, pour lister les employés dont la région n'est pas renseignée, nous devons exécuter la requête suivante.

```sql
SELECT * 
    FROM Employe
    WHERE Region IS NULL;
```

Au contraire, si l'on veut uniquement les employés pour lesquels l'information est présente, nous devrons utiliser la négation avec `IS NOT NULL`.

```sql
SELECT * 
    FROM Employe
    WHERE Region IS NOT NULL;
```

## Opérateurs spécifiques

Les deux premiers opérateurs définis ci-après sont particulièrement utiles pour limiter la taille de la requête. Le dernier est lui utile pour comparer une chaîne de caractères à une *pseudo-chaîne*.

### `BETWEEN`

Cet opérateur permet de définir un intervalle fermé dans lequel l'attribut doit avoir sa valeur. La condition suivante est équivalente à `NoEmp >= 3 AND NoEmp <= 8`.

```sql
SELECT * 
    FROM Employe
    WHERE NoEmp BETWEEN 3 AND 8;
```

### `IN`

Cet autre opérateur permet de définir une liste de valeurs entre parenthèses et séparées par des virgules. La condition suivante est équivalente à `TitreCourtoisie = 'Mlle' OR TitreCourtoisie = 'Mme'`.

```sql
SELECT * 
    FROM Employe
    WHERE TitreCourtoisie IN ('Mlle', 'Mme');
```

### `LIKE`

Comme précisé avant, l'opérateur `LIKE` permet de comparer une chaîne de caractère à une *pseudo-chaîne*, dans laquelle nous pouvons ajouter deux caractères spécifiques :

- `%` : une suite de caractères, éventuellement nulle
- `_` : un et un seul caractère

Par exemple, la requête suivante permet de récupérer les employés dont le nom commence par un `"D"`.

```sql
SELECT * 
    FROM Employe
    WHERE Nom LIKE 'D%';
```

La requête suivante permet elle d'avoir tous les employés qui ont un prénom de 5 lettres.

```sql
SELECT * 
    FROM Employe
    WHERE Prenom LIKE '_____';
```

Il faut noter que l'opérateur `LIKE` est insensible à la casse, i.e. il ne tient pas compte des minuscules/majuscules.

## Exercices

1. Lister les clients français installés à Paris
2. Lister les clients suisses, allemands et belges
3. Lister les clients dont le numéro de fax n'est pas renseigné
4. Lister les clients dont le nom contient `"restaurant"` (nom présent dans la colonne `Societe`)
