const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function modifView (row) {
    console.log('row reçu : ', row);
   return`${headerView()}
       <h1>Modifier l'annonce</h1>
       <form method="POST" action="/modifier-annonce/${row.id}">
           <label for="titre">Titre : </label>
           <input type="text" id="titre" name="titre" value="${row.titre}" required><br>

           <label for="description">Description : </label>
           <textarea id="description" name="description" required>${row.description}</textarea><br>

           <label for="prix">Prix : </label>
           <input type="number" id="prix" name="prix" value="${row.prix}" required><br>

           <button type="submit">Modifier</button>
        </form>
        ${footerView()}`;
}

module.exports = modifView;