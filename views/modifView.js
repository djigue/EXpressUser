const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function modifView(annonce, images, flash = {}, role) {
    let html = `${headerView(role)}
    <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
        <script>
            const flash = {
                success: "${flash.success || ''}",
                error: "${flash.error || ''}"
            };
        </script>;
        <script src="/scripts/notif.js"></script>
        <h1>Modifier l'annonce</h1>
         <div id="images-container">
         
                ${images.length > 0
                    ? images.map((image) => `
                        <div class="image-container">
                            <img src="/images/${image.url}" alt="Image ${image.id}" width="100">
                            <form method="POST" name="suppImage" action="/supprimer-image/${image.id}" enctype="multipart/form-data" style="display:inline;" onsubmit="return confirm('Voulez-vous vraiment supprimer cette image ?')">
                                <input type="hidden" name="suppImage" value="supprimer_image">
                                <button type="submit" class="delete-button">Supprimer</button>
                            </form>
                             <input type="hidden" name="existImages[]" value="${image.id}">
                        </div>
                    `).join('')
                    : '<p>Aucune image associée à cette annonce.</p>'
                } 
                
            </div><br>
        <form method="POST" name="modifAnn" action="/modifier-annonce/${annonce.id}" enctype="multipart/form-data"">
            <input type="hidden" name="annonce_id" value="${annonce.id}">
            <label for="titre">Titre : </label>
            <input type="text" id="titre" name="titre" value="${annonce.titre}" required><br>

            <label for="description">Description : </label>
            <textarea id="description" name="description" required>${annonce.description}</textarea><br>

            <label for="prix">Prix : </label>
            <input type="number" id="prix" name="prix" value="${annonce.prix}" required><br>

            <input type="file" name="imagesUser" multiple accept="image/*"><br>

            <button type="submit">Modifier</button>
        </form>
    ${footerView()}`;
    return html;
}

module.exports = modifView;
