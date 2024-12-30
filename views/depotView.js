const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depotView(flash = {}, role) {
    
    let html = `${headerView(role)}
        <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
        <script>
            const flash = {
                success: "${flash.success || ''}",
                error: "${flash.error || ''}"
            };
        </script>
        <script src="/scripts/notif.js"></script>`;


        html +=`    <h1>Déposer une annonce</h1>
            <form action="/depot" method="POST" enctype="multipart/form-data">
                <fieldset>
                    <legend>1- Les images</legend>
                   
                    <div>
                        <label for="imagesUser">Choisir une image (vous pouvez en sélectionner 3 maximum) :</label>
                        <input type="file" id="imagesUser" name="imagesUser" accept="image/*" multiple>
                    </div>
                    
                </fieldset>
                
                <fieldset>
                    <legend>2- L'annonce</legend>
                    <label for="categorie">CAtégorie : </label>
                    <select id="categorie" name="categorie">
                     <option></option>
                     <option value="immobilier">Immobilier</option>
                     <option value="maison">Maison et Jardin</option>
                     <option value="vehicule">Véhicules</option>
                     <option value="vetements">Vêtements</option>
                     <option value="elec">Électronique</option>
                     <option value="loisirs">Loisirs</option>
                     <option value="autres">Autres</option>
                    </select>
                    <label for="titre">Titre : </label>
                    <input type="text" id="titre" name="titre">
                    <br>
                    <label for="description">Description : </label>
                    <textarea id="description" name="description" rows="10" placeholder="Décrivez votre produit"></textarea> 
                    <br>
                    <label for="prix">Prix : </label> 
                    <input type="number" name="prix" id="prix" min="0" step="0.01">
                </fieldset>
                
                <button type="submit">Publier</button>
            </form>
            ${footerView()}`;

    return html;
}


module.exports = depotView;