# Traitement conditionnel

Nous avons vu comment se restreindre à un sous-ensemble d'une table via les restrictions dans la partie `WHERE` d'une requête. Il existe aussi une possibilité de faire un traitement conditionnel avec le terme `CASE`. Dans un `SELECT`, celui-ci va nous permettre de conditionner la valeur d'une colonne par les valeurs d'autres colonnes.

## Comparaison à des valeurs (égalité)

La première utilisation de cette commande est de comparer un attribut à un ensemble de valeurs. Puisque la comparaison est l'égalité, ceci concerne principalement des attributs de type texte ou avec un nombre de valeurs restreint. Dans ce cas, l'ordre des comparaisons à l'aide de `WHEN` n'a aucune importance.

Dans l'exemple ci-dessous, nous voulons afficher les titres de courtoisie au complet pour `"Mlle"`, `"Mme"` et `"M."`. Pour `"Dr."`, nous voulons le garder par contre. Vous pouvez donc voir la syntaxe de cette commande.

```sql
SELECT NoEmp, Nom, Prenom, TitreCourtoisie,
        CASE TitreCourtoisie
            WHEN "Mlle" THEN "Mademoiselle"
            WHEN "Mme"  THEN "Madame"
            WHEN "M."   THEN "Monsieur"
            ELSE TitreCourtoisie
        END AS Titre
    FROM Employe;
```

On peut aussi l'utiliser pour mettre un message en fonction de la valeur d'un attribut. Ci-dessous, nous affichons à partir de quel niveau de stock le produit doit être commandé pour réapprovisionnement. Si c'est à `0`, on indique qu'il n'y a pas de niveau minimum. Sinon, on utilise la valeur stockée dans `NiveauReap` pour créer le message.

```sql
SELECT Refprod, Nomprod, NiveauReap,
        CASE NiveauReap
            WHEN 0 THEN "Pas de niveau minimum"
            ELSE "Réapprovisionnement à partir de " || NiveauReap || " unités restantes"
        END AS Reapprovisionnement
    FROM Produit;
```

## Comparaison à des valeurs (infériorité ou supériorité)

Pour pouvoir comparer un attribut avec des valeurs mais autrement que via l'égalité, il est aussi possible d'utiliser un `CASE`. 

Dans l'exemple ci-dessous, nous comparons le prix unitaire des produits à deux valeurs seuils. Si le prix est inférieur ou égal à 50, alors le produit est considéré dans la gamme des petits prix. Ensuite, on teste pour savoir s'il est inférieur ou égal à 500 et si oui, le produit sera dans la gamme moyenne. Enfin, par défaut, le produit sera dans la gamme de luxe.

```sql
SELECT Refprod, Nomprod, PrixUnit,
        CASE 
            WHEN PrixUnit <= 50 THEN "Petits prix"
            WHEN PrixUnit <= 500 THEN "Gamme moyenne"
            ELSE "Produits de luxe"
        END AS Gamme
    FROM Produit;
```

Ceci revient à écrire en algo ce qui suit :

```
SI (PrixUnit <= 50) ALORS
	gamme = "Petits prix"
SINON
	SI (PrixUnit <= 500) ALORS
		gamme = "Gamme moyenne"
	SINON
		gamme = "Produits de luxe"
	FIN SI
FIN SI
```

Dans le deuxième test, il n'est pas nécessaire de tester si le prix est supérieur strictement à 50, car on est dans la partie `SINON` du premier test.

## Comparaison entre attributs

Enfin, il est aussi possible d'utiliser ce test `CASE` pour comparer plusieurs attributs entre eux. 

Dans l'exemple ci-dessous, nous voulons afficher un message en fonction de l'action à réaliser ou non pour le réapprovisionnement. Si le produit a déjà été comamndé (i.e. `UnitesCom > 0`), alors on l'indique. Par contre, s'il ne l'est pas mais que le stock est inférieur au niveau de réapprovisionnement, alors on indique qu'il faut commander le produit. Pour les produits qui ne sont plus en stock (et dont le niveau de réapprovisionnement est égal à 0), on indique juste qu'il n'y a plus de produits à disposition. Pour les autres, il n'y a, a priori, rien à faire.

```sql
SELECT Refprod, UnitesStock, UnitesCom, NiveauReap,
        CASE
            WHEN UnitesCom > 0 THEN "Déjà commandé"
            WHEN UnitesStock < NiveauReap THEN "A commander"
            WHEN UnitesStock == 0 THEN "Plus en stock"
            ELSE "rien à faire"
        END AS Informations
    FROM Produit;
```

## Exercices

1. A partir de la table `Produit`, afficher `"Produit non disponible"` lorsque l'attribut `Indisponible` vaut 1, et `"Produit disponible"` sinon.
2. Dans la table `DetailCommande`, indiquer les infos suivantes en fonction de la remise
	- si elle vaut 0 : `"aucune remise"`
	- si elle vaut entre 1 et 5% (inclus) : `"petite remise"`
	- si elle vaut entre 6 et 15% (inclus) : `"remise modérée"`
	- sinon :`"remise importante"`
3. Indiquer pour les commandes envoyées si elles ont été envoyées en retard (date d'envoi `DateEnv` supérieure (ou égale) à la date butoir `ALivAvant`) ou à temps


