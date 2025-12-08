
const galerie = document.querySelector(".gallery");
const filtres = document.getElementById("filtres");

async function obtenirDonneesServeur (){ 
    try{
        const reponseServeur = await fetch ("http://localhost:5678/api/works"); 
        if(!reponseServeur.ok){
            throw new Error("Erreur Serveur");
        }
        const listeObjets = await reponseServeur.json(); 
        return listeObjets;  
    }   catch(erreur){
        console.error("Impossible de récupérer les données: ", erreur);
        return[];
    }
}

function afficherElementsDansPage (afficherDonnees){ 
    galerie.innerHTML = ""; 

    afficherDonnees.forEach(visuels => { 
        const figure = document.createElement("figure"); 
        const image = document.createElement("img"); 
            image.src = visuels.imageUrl; 
            image.alt = visuels.title;
        const figcaption = document.createElement("figcaption"); 
            figcaption.textContent = visuels.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
    });
}

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

function genererBoutons (listeBtnFiltres, listeTravaux){ 
    filtres.innerHTML = ""; 
    const btnTous = document.createElement("button"); 
    btnTous.textContent = "Tous"; 
    btnTous.classList.add ("bouton-filtres"); 

    btnTous.addEventListener("click", function(){ 
    const tousLesBtn = document.querySelectorAll(".bouton-filtres"); 
    tousLesBtn.forEach(function(bouton){ 
        bouton.classList.remove("actif"); 
    });
    btnTous.classList.add("actif"); 

    afficherElementsDansPage(listeTravaux); 
    });

    filtres.appendChild(btnTous); 

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


/* ETAPE 5.2: Partie connexion/login  */
const formulaireLogin = document.getElementById("login-form"); 


if (formulaireLogin) {

    formulaireLogin.addEventListener("submit", async function (event) { 
        event.preventDefault(); 

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const identifiants = {
            email: email,
            password : password
        };

        try {
            const reponse = await fetch("http://localhost:5678/api/users/login", { 
                method :"post", 
                headers: { 
                    "Content-Type": "application/json" 
                },
                body: JSON.stringify(identifiants) 
            });
            
            if (reponse.ok){
                const donnees = await reponse.json(); 
                const token = donnees.token; 

                localStorage.setItem("token", token); 
                document.location = "index.html"; 
            } else {
                afficherMessageErreur("Erreur dans l'identification ou le mot de passe");
             }

        } catch(erreur) {
            console.error("Erreur lors de la tentative de connexion : ", erreur);
            afficherMessageErreur("Impossible de se connecter");
        }
    });
}
function afficherMessageErreur(texte) { 
    const zoneMessage = document.getElementById("message-erreur"); 
    if (zoneMessage) {
        zoneMessage.textContent = texte;
     } else {
       alert(texte);
        }
    }




