const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depotView() {
    let html =`${headerView()}
            <h1>déposer une annonce</h1>
            <form method="post" id="depotForm" action ="/depot">
                <label for="titre">Titre : </label>
                <input type="text" id="titre" name="titre">
                <br>
                <label for="description">Déscription : </label>
                <textarea id="description" name="description" rows="10" placeholder="decrivez votre produit"></textarea> 
                <br>
                <label for="prix">Prix : </label> 
                <input type="number" name="prix" id="prix" min="0" step="0.01">
                <br>
                <button type="submit">Publier</button>
            </form>
            
            ${footerView()}`;

    return html;
}

module.exports = depotView;