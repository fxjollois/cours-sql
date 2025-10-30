/*global $,Uint8Array,SQL,ace,marked,hljs,document,window,XMLHttpRequest*/
(function () {
    "use strict";
    
    var ecran = $("#interface"), hauteur, db, editeur, petit = false, historiqueRequetes = [];
    
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
            if (sql.trim()) {
                historiqueRequetes.push(sql);
            }
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
                                ordering: false,
                                paging: false,
                                scrollY: ($("#resultat").height() - 170) + "px",
                                scrollCollapse: true,
                                autoWidth: false,
                                scrollX: true, // $("#resultat").width() + "px",
                                dom: 'Bfrtip',
                                buttons: [
                                    'copy', 'csv', 'pdf'
                                ]
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
    
    // Affichage de l'historique des requêtes
    function afficherHistorique() {
        if ($("#historique-conteneur").length) {
            $("#historique-conteneur").remove();
            return;
        }

        var conteneur = $("<div>").attr("id", "historique-conteneur").css({
            position: 'absolute',
            top: '60px',
            right: '10px',
            width: '40%',
            maxWidth: '500px',
            maxHeight: 'calc(100% - 80px)',
            backgroundColor: '#f9f9f9',
            border: '1px solid #ccc',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
        });

        var header = $("<div>").css({
            padding: '10px',
            borderBottom: '1px solid #ccc',
            backgroundColor: '#eee'
        });

        var titre = $("<h4>").html("Historique des requêtes").css({ margin: 0, flexGrow: 1 });
        var boutonCopier = $("<button>").html("Copier").css({
            marginLeft: '10px',
            padding: '5px 10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap'
        }).click(function () {
            var historiqueTexte = historiqueRequetes.join(";\n\n");
            navigator.clipboard.writeText(historiqueTexte).then(function () {
                boutonCopier.html("Copié !");
                setTimeout(function () {
                    boutonCopier.html("Copier");
                }, 2000);
            });
        });

        var boutonExporter = $("<button>").html("Fichier SQL").css({
            marginLeft: '10px',
            padding: '6px 12px',
            backgroundColor: '#008CBA',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap'
        }).click(function () {
            var historiqueTexte = historiqueRequetes.join(";\n\n");
            var blob = new Blob([historiqueTexte], {type: "text/plain;charset=utf-8"});
            var url = URL.createObjectURL(blob);
            var a = $("<a>").attr("href", url).attr("download", "historique.sql").css("display", "none");
            $("body").append(a);
            a[0].click();
            a.remove();
            URL.revokeObjectURL(url);
        });

        var fermer = $("<button>")
            .html("&times;")
            .attr('aria-label', 'Fermer')
            .css({
                marginLeft: '10px',
                border: 'none',
                background: 'transparent',
                color: '#000',
                fontSize: '28px',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap'
            }).click(function () {
                conteneur.remove();
            });

        header.css({ display: 'flex', alignItems: 'center' });
        header.append(titre).append(boutonCopier).append(boutonExporter).append(fermer);
        conteneur.append(header);

        var listeConteneur = $("<div>").css({
            padding: '10px',
            overflowY: 'auto'
        });

        if (historiqueRequetes.length === 0) {
            listeConteneur.append($("<p>").html("Aucune requête exécutée."));
        } else {
            var liste = $("<ul>").css({ listStyle: 'none', padding: 0, margin: 0 });
            $.each(historiqueRequetes.slice().reverse(), function (i, requete) {
                var item = $("<li>").css({ display: 'flex', alignItems: 'center', marginBottom: '5px' });
                var pre = $("<pre>").html(requete).css({
                    cursor: 'pointer',
                    padding: '8px',
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '3px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    flexGrow: 1,
                    margin: 0
                }).hover(function () {
                    $(this).css('backgroundColor', '#eef');
                }, function () {
                    $(this).css('backgroundColor', '#fff');
                });

                pre.click(function () {
                    editeur.setValue(requete);
                    editeur.gotoLine(1);
                    conteneur.remove();
                });

                var boutonSupprimer = $("<button>").html("X").css({
                    marginLeft: '3px',
                    padding: '3px 6px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap'
                }).click(function () {
                    var originalIndex = historiqueRequetes.length - 1 - i;
                    if (originalIndex > -1) {
                        historiqueRequetes.splice(originalIndex, 1);
                    }
                    item.remove();
                    if (historiqueRequetes.length === 0) {
                        liste.remove();
                        listeConteneur.append($("<p>").html("Aucune requête exécutée."));
                    }
                });

                item.append(pre);
                item.append(boutonSupprimer);
                liste.append(item);
            });
            listeConteneur.append(liste);
        }
        conteneur.append(listeConteneur);
        $("body").append(conteneur);
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
        xhr.onload = function () {
            var uInt8Array = new Uint8Array(this.response), contenu, html;
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
            requetesql = $("<div>").attr("id", "requetesql"),
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
        
        liste = [
            "exemple.sqlite", "Comptoir2000.sqlite", "Gymnase2000.sqlite", "Chinook.sqlite", 
            "world.sqlite", "ca.sqlite", "TourDeFrance.sqlite", "sakila.sqlite", "stages.sqlite", 
            "CabinetMedical.sqlite", "bibliotheque.sqlite", "confiserie.sqlite", "Northwind.sqlite",
            "ClassicModel.sqlite", "db_vide.sqlite"
            ];
        console.log(liste);
        liste.sort(function (a, b) {
            return a.localeCompare(b);
        });
        
        $.each(liste, function (i, e) {
            var bouton = $("<button>")
                .addClass("bd")
                .html(e.replace(".sqlite", ""))
                .click(function () {
                    $("button.active").removeClass("active");
                    lecture("bases/" + e);
                    $(this).addClass("active");
                });
            bds.append(bouton);
            // bds.append($("<br>"));
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
            queue = donnees.fichiers.map(function (fic) {
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
                        $("#textes div").css("display", function (iclick) {
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
                $("#textes pre").click(function () {
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
            choixDroite = $("<div>").attr("id", "choixDroite");
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
        
        choix.append("<br>");
        choix.append($("<button>").html("Requêtage direct").click(requetage));
        ecran.append(choix);
    }

    $("#accueil").click(debut);
    $("#lancer").click(execution);
    $("#tables").click(afficherContenu);
    $("#schema").click(afficherSchema);
    $("#historique").click(afficherHistorique);
    
    // Permet l'exécution de la requête via CTRL + Enter
    $(document).on('keydown', function (e) {
        if ((e.metaKey || e.ctrlKey) && (e.which === 13)) {
            execution();
        }
    });
    
    // Permet la gestion du changement de taille de la fenêtre
    // Test taille originale : 400px nouvelle 600px
    $(window).on("resize", function () {
        hauteur = (window.innerHeight - $("header").height() - $("footer").height());
        ecran.css("height", hauteur + "px");
        if (hauteur < 600) {
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
    if (hauteur < 600) {
        tropPetit();
    } else {
        debut();
    }

}());