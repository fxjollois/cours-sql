/*global console,$,Uint8Array,SQL*/
(function () {
    "use strict";
    
    var ecran = $("#interface"), hauteur, db;
    
    // Transformation du résultat d'une requête en une table HTML
    function sql2table(resultat, identifiant) {
        var table, tableHead, tableAttributs, tableLignes;
        if (resultat) {
            table = $("<table>").attr("id", identifiant);
            tableHead = $("<thead>");
            table.append(tableHead);
            tableAttributs = $("<tr>");
            tableHead.append(tableAttributs);
            $.each(resultat.columns, function (i, e) {
                tableAttributs.append($("<th>").html(e));
            });
            
            tableLignes = $("<tbody>");
            table.append(tableLignes);
            $.each(resultat.values, function (i, t) {
                var ligne = $("<tr>");
                $.each(t, function (i, e) {
                    ligne.append($("<td>").html(e));
                });
                tableLignes.append(ligne);
            });
        } else {
            table = $("<div>").html("Aucun résultat trouvé.");
        }
        return (table);
    }
    
    // Affichage du contenu d'une base de données
    function afficherContenu() {
        var affichage = $("#contenu").css("display");
        if (affichage === "none") {
            $("#contenu").css("display", "block");
            $("#choixBD").css("display", "none");
        } else {
            $("#contenu").css("display", "none");
            $("#choixBD").css("display", "block");
        }
    }
    
    // Lecture d'une base de données
    function lecture(fichier) {
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden");
        $("#resultat").html("");
        $("#requetesql").val("");
        $("#contenu").html("");
        var xhr = new XMLHttpRequest();
        xhr.open("GET", fichier, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function (e) {
            var uInt8Array = new Uint8Array(this.response), contenu, table = $("<table>"), html;
            db = new SQL.Database(uInt8Array);
            $("#lancer").css("visibility", "visible");
            $("#tables").css("visibility", "visible");
            
            contenu = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table'");
            html = sql2table(contenu[0], "test");
            $("#contenu").html(html);
        };
        xhr.send();
    }

    // Exécution de la requête SQL proposé
    function execution() {
        var sql, resultat = true, table, tableAttributs, tableLignes;
        $("#resultat").html("");
        if (!db) {
            $("#resultat").append($("<div>").html("base de données non choisie").css("color", "red"));
        } else {
            sql = $("#requetesql").val();
            try {
                resultat = db.exec(sql)[0];
            } catch (error) {
                $("#resultat").html($("<div>").html(error));
            } finally {
                $("#resultat").append(sql2table(resultat, "tablesql"));
            }
        }
    }
    
    // Création de l'interface en trois zones
    function initialisation() {
        var information = $("<div>").attr("id", "information"),
            contenu = $("<div>").attr("id", "contenu"),
            requete = $("<div>").attr("id", "requete"),
            requetesql = $("<textarea>").attr("id", "requetesql"),
            lancer = $("<button>").attr("id", "lancer").html("lancer").click(execution),
            tables = $("<button>").attr("id", "tables").html("tables").click(afficherContenu),
            resultat = $("<div>").attr("id", "resultat"),
            droite = $("<div>").attr("id", "droite");
        
        information.append(contenu);
        requete.append(requetesql);
        requete.append(lancer);
        requete.append(tables);
        droite.append(requete);
        droite.append(resultat);
        ecran.html("");
        ecran.append(information);
        ecran.append(droite);
        
        requetesql.css("width", ($("#requete").width() - 100) + "px");
        resultat.css("height", ($("#requete").height() - 50) + "px");
    }
    
    // Mise en place d'une interface de requêtage simple, avec choix de la base de données à gauche (et affichage de l'information)
    function requetage() {
        var bds = $("<div>").attr("id", "choixBD").css("text-align", "center"), liste;
        initialisation();
        
        liste = ['exemple.sqlite', "world.sqlite"];
        
        $.each(liste, function (i, e) {
            var bouton = $("<button>").html(e).click(function () {
                lecture("bases/" + e);
            });
            bds.append(bouton);
        });
        
        $("#information").append(bds);
        //$("#contenu").css("display", "inherit");
    }
        
    hauteur = (window.innerHeight - $("header").height() - $("footer").height());
    if (hauteur < 600) {
        hauteur = 600;
    }
    ecran.css("height", hauteur + "px");
    
    ecran.append($("<button>").html("requêtage libre").click(requetage));
}());