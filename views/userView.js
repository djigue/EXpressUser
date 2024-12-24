const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function userView(user, flash = {}, role) {
  return `${headerView(role)}
  <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
       </script>;
       <script src="/scripts/notif.js"></script>
          <h1>Bienvenue, ${user.username}!</h1>
          <p>ID utilisateur : ${user.id}</p>
          <form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>
          ${footerView()} `;
};

module.exports = userView;