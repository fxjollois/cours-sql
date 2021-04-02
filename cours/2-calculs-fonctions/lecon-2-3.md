# Fonctions sur les dates

Nous disposons en `SQL` (comme dans d'autres langages) de plusieurs formats pour les dates. Soit nous avons uniquement la date (jour, mois et année - stockée sous la forme d'un entier représentant le nombre de jours depuis une date de référence, souvent le 1/1/1970). Il existe aussi un format où la date, l'heure et le fuseau horaire sont stockées (précisemment, le nombre de secondes depuis la même date de référence et le fuseau horaire). 

Nous allons voir ici quelques fonctions utiles pour les dates : `DATE()` pour générer des dates, `STRFTIME()` pour obtenir des informations à partir d'une date.

Vous trouverez sur [cette page](https://sqlite.org/lang_datefunc.html) plus d'informations sur les fonctions disponibles.

## Génération de dates

En premier lieu, si nous désirons avoir la date du jour (de l'exécution de la requête bien sûr), nous pouvons exécuter cette requête. La date est affichée au format `"YYYY-MM-DD"`.

```sql
SELECT DATE("now");
```

La commande `DATE()` peut prendre d'autres paramètres après le premier contenant la date (ou `"now"`), permettant de modifier cette date. La requête suivante permet d'avoir la date de la veille.

```sql
SELECT DATE("now", "-1 day");
```

Il est possible de cumuler plusieurs modificateurs pour, par exemple, obtenir le dernier jour du mois dernier.

```sql
SELECT DATE("now", "start of month", "-1 day");
```

La commande `DATE()` accepte aussi en premier paramètre une date au bon format, pour par exemple lui appliquer une modification par la suite. Nous avons ici la date du lendemain de la commande.

```sql
SELECT DATE(DateCom, "+1 day") 
    FROM Commande;
```

## Informations à partir d'une date

La commande `STRFTIME()` permet elle d'obtenir des informations à partir d'une date. On indique l'information désirée par un caractère précédé d'un `"%"`. Dans l'exemple ci-après, on récupère l'année (`"%Y"`), le mois (`"%m"`) et le jour ("`%d"`) de la date actuelle. Il est aussi possible de les combiner pour écrire la date dans un format plus classique pour nous.

```sql
SELECT DATE("now") AS "Aujourd'hui",
		STRFTIME("%Y", "now") AS "Année",
		STRFTIME("%m", "now") AS "Mois",
		STRFTIME("%d", "now") AS "Jour",
		STRFTIME("%d/%m/%Y", "now") AS "Nouveau format";
```

Il existe d'autres informations potentiellement intéressantes sur les dates, comme le jour de la semaine (`"%w"`), le jour dans l'année (`"%j"`) ou la semaine dans l'année (`"%W"`).

```sql
SELECT DATE("now") AS "Aujourd'hui",
		STRFTIME("%w", "now") as "Jour de la semaine",
		STRFTIME("%j", "now") as "Jour de l'année",
		STRFTIME("%W", "now") as "Semaine dans l'année";
```

Il faut noter que le jour de la semaine a une valeur entre 0 (pour le dimanche) et 6 (pour le samedi). Par contre, le jour de l'année a une valeur entre 1 et 366. Le numéro de semaine dans l'année commence lui aussi à 0 jusqu'à 52 (voire 53).

Nous disposons de deux autres informations très utiles pour les différences de dates :

- le nombre de secondes depuis le 1/1/1970 avec `"%s"`
- le jour julien (cf [page Wikipedia](https://fr.wikipedia.org/wiki/Jour_julien)) avec 
	- soit `"%J"` dans la fonction `STRFTIME()`
	- soit la fontion `%JULIANDAY()`

```sql
SELECT DATE("now"),
		STRFTIME("%s", "now") as "Nb secondes depuis 1/1/1970",
		STRFTIME("%J", "now") as "Jour julien",
		JULIANDAY("now") as "Jour julien";
```

Ainsi, il est possible de calculer le nombre de jours entre deux dates de 2 manières. Pour rappel, une journée dure 24 heures de 60 minutes, chacune faisant 60 secondes, ce qui fait qu'une journée dure 86400 secondes (24 * 60 * 60).

Dans l'exemple ci-dessous, nous calculons le nombre de jours qu'ont duré les Jeux Olympiques 2016 (du 5 au 21 août).

```sql
SELECT JULIANDAY("2016-08-21") - JULIANDAY("2016-08-05");
```

On calcule la même différence en utilisant la fonction `STRFTIME()` et le nombre de secondes depuis le 1/1/1970.

```sql
SELECT (STRFTIME("%s", "2016-08-21") - STRFTIME("%s", "2016-08-05")) / 86400;
```

## Exercices

1. Calculer pour chaque commande le jour de la semaine, le numéro de semaine dans l'année et le mois
2. Lister les commandes ayant eu lieu un dimanche
3. Calculer le nombre de jours entre la date de la commande (`DateCom`) et la date butoir de livraison (`ALivAvant`), pour chaque commande
4. On souhaite aussi contacter les clients 1 an, 1 mois et 1 semaine après leur commande. Calculer les dates correspondantes pour chaque commande
