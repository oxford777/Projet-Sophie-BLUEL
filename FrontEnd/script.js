
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

    listeBtnFiltres.forEach(function(categorie){ 
    const btnCategorie = document.createElement("button"); 
        btnCategorie.textContent = categorie.name;
        btnCategorie.classList.add("bouton-filtres"); 

        btnCategorie.addEventListener("click", function(){
        const tousLesBtn = document.querySelectorAll(".bouton-filtres");
        tousLesBtn.forEach(function(bouton){
        bouton.classList.remove("actif");        
        });
       
        btnCategorie.classList.add("actif");

        const projetsFiltres = listeTravaux.filter(function(projets){ 
            return projets.categoryId === categorie.id; 
        });

        afficherElementsDansPage (projetsFiltres); 
        });

        filtres.appendChild(btnCategorie); 
     });
}

async function chargementPage() { 
    const contenuServeur = await obtenirDonneesServeur(); 
    const categoriesServeur = await filtresServeur(); 
    genererBoutons(categoriesServeur, contenuServeur); 
    afficherElementsDansPage(contenuServeur); 
}

chargementPage(); 


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

                sessionStorage.setItem("token", token); 
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




