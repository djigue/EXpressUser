const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function adminView(totalUsers,totalAnnonces, totalAnnoncesval,flash = {}, role) {
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
       <h1>Bienvenue admin !</h1>
       <h2><br>Que voulez-vous faire ?</h2>
       <section>
       <h3>Il y'a ${totalUsers} utilisateurs inscrits</h3>
       <button><a href="admin/user">Supprimer un utilisateur</a></button>
       </section>
       <section>
       <h3>Il y'a ${totalAnnonces} annonces</h3>
       <button><a href="admin/annonce">Supprimer une annonce</a></button>
       </section>
       <section>
       <h3>Il y'a ${totalAnnoncesval} annonces à valider</h3>
       <button><a href="admin/annonceval">Valider une annonce</a></button>
       </section>
        
        ${footerView()}
    `;
    return html;
}

module.exports = adminView;
