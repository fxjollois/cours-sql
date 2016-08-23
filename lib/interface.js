/*global console,$,Uint8Array,SQL,ace,marked,hljs*/
(function () {
    "use strict";
    
    var ecran = $("#interface"), hauteur, db, editeur;
    
    marked.setOptions({
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });
    
    // Transformation du résultat d'une requête en une table HTML
    function sql2table(resultat, identifiant, tableContenu) {
        var table, tableHead, tableAttributs, tableLignes;
        if (resultat) {
            table = $("<table>").attr("id", identifiant).attr("class", "display");
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
                    var td = $("<td>").html(e);
                    if ((tableContenu) && (i === 0)) {
                        td.click(function () {
                            editeur.setValue("SELECT * FROM " + e + ";");
                        });
                    }
                    ligne.append(td);
                });
                tableLignes.append(ligne);
            });
        }
        return (table);
    }
    
    // Exécution de la requête SQL proposé
    function execution() {
        var sql, resultat, table, erreur;
        $("#resultat").children().remove();
        if (!db) {
            $("#resultat").append($("<div>").html("base de données non choisie").css("color", "red"));
        } else {
            sql = editeur.getValue();
            try {
                resultat = db.exec(sql)[0];
            } catch (error) {
                erreur = true;
                $("#resultat").html($("<div>").html(error));
            } finally {
                table = sql2table(resultat, "tablesql", false);
                if (table) {
                    $("#resultat").append(table);
                    $("#tablesql").DataTable({
                        "ordering": false,
                        paging: false,
                        scrollY: ($("#resultat").height() - 150) + "px",
                        scrollX: "100px"
                    });
                } else {
                    if (!erreur) {
                        $("#resultat").append($("<div>").html("Aucun résultat trouvé."));
                    }
                }
            }
        }
    }
    
    // Affichage du contenu d'une base de données
    function afficherContenu() {
        var affichage = $("#contenu").css("display");
        if (affichage === "none") {
            $("#contenu").css("display", "block");
            $("#choixBD").css("display", "none");
            $("#lecon").css("display", "none");
        } else {
            $("#contenu").css("display", "none");
            $("#choixBD").css("display", "block");
            $("#lecon").css("display", "block");
        }
    }
    
    // Lecture d'une base de données
    function lecture(fichier) {
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden");
        $("#resultat").children().remove();
        editeur.setValue("");
        $("#contenu").children().remove();
        var xhr = new XMLHttpRequest();
        xhr.open("GET", fichier, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function (e) {
            var uInt8Array = new Uint8Array(this.response), contenu, table = $("<table>"), html;
            db = new SQL.Database(uInt8Array);
            $("#lancer").css("visibility", "visible");
            $("#tables").css("visibility", "visible");
            
            contenu = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table'");
            html = sql2table(contenu[0], "tabtables", true);
            $("#contenu").html(html);
            $("#tabtables").DataTable({
                "paging":   false,
                "ordering": false,
                "info":     false,
                "searching": false
            });
        };
        xhr.send();
    }

    // Création de l'interface en trois zones
    function initialisation() {
        var information = $("<div>").attr("id", "information"),
            contenu = $("<div>").attr("id", "contenu"),
            requete = $("<div>").attr("id", "requete"),
            requetesql = $("<div>").attr("id", "requetesql"), // avant : textarea
            resultat = $("<div>").attr("id", "resultat"),
            droite = $("<div>").attr("id", "droite");
        
        information.append(contenu);
        requete.append(requetesql);
        droite.append(requete);
        droite.append(resultat);
        ecran.children().remove();
        ecran.append(information);
        ecran.append(droite);
        
        editeur = ace.edit("requetesql");
        editeur.setTheme("ace/theme/sqlserver");
        editeur.getSession().setMode("ace/mode/sql");
        editeur.setOption("showPrintMargin", false);

    }
    
    // Mise en place d'une interface de requêtage simple, avec choix de la base de données à gauche (et affichage de l'information)
    function requetage() {
        var bds = $("<div>").attr("id", "choixBD").css("text-align", "center"), liste;
        initialisation();
        $("#titre").html("Requêtage direct");
        
        liste = ["exemple.sqlite", "Comptoir2000.sqlite", "Gymnase2000.sqlite", "Chinook.sqlite", "world.sqlite"];
        
        $.each(liste, function (i, e) {
            var bouton = $("<button>").html(e).click(function () {
                $("button.active").removeClass("active");
                lecture("bases/" + e);
                $(this).addClass("active");
            });
            bds.append(bouton);
            bds.append($("<br>"));
        });
        
        $("#information").append(bds);
    }
    
    
    // Chargemet d'un cours et affichage de celui-ci
    function lancementCours(cours) {
        initialisation();
        $.getJSON("cours/" + cours + "/" + cours + ".json", function (donnees) {
            var queue,
                lecon = $("<div>").attr("id", "lecon"),
                items = $("<div>").attr("id", "items"),
                textes = $("<div>").attr("id", "textes");
            
            $("#titre").html(donnees.intitule);
            lecture("bases/" + donnees.base);
            
            // Lecture des fichiers md
            queue = donnees.fichiers.map(function (fic, position) {
                var nomfic = "cours/" + cours + "/" + fic + ".md";
                return $.get(nomfic);
            });
            
            // Intégration de ces fichiers md dans la div de lecon
            $.when.apply(null, queue).done(function () {
                var i, item, texte;
                $.each(arguments, function (i, e) {
                    item = $("<button>").html(i + 1).attr("class", "item");
                    texte = $("<div>").html(marked(e[0]));
                    item.click(function () {
                        var num = +$(this).html();
                        $("#textes div").css("display", function (iclick, eclick) {
                            if ((iclick + 1) === num) {
                                return "block";
                            } else {
                                return "none";
                            }
                        });
                        $("#items button").removeClass("active");
                        $(this).addClass("active");
                    });
                    if (i !== 0) {
                        texte.css("display", "none");
                    } else {
                        item.addClass("active");
                    }
                    items.append(item);
                    textes.append(texte);
                });
                lecon.append(items).append(textes);
                $("#information").append(lecon);
                $("#textes pre").click(function (e) {
                    var sql = $(this).find("code").html();
                    sql = sql.replace(/<span class="hljs-keyword">/g, '');
                    sql = sql.replace(/<span class="hljs-string">/g, '');
                    sql = sql.replace(/<\/span>/g, '');
                    $("#resultat").children().remove();
                    editeur.setValue(sql);
                });
            });
            
        });
    }
    
    // Ecran de début
    function debut() {
        var choix = $("<div>").attr("id", "choixAccueil");
        ecran.children().remove();
        $("#titre").children().remove();
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden");
        choix.append($("<button>").html("requêtage direct").click(requetage));
        choix.append("<br>");
        choix.append($("<button>").html("test").click(function () { lancementCours("test"); }));
        ecran.append(choix);
    }
    
    hauteur = (window.innerHeight - $("header").height() - $("footer").height());
    if (hauteur < 400) {
        hauteur = 400;
    }
    ecran.css("height", hauteur + "px");
    
    $("#accueil").click(debut);
    $("#lancer").click(execution);
    $("#tables").click(afficherContenu);
    
    debut();
}());