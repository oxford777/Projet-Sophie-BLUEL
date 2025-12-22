const galerie = document.querySelector(".gallery");
const filtres = document.getElementById("filtres");

/* PAGE D'ACCUEIL */
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
        figure.dataset.id = visuels.id; /* etape 7 */

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
    btnTous.classList.add ("bouton-filtres", "actif"); 

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

/*chargementPage(); puisque maintenant, j'appelle chargementPage() dans demarrer() seulement si galerie et filtres existent (donc pas sur login.html).*/


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

/* ETAPE 5.3 */
/* GESTION DU MODE EDITION/LOGIN */
function appliquerEtatConnexion(){
    const token = sessionStorage.getItem("token");
    const bandeauModeEdition = document.getElementById("mode-edition");
    const loginLink = document.getElementById("login-link");
    const boutonsModifier = document.querySelectorAll(".btn-modifier");


if (token) { /* utilisateur connecté */

    document.body.classList.add("mode-edition"); /* on active la class sur le body soit le margin top de 100px */

    if(bandeauModeEdition) { /* affiche le bandeau noir */
        bandeauModeEdition.style.display = "flex";
    }

    if(filtres) { /* cache les filtres */
        filtres.style.display = "none";
}

    if(loginLink) { /* remplace login par logout */
        loginLink.textContent = "logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", function(event) {
            event.preventDefault();

            sessionStorage.removeItem("token"); /* supression du token = deconnexion */
            document.location = "index.html"; /* retour à la page d'accueil */
        });
    }

    boutonsModifier.forEach((btn) => { /* afficher les boutons "modifier" */
        btn.style.display = "flex";
        });

    } else { /* utilisateur non connecté */

        document.body.classList.remove("mode-edition"); /* on enlève la class du body */

        if(bandeauModeEdition) { /* bandeau caché */
            bandeauModeEdition.style.display = "none";
        }

        if(filtres) { /* filtres visibles (on laisse le style par defaut) */
            filtres.style.display = "";
        }

        if(loginLink){ /* lien login normal */
            loginLink.textContent = "login";
            loginLink.href = "login.html";
        }

        boutonsModifier.forEach((btn) => {
            btn.style.display = "none";
        });
    }
}


/* ETAPE 6 */

const modale = document.getElementById("modale");
const overlay = document.querySelector(".modale-overlay");
const btnClose = document.querySelector(".modale-close");
const btnModifier = document.getElementById("btn-modifier-projets");

const zoneGalerie = document.getElementById("modale-galerie");
const zoneFormulaire = document.getElementById("modale-form");

const btnAjouterPhoto = document.getElementById("btn-ajouter-photo");
const btnRetour = document.querySelector(".modale-retour");

const galerieModale = document.querySelector(".modale-galerie-images");


function ouvrirModale(){
    modale.style.display = "flex";
    afficherGalerie(); 
}

function fermerModale(){
    modale.style.display = "none";
}


function afficherGalerie(){
    zoneGalerie.style.display = "block";
    zoneFormulaire.style.display = "none";
}

function afficherFormulaire(){
    zoneGalerie.style.display = "none";
    zoneFormulaire.style.display = "block";
}


async function afficherGalerieDansModale() {
    const works = await obtenirDonneesServeur();
    galerieModale.innerHTML = "";

    works.forEach((work) => {
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete");
        btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
        btnDelete.dataset.id = work.id;

        figure.appendChild(img);
        figure.appendChild(btnDelete);
        galerieModale.appendChild(figure);

    });
}

/* ETAPE 7 : suppression des travaux existants*/
async function supprimerTravail(id) {
    const token = sessionStorage.getItem('token');
    if(!token) return;

    const reponse = await fetch(`http://localhost:5678/api/works/${id}`,{
        method : "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if(!reponse.ok){
        throw new Error("Erreur lors de la suppression");
    }
}
/* FIN DE L'ETAPE 7 */

if (btnModifier){
    btnModifier.addEventListener("click", (e) => {
        e.preventDefault();
        ouvrirModale();
        afficherGalerieDansModale();
    });
}

if (btnClose) btnClose.addEventListener("click", fermerModale);
if (overlay) overlay.addEventListener("click", fermerModale);

if (btnAjouterPhoto) {
    btnAjouterPhoto.addEventListener("click", () => {
    afficherFormulaire();
    });
}

if (btnRetour) {
    btnRetour.addEventListener("click", () => {
    afficherGalerie();
    });
}
/* fin d l'etape 6 */


/* ETAPE 7 suite */
if(galerieModale){
    galerieModale.addEventListener("click", async(e) => {
        const btn = e.target.closest(".btn-delete");
        if(!btn) return;

        const identifiantProjet = btn.dataset.id;

        try{
            await supprimerTravail(identifiantProjet);

           /* retire dans la modale */ 
           btn.closest("figure")?.remove();

           /* retire dans la galerie principale */
           document.querySelector(`.gallery figure[data-id="${identifiantProjet}"]`)?.remove();

        }catch(error){
            console.error(error);
            alert("Impossible de supprimer le projet");
        }
    });
}
/* fin de l'etape 7 */

/*  ETAPE 8.1 */

/* 1) On récupère les éléments du formulaire */
const formAjout = document.getElementById("form-ajout-photo");
const inputFile = document.getElementById("image");
const selectCat = document.getElementById("categorie");
const btnUpload = document.querySelector(".btn-upload");


const msgErreur = document.getElementById("message-erreur-ajout");

function afficherErreurAjout(message) {
    if (msgErreur) msgErreur.textContent = message;
    else alert(message);
}

function effacerErreurAjout() {
    if(msgErreur) msgErreur.textContent = "";
}

function resetPreviewAjoutPhoto() {
    const zoneImage = document.querySelector(".form-image");
    if (!zoneImage) return;

zoneImage.classList.remove("has-preview");

const preview = zoneImage.querySelector("img.preview");
if (preview) preview.remove();

if (inputFile) inputFile.value = "";
}

async function chargerCategoriesDansSelect() {
    if(!selectCat) return;


const categories = await filtresServeur();

selectCat.innerHTML = "";

const optionVide = document.createElement("option");
    optionVide.value = "";
    optionVide.textContent = "";
    selectCat.appendChild(optionVide);

categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    selectCat.appendChild(option);
});
}

function afficherPreviewImage(file) {
    if(!file) return;

    const zoneImage = document.querySelector(".form-image");
    if(!zoneImage) return;

    zoneImage.classList.add("has-preview");

    const anciennePreview = zoneImage.querySelector("img.preview");
    if (anciennePreview) anciennePreview.remove();

    const img = document.createElement("img");
    img.classList.add("preview");
    img.src = URL.createObjectURL(file);
    img.alt = "Aperçu";

    zoneImage.insertBefore(img, inputFile);

}

if (btnUpload && inputFile) {
    btnUpload.addEventListener("click", () =>{
        inputFile.click();
    });
}

if (inputFile) {
    inputFile.addEventListener("change", () =>{
        effacerErreurAjout();
        const file = inputFile.files[0];
        if (file) afficherPreviewImage(file);
    });
}

/* ETAPE 8.2 */

function ajouterProjetDansGaleriePrincipale(work) {
    if (!galerie) return;

    const figure = document.createElement("figure");
    figure.dataset.id = work.id;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const cap = document.createElement("figcaption");
    cap.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(cap);
    galerie.appendChild(figure);
    }   

function ajouterProjetDansGalerieModale(work) {
    if (!galerieModale) return;

    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn-delete");
    btnDelete.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    btnDelete.dataset.id = work.id;

    figure.appendChild(img);
    figure.appendChild(btnDelete);
    galerieModale.appendChild(figure);
    }
/* FIN DE L'ETAPE 8.2  */


async function envoyerFormulaireAjout(event) {
    event.preventDefault();
    effacerErreurAjout();

    const token = sessionStorage.getItem("token");
    if(!token) {
        afficherErreurAjout("Vous devez être connecté pour ajouter un projet");
        return;
    }

  const file = inputFile.files[0];
  const title = document.getElementById("title").value.trim();
  const category = selectCat.value;

  if (!file || !title || !category) {
    afficherErreurAjout("Veuillez renseigner une image, un titre et une catégorie");
    return;
  }

  
  const formData = new FormData(formAjout);

  formData.delete("categorie");
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works",{
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json().catch(() => null);
    if(!response.ok) {
        afficherErreurAjout(data?.message || "Erreur : envoi impossible");
        return;
    }

    
    console.log("Réponse API (projet créé):", data );

    
    ajouterProjetDansGaleriePrincipale(data);
    ajouterProjetDansGalerieModale(data);

    formAjout.reset();
    resetPreviewAjoutPhoto();

    fermerModale();
    
  } catch (error) {
    console.error(error);
    afficherErreurAjout("Erreur réseau : impossible d'envoyer le projet");
  }  
}

if (formAjout) {
    formAjout.addEventListener("submit", envoyerFormulaireAjout);
}

if (btnAjouterPhoto) {
    btnAjouterPhoto.addEventListener("click", async() => {
        formAjout.reset();
        resetPreviewAjoutPhoto();
        await chargerCategoriesDansSelect();
    })
}
/* FIN DE L'ETAPE 8.1 */


    function demarrer(){
        if(galerie && filtres){ /* on charge les travaux uniquement sur la page d'acceuil */
            chargementPage();
        }
        appliquerEtatConnexion();
    }
    demarrer();


