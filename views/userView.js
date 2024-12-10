const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function userView(user) {
  return `${headerView()}
          <h1>Bienvenue, ${user.username}!</h1>
          <p>ID utilisateur : ${user.id}</p>
          <form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>
          ${footerView()} `;
};

module.exports = userView;