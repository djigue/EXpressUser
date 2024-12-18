const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depotView(flash) {
    const hasFlash = flash && (flash.success || flash.error);
    let html = `${headerView()}`

    if (hasFlash) {
        html += `
        <script>
            const flash = {
                success: "${flash.success || ''}",
                error: "${flash.error || ''}"
            };
        </script>
        <script src="/scripts/notif.js"></script>`;
    }

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