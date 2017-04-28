# Description de la base

Dans ce TP noté, nous allons utiliser la base de données `"world.sqlite"`, qui contient des informations sur différents pays. Ces informations datent de la fin du siècle dernier. Elle est composée de trois tables :

- `Country` : liste de pays, avec des informations telles que 
	- le continent, la région
	- la supérficie (`SurfaceArea`), la population totale
	- l'année d'indépendance (`IndepYear` - si non présente, alors pays non-indépendant)
	- l'espérance de vie (`LifeExpectancy`)
	- le PNB (`GNP`)
	- la forme du gouvernement (`GovernmentForm`)
	- ...
- `City` : liste de certaines villes des pays de `Country`, avec comme informations
	- le district
	- la population
- `CountryLanguage` : liste des langues parlées dans les pays (si plusieurs langues dans un pays, alors plusieurs lignes dans la table), avec comme informations
	- si la langue officielle ou non (`IsOfficial`)
	- le pourcentage de la population parlant cette langue
