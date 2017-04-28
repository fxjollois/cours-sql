# Descriptif de la base

La base de données **`Gymnase2000`** contient des informations relatives à un club de sports. 

La table **`Sportifs`** contient les données des membres du club, et la table **`Sports`** les différents sports pratiqués. Dans **`Gymnases`** sont recensées les détails de tous les gymnases utilisés par le club.

Les tables **`Jouer`**, **`Entrainer`** et **`Arbitrer`** contiennent la liste des sportifs et des sports qu'ils jouent, entraînent et arbitrent respectivement. Dans la table `Entrainer`, le sportif est identifié par l'attribut `IdSportifEntraineur`, qui contient un `IdSportif` de la table `Sportifs` donc.

Enfin, la table **`Seances`** décrit l'ensemble des séances hebdomadaires du club. Chacune concerne un sport, dans un gymnase, par un entraineur, sur un horaire spécifique d'un jour de la semaine. Les horaires sont stockées de telle sorte que `19.3` veut dire `"19h30"`. Les durées sont en minutes. 
