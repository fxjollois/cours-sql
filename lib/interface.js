/*global $,Uint8Array,SQL,ace,marked,hljs,document,window,XMLHttpRequest*/
(function () {
    "use strict";
    
    var ecran = $("#interface"), hauteur, db, editeur, petit = false;
    
    function tropPetit() {
        petit = true;
        ecran.html("Taille de la fenêtre inadaptée à cette application");
    }
    
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
                            editeur.setValue("SELECT *\n\tFROM " + e + ";");
                            editeur.gotoLine(1);
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
            $("#resultat").append($("<div>").html("<strong>Attention :</strong><br>Base de données non choisie").css("color", "red"));
        } else {
            sql = editeur.getValue();
            try {
                resultat = db.exec(sql)[0];
            } catch (error) {
                erreur = true;
                $("#resultat").html($("<div>").html("<strong>Erreur :</strong><br>" + error.message));
            } finally {
                if (!resultat && !erreur) {
                    erreur = true;
                    $("#resultat").html($("<div>").html("<strong>Attention :</strong><br>Aucun résultat trouvé."));
                }
                if (!erreur) {
                    if (resultat.length) {
                        $("#resultat").html($("<div>").html(resultat));
                    } else {
                        table = sql2table(resultat, "tablesql", false);
                        if (table) {
                            $("#resultat").append(table);
                            $("#tablesql").DataTable({
                                "ordering": false,
                                paging: false,
                                scrollY: ($("#resultat").height() - 150) + "px",
                                scrollCollapse: true,
                                autoWidth: false,
                                scrollX: true // $("#resultat").width() + "px"
                            });
                        }
                    }
                }
            }
            editeur.focus();
        }
    }
    
    // Affichage du contenu d'une base de données
    function afficherContenu() {
        var affichage = $("#contenu").css("display");
        if (affichage === "none") {
            $("#contenu").css("display", "block");
            $("#choixBD").css("display", "none");
            $("#lecon").css("display", "none");
            $("#tables").addClass("active");
        } else {
            $("#contenu").css("display", "none");
            $("#choixBD").css("display", "block");
            $("#lecon").css("display", "block");
            $("#tables").removeClass("active");
        }
        editeur.focus();
    }
    
    // Affichage du schéma d'une base de données
    function afficherSchema() {
        var png = "bases/" + $("#bdd").html().replace(".sqlite", "") + ".png";
        window.open(png);
    }
    
    // Lecture d'une base de données
    function lecture(fichier) {
        $("#bdd").html(fichier.replace("bases/", "").replace(".sqlite", ""));
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden");
        $("#schema").css("visibility", "hidden");
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
            $("#schema").css("visibility", "visible");
            
            contenu = db.exec("SELECT name, sql FROM sqlite_master WHERE type='table'");
            html = sql2table(contenu[0], "tabtables", true);
            $("#contenu").html(html);
            $("#tabtables").DataTable({
                "paging":   false,
                "ordering": false,
                "info":     false,
                "searching": false
            });
            editeur.focus();
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
        editeur.focus();

    }
    
    // Mise en place d'une interface de requêtage simple, avec choix de la base de données à gauche (et affichage de l'information)
    function requetage() {
        var bds = $("<div>").attr("id", "choixBD").css("text-align", "center"), liste;
        initialisation();
        $("#titre").html("Requêtage direct");
        
        liste = ["exemple.sqlite", "Comptoir2000.sqlite", "Gymnase2000.sqlite", "Chinook.sqlite", "world.sqlite", "ca.sqlite", "TourDeFrance.sqlite", "sakila.sqlite"];
        
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
                var item, texte;
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
                        $("#information").scrollTop(0);
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
                    var code = $(this).find("code"),
                        sql = code.html();
                    if (code.hasClass("lang-sql")) {
                        sql = sql.replace(/<span class="hljs-keyword">/g, '');
                        sql = sql.replace(/<span class="hljs-string">/g, '');
                        sql = sql.replace(/<span class="hljs-number">/g, '');
                        sql = sql.replace(/<span class="hljs-built_in">/g, '');
                        sql = sql.replace(/<span class="hljs-literal">/g, '');
                        sql = sql.replace(/&lt;/g, '<');
                        sql = sql.replace(/&gt;/g, '>');
                        sql = sql.replace(/<\/span>/g, '');
                        $("#resultat").children().remove();
                        editeur.setValue(sql);
                        editeur.gotoLine(1);
                    }
                });
            });
            
        });
    }
    
    // Ecran de début
    function debut() {
        var choix = $("<div>").attr("id", "choixAccueil"),
            choixGauche = $("<div>").attr("id", "choixGauche").css("float", "left").css("width", "50%"),
            choixDroite = $("<div>").attr("id", "choixDroite"),
            auj = new Date();
        ecran.children().remove();
        ecran.html("");
        $("#titre").html("");
        $("#bdd").html("");
        $("#lancer").css("visibility", "hidden");
        $("#tables").css("visibility", "hidden")
            .removeClass("active");
        $("#schema").css("visibility", "hidden");
         
        choixGauche.append($("<button>").html("1 - Requêtage simple").click(function () { lancementCours("1-requetage-simple"); }));
        choixGauche.append("<br>");
        choixGauche.append($("<button>").html("2 - Calculs et fonctions").click(function () { lancementCours("2-calculs-fonctions"); }));
        choixGauche.append("<br>");
        choixGauche.append($("<button>").html("3 - Agrégats").click(function () { lancementCours("3-agrégats"); }));
        choixGauche.append("<br>");
        choixGauche.append($("<button>").html("Récapitulatif 1").click(function () { lancementCours("recapitulatif1"); }));

        choixDroite.append($("<button>").html("4 - Jointures").click(function () { lancementCours("4-jointures"); }));
        choixDroite.append("<br>");
        choixDroite.append($("<button>").html("5 - Sous-requêtes").click(function () { lancementCours("5-sous-requetes"); }));
        choixDroite.append("<br>");
        choixDroite.append($("<button>").html("6 - Opérations ensemblistes").click(function () { lancementCours("6-ensemblistes"); }));
        choixDroite.append("<br>");
        choixDroite.append($("<button>").html("Récapitulatif 2").click(function () { lancementCours("recapitulatif2"); }));
        
        choix.append("<br>");
        choix.append(choixGauche);
        choix.append(choixDroite);
        
        // Si jour == 31/10/2016 et heure > 13h25
        if (((auj.getDate() + "/" + (auj.getMonth() + 1) + "/" + auj.getFullYear()) === "31/10/2016") &&
                ((auj.getHours() * 60 + auj.getMinutes()) >= (13 * 60 + 25))) {
            choix.append("<br>");
            choix.append($("<button>").html("TP noté 1").click(function () { lancementCours("tpnoté1"); }));
        }
        
        // Si jour == 28/22/2016 et heure > 13h25
        if (((auj.getDate() + "/" + (auj.getMonth() + 1) + "/" + auj.getFullYear()) === "28/11/2016") &&
                ((auj.getHours() * 60 + auj.getMinutes()) >= (13 * 60 + 25))) {
            choix.append("<br>");
            choix.append($("<button>").html("TP noté 2").click(function () { lancementCours("tpnoté2"); }));
        }
        
        choix.append("<br>");
        choix.append($("<button>").html("Requêtage direct").click(requetage));
        ecran.append(choix);
    }

    $("#accueil").click(debut);
    $("#lancer").click(execution);
    $("#tables").click(afficherContenu);
    $("#schema").click(afficherSchema);
    
    // Permet l'exécution de la requête via CTRL + Enter
    $(document).on('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && (e.which === 13)) {
            execution();
        }
    });
    
    // Permet la gestion du changement de taille de la fenêtre
    $(window).on("resize", function () {
        hauteur = (window.innerHeight - $("header").height() - $("footer").height());
        ecran.css("height", hauteur + "px");
        if (hauteur < 400) {
            tropPetit();
        } else {
            if (petit) {
                petit = false;
                debut();
            }
        }
    });

    hauteur = (window.innerHeight - $("header").height() - $("footer").height());
    ecran.css("height", hauteur + "px");
    if (hauteur < 400) {
        tropPetit();
    } else {
        debut();
    }

}());
