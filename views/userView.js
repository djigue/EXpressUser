function userView(user) {
  return `
  <html>
      <body>
          <h1>Bienvenue, ${user.username}!</h1>
          <p>ID utilisateur : ${user.id}</p>
          <form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>
      </body>
  </html>`;
}

module.exports = userView;