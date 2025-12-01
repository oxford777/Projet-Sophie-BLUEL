/* Sélection des éléments dans la page */
const galerie = document.querySelector(".gallery");
const filtres = document.getElementById("filtres");

/* On récupere les éléments de la galerie dans le Serveur */
async function obtenirDonneesServeur (){ /* fonction avec une action différée, asynchrone. Elle parle au Serveur, elle fait le fetch, reçoit la reponse et retourne un tableau (liste d'objets) */
    try{
        const reponseServeur = await fetch ("http://localhost:5678/api/works"); /* On envoie une demande de données au Serveur et on attend sa réponse */
        if(!reponseServeur.ok){
            throw new Error("Erreur Serveur");
        }
        const listeObjets = await reponseServeur.json(); /* La réponse en attente du Serveur nous renvoie une liste json qui est transformé en objet js (.json)  */
        return listeObjets; /* on a un tableau de liste d'objet qu'on renvoie pour être utilisé dans le code quand on l'appelle. listeObjets contient les données envoyées par le Serveur */
    }   catch(erreur){
        console.error("Impossible de récupérer les données: ", erreur);
        return[];
    }
}

/* Ensuite on affiche cette liste json qui contient les données Serveur */
function afficherElementsDansPage (afficherDonnees){ /* je crée une fonction qui va afficher les données pour construire le HTML */
    galerie.innerHTML = ""; /* A chaque fois que js veut réafficher qq chose, il efface d'abord ce qu'il y a dedans (meme si c'est dejà vide) pour etre sur de repartir de zéro sinon il y a doublon */

    afficherDonnees.forEach(visuels => { /* Pour chaque élément "visuels", ce dernier parcours chaque élément individuel du tableau d'objet "afficherDonnees" */
        const figure = document.createElement("figure"); /* crée un nouvel élément HTML <figure> qu'on stocke dans la variable figure*/
        const image = document.createElement("img"); /* crée un nouvel élément HTML <img> qu'on stocke dans la variable image*/
        /* On remplit ces éléments avec les infos du serveur */
            image.src = visuels.imageUrl; /* Pour cette image que je viens de créer, je lui mets l'adresse URL envoyée par le serveur. */
            image.alt = visuels.title;
        const figcaption = document.createElement("figcaption"); /* crée un nouvel élément HTML <figcaption> qu'on stocke dans la variable figcaption*/
            figcaption.textContent = visuels.title;

        /*on crée une figure vide, elle existe, mais elle n’est pas encore dans la page, puis on met l’image dedans et le figcaption.On ajoute à la fin la figure complète dans la galerie */
        figure.appendChild(image);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
    });
}

/* Récupération des catégories pour les filtres */
async function filtresServeur() {
    try{
        const reponseFiltresServeur = await fetch("http://localhost:5678/api/categories");
        if(!reponseFiltresServeur.ok){
            throw new Error("Erreur Serveur");
    }
    const listeObjetsFiltres = await reponseFiltresServeur.json();
    return listeObjetsFiltres;
    } catch(erreur){
        console.error("Impossible de récupérer les données: ", erreur);
        return[];
    }
}

/* Création des boutons de filtres */
function genererBoutons (listeBtnFiltres, listeTravaux){ /* déclaration d'une fct avec 2 tableaux recupéré depuis l'API et qui sera appelé au chargement de la page */
    filtres.innerHTML = ""; /* réf à la div dans le html */

/* Bouton "Tous" */
    const btnTous = document.createElement("button"); /* on crée un élément html "button" en mémoir et on le stocke dans la variable */
    btnTous.textContent = "Tous"; /* on définit le texte qui sera inscrit dans le bouton */
    btnTous.classList.add ("bouton-filtres"); /* applique le style css au bouton */

    btnTous.addEventListener("click", function(){ /* on est à l'écoute de l'évènement "click" qui exécutera ce qui est à l'intérieur de la fct anonyme {...} */
/* On enlève "actif" de tous les boutons */
    const tousLesBtn = document.querySelectorAll(".bouton-filtres"); /* on sélectionne tous les élèments qui ont la class css ".bouton-filtres" et on les stocke dans la variable */
    tousLesBtn.forEach(function(bouton){ /* on parcourt la liste de tousLesBtn et à chaque bouton, "bouton" représente un des boutons (Tous, Objets, Appartements, Hôtels…), */
        bouton.classList.remove("actif"); /* on enlève la classe CSS "actif" de ce bouton donc plus aucun n’est en vert */
    });
    btnTous.classList.add("actif"); /*  On met "actif" sur le bouton "Tous", il est vert et devient le bouton sélectionné */

    afficherElementsDansPage(listeTravaux); /* on appelle la fonction avec en parametre "listeTravaux" ce qui va permettre de vider la galerie, de recréer 
    toutes les "figures" et afficher toutes les images. Quand on clique sur "Tous", on voit tous les projets. */
    });

    filtres.appendChild(btnTous); /* on ajoute le bouton "tous" dans la div "filtres" dans le html */

/* boutons pour chaque catégorie */
    listeBtnFiltres.forEach(function(categorie){ /* c’est le tableau de la variable "listeBtnFiltres" qui contient toutes les catégories venant de l’API et "categorie" contient un element de chaque categorie */
    const btnCategorie = document.createElement("button"); /* chaque categorie aura son bouton html */
        btnCategorie.textContent = categorie.name; /* on définit le texte de chaque bouton inscrit dans "name" dans l'API */
        btnCategorie.classList.add("bouton-filtres"); /* applique le style css à chaque bouton */

        btnCategorie.addEventListener("click", function(){
/* On enlève "actif" de tous les boutons */
        const tousLesBtn = document.querySelectorAll(".bouton-filtres");
        tousLesBtn.forEach(function(bouton){
        bouton.classList.remove("actif");        
        });
       
        btnCategorie.classList.add("actif");

        /* on filtre les travaux, projets, qui appartienne à cette catégorie */
        const projetsFiltres = listeTravaux.filter(function(projets){ /* "filter" crée un nouveau tableau qui ne contient que les éléments qui respectent 
une condition en se basant sur liste complète de tous les projets "listeTravaux". A chaque tour, "projets" représente un des projets. */
            return projets.categoryId === categorie.id; /* la catégorie du projet (1, 2 ou 3) soit avoir strictement la même valeur que l’id de la catégorie 
du bouton sur lequel on a cliqué. Si les deux sont égaux: le travail appartient à cette catégorie donc on le garde. */
        });

        afficherElementsDansPage (projetsFiltres); /* On réutilise ta fonction d'affichage mais en lui donnant uniquement les projets filtrés */
        });

        filtres.appendChild(btnCategorie); /* on ajoute tous les boutons "btnCategorie" dans la div "filtres" dans le html */
     });
}

/* chargement de la page */
async function chargementPage() { /* on crée une fct "chargementPage", asynchrone, qui sert de point de départ */
    const contenuServeur = await obtenirDonneesServeur(); /* la fct "obtenirDonneesServeur" parle avec le serveur ce qui prend du temps donc on attends qu'elle termine son travail avant de passer à la suite.
    Une fois que le Serveur a répondu, et que "obtenirDonneesServeur" a terminé, le résultats (le tableau des visuels) est stocké dans la variable "contenuServeur" pour ensuite le transmettre*/
    const categoriesServeur = await filtresServeur(); /* on récupere les catégorie */
    genererBoutons(categoriesServeur, contenuServeur); /* On génère les boutons filtres */
    afficherElementsDansPage(contenuServeur); /* fct qui affiche sur la page le tableau des données qui sont stockées dans la variable "contenuServeur" récupéré ci-dessus*/
}

chargementPage(); /* on lance, éxécute, le chargement */

/* JS va chercher les données fct obtenirDonneesServeur avec fetch, attend la reponse du Serveur avec await, convertis la reponse en format .json, crée du HTML à partir des données et l'insère dans la page*/

