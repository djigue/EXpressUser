const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function homeView (rows, flash = {}, role) {
    let html = `${headerView(role)}
    <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
       </script>;
       <script src="/scripts/notif.js"></script>
      <h1>Bienvenue chez Express User</h1>
      <p>BLA BLA BLA</p>
      <ul>`;

      rows.forEach(annonce => {
        html += `
          <li>
            <strong>${annonce.titre}</strong> - ${annonce.description} - <strong>${annonce.prix} €</strong>`
          if (role === 'admin' || role === 'user') { 
        html +=     `<a href="/annonce-voir/${annonce.id}"><button>Voir</button></a>`
          } 
        html += `         
          </li>`;
    });

    if (rows.length === 0) {
        html += `<p>Aucune annonces trouvées.</p>`;
    }

    html += `</ul>
             ${footerView()}`;
    return html;
}

module.exports = homeView;