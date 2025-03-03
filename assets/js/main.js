/*************************************          Déclarations constantes                 ************************************/
const btnClose = document.querySelector(".btn-close");
const btnAccompte = document.querySelector("#form-accompte");
const btnDepot = document.querySelector("#form-depot");
const content = document.querySelector(".content");
const compteBancaires = [];
// Constante qui va me permettre de ne pas ouvrir plusieurs fois les fenêtres
let erreur;
let succes;
/*************************************          Décalaration classe                ************************************/
class CompteBancaire {
  constructor(proprietaire, numeroCompte, solde) {
    this.nom = proprietaire;
    this.numeroCompte = numeroCompte;
    this.solde = solde;
  }
}
/*************************************          Fonctions                 ************************************/

/***********Fonction Création de compte */
function displayFormCreation() {
  let displayForm;
  if (document.querySelector(".display-form")) return;
  removeDepotDisplay();
  displayForm = document.createElement("div");
  displayForm.classList.add("form");
  displayForm.classList.add("display-form");
  displayForm.innerHTML = `
            <h2>Créer un compte</h2>
            <form class="create-accompte">
            <input type="text" class="nom" placeholder="Entrez votre nom" required >
            <input type="text" class="numeroCompte" placeholder="Numéro de compte" required  >
            <button class="btn-submit" id="form-accompte" type="submit" >Créer un compte</button>
            </form>
      `;
  content.append(displayForm);
  // J'ecoute la soumission du formulaire
  const inputNom = document.querySelector(".nom");
  const inputNumeroCompte = document.querySelector(".numeroCompte");
  const formAccompte = document.querySelector(".create-accompte");

  // création du compte bancaire
  formAccompte.addEventListener("submit", (e) => {
    e.preventDefault();
    const nom = inputNom.value;
    const numeroCompte = inputNumeroCompte.value;
    //Gére l'entrée de l'input du numéro de compte
    if (isNaN(numeroCompte)) {
      displayErreur();
      erreur.innerHTML =
        "Veuillez entrer un numéro pour votre numéro de compte";
      return;
    }
    let solde = 0;
    // Vérification si le compte existe dans le tableau => je check uniquement si le numero de compte correspond, le noms peut se repeter
    const compte = compteBancaires.find(
      (user) => user.numeroCompte === numeroCompte
    );

    if (compte) {
      displayErreur();
    } else {
      displaySuccess(nom, numeroCompte, solde);
    }
    // J'instancie un nouveau compte et je le push dans le tablo
  });
}
/***********Fonction DEPOT */
// fonction permet de fermer les fenetres
function displayDepot() {
  let depot;
  if (document.querySelector(".create-depot")) return;
  removeCreationDisplay();
  depot = document.createElement("div");
  depot.classList.add("form");
  depot.classList.add("display-depot");
  depot.innerHTML = `
            <h2>Faire un dépot</h2>
            <form class="create-depot">
            <input type="text" class="input-nom-depot" placeholder="Entrez un nom" required>
            <input type="text" class="input-numero" placeholder="Numéro de compte" required>
            <input type="number" class="input-montant" placeholder="Entrez un montant"required>
            <button class="btn-submit" id="submit-depot" type="submit">Confirmer</button>
            </form>
        `;
  content.append(depot);
  const depotForm = document.querySelector(".create-depot");
  depotForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nom = document.querySelector(".input-nom-depot").value;
    const numeroCompte = document.querySelector(".input-numero").value;
    const montant = parseFloat(document.querySelector(".input-montant").value);

    if (isNaN(numeroCompte) || isNaN(montant)) {
      displayErreur();
      erreur.innerHTML =
        "Vérifier que la nature de votre numéro de compte et montant soit bien un nombre";
      return;
    }
    const compte = compteBancaires.find(
      (user) => user.nom === nom && user.numeroCompte === numeroCompte
    );

    if (!compte) {
      displayErrorDepot();
    } else {
      displaySuccessDepot(compte, montant);
    }
  });
}

//Génère la fenetre succes green pour la section depot

function displaySuccessDepot(compte, montant) {
  document.querySelector(".erreur")?.remove();
  document.querySelector(".success")?.remove();
  // Ajout du montant au solde
  compte.solde += montant;
  console.log(compte.solde, montant);
  console.log(compteBancaires);

  //vérifie la nature du montant
  if (montant <= 0 || isNaN(montant)) {
    displayErreur();
    erreur.innerHTML = "Le montant doit être superieur à 0";
    return;
  }
  //création de la div success verte
  succes = document.createElement("div");
  succes.innerHTML = `
                <h2>Success</h2>
                <p>Votre transaction est acceptée pour le compte ${compte.numeroCompte} <br> 
                Votre nouveau solde est de ${compte.solde} $ </p>
                `;
  succes.classList.add("form");
  succes.classList.add("success");
  succes.style.backgroundColor = "green";
  succes.style.color = "white";
  content.append(succes);
}

// fonction qui permet de gerer les erreurs lors du dépot.
function displayErrorDepot() {
  document.querySelector(".erreur")?.remove();
  document.querySelector(".success")?.remove();
  erreur = document.createElement("div");
  erreur.innerHTML = `
                <h2>Error</h2>
                <p>Vous n'avez pas les bons identifiants</p>
                `;
  erreur.classList.add("form");
  erreur.classList.add("erreur");
  erreur.style.backgroundColor = "red";
  erreur.style.color = "white";
  content.append(erreur);
}

// Gerer les erreurs lors de la creation de compte.
function displayErreur() {
  document.querySelector(".erreur")?.remove();
  document.querySelector(".success")?.remove();
  console.log("Match");
  erreur = document.createElement("div");
  erreur.innerHTML = `
            <h2>Error</h2>
            <p>Les identifiants rentrés sont déjà utilisé pour un autre compte</p>
            `;
  erreur.classList.add("form");
  erreur.classList.add("erreur");
  erreur.style.backgroundColor = "red";
  erreur.style.color = "white";
  content.append(erreur);
}
//Generer la fenetre succes green pour la section création de compte
function displaySuccess(nom, numeroCompte, solde) {
  document.querySelector(".erreur")?.remove();
  document.querySelector(".success")?.remove();
  console.log("No match");
  // je push les coordonnées du nouveau compte dans mon tableau
  const comptebancaire = new CompteBancaire(nom, numeroCompte, solde);
  compteBancaires.push(comptebancaire);
  succes = document.createElement("div");
  succes.innerHTML = `
            <h2>Success</h2>
            <p>Votre compte a bien été créé au nom de ${nom} avec le numéro ${numeroCompte}</p>
            `;
  succes.classList.add("form");
  succes.classList.add("success");
  succes.style.backgroundColor = "green";
  succes.style.color = "white";
  content.append(succes);
  console.log(compteBancaires);
}
//Nettoyer les fenetre de la section création de compte
function removeCreationDisplay() {
  content.querySelector(".erreur")?.remove();
  content.querySelector(".success")?.remove();
  content.querySelector(".display-form")?.remove();
}
//Nettoyer les fenetre de la section dépot d'argent
function removeDepotDisplay() {
  content.querySelector(".erreur")?.remove();
  content.querySelector(".success")?.remove();
  content.querySelector(".display-depot")?.remove();
}

/*************************************          Ecoute evenement                 ************************************/
// display Formulaire creation Depot
btnDepot.addEventListener("click", displayDepot);
// Display formulaire creation compte
btnAccompte.addEventListener("click", displayFormCreation);
// Fermeture de toute les fenetres
btnClose.addEventListener("click", () => {
  removeCreationDisplay();
  removeDepotDisplay();
});
