const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depAnnView(annonces, annoncesVal, flash = {}, role) {
    let html = `
        ${headerView(role)}
        <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>`;
 html += `<script src="/scripts/notif.js"></script>
        <h2>Vos annonces</h2>
        <ul>`;

    if (annonces.length === 0) {
        html += `<p>Vous n'avez publié aucune annonce</p>`;
    } else {
        annonces.forEach(annonce => {
            const images = annonce.images || [];
            html += `<li>${annonce.titre} - ${annonce.description} - ${annonce.prix} € 
            <div class="images-container">
                ${images.map(image => `
                    <img src="/images/${image}" alt="Image de l'annonce ${annonce.titre}" style="max-width: 150px; margin-right: 10px;">
                `).join('')}
            </div>
                        <a href="/modifier-annonce/${annonce.id}"><button>Modifier</button></a>
                        <form method="POST" action="/supprimer-annonce-user/${annonce.id}" style="display:inline;">
                            <button type="submit">Supprimer</button>
                        </form>
                    </li>`;
        });
    }

    html += `</ul>
             <br>
             <h2>Vos annonces en cours de validation</h2>
             <ul>`;

    if (annoncesVal.length === 0) {
        html += `<p>Vous n'avez aucune annonce en cours de validation</p>`;
    } else {
        annoncesVal.forEach(annonceVal => {
            const imagesval = annonceVal.images || [];
            html += `<li>${annonceVal.titre} - ${annonceVal.description} - ${annonceVal.prix} € ;
            <div class="images-container">
                ${imagesval.map(imageval => `
                    <img src="/images/${imageval}" alt="Image de l'annonce ${annonceVal.titre}" style="max-width: 150px; margin-right: 10px;">
                `).join('')}
            </div>
            </li>`
        });
    }

    html += `</ul>
     
            ${footerView()}`;
    return html;
}


module.exports = depAnnView;