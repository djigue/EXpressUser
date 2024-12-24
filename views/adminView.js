const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function adminView(flash = {}, role) {
    console.log("flash showadmin : ", flash)
    let html = `
    ${headerView(role)}
         <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
        <script>
             const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
        </script>
        <script src="/scripts/notif.js"></script>
       <h1>Bienvenue admin ! <br>Que voulez-vous faire ?</h1>
       <button><a href="admin/user">Supprimer un utilisateur</a></button>
       <button><a href="admin/annonce">Supprimer une annonce</a></button>
       <button><a href="admin/annonceval">Valider une annonce</a></button>
        
        ${footerView()}
    `;
    return html;
}

module.exports = adminView;
