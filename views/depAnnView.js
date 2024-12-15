const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depAnnView(annonces, annoncesVal, flash = {}) {
    console.log(flash)
    let html = `
        ${headerView()}
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
        console.log("Flash transmis au client :", flash);
    if (annonces.length === 0) {
        html += `<p>Vous n'avez publié aucune annonce</p>`;
    } else {
        annonces.forEach(annonce => {
            html += `<li>${annonce.titre} - ${annonce.description} - ${annonce.prix} € 
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
            html += `<li>${annonceVal.titre} - ${annonceVal.description} - ${annonceVal.prix} € </li>`;
        });
    }

    html += `</ul>
     
            ${footerView()}`;
    return html;
}


module.exports = depAnnView;