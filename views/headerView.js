function showHeader (role) {
  let html = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Express User</title>
  </head>
  <body>
    <header>
      <nav>
        <ul>`;
        if (role === 'user' || role === 'admin') {
  html +=`<li><a href="/user">Accueil</a></li>
          <li><a href="/annonce">Voir les annonces</a></li>
          <li><a href="/depot/formulaire">Déposer une annonce</a></li>
          <li><a href="/depot">Voir vos annonces</a></li>
          <li><a href="/panier">Voir le panier</a></li>`
          };
          if (role != 'user' && role != 'admin') {
  html +=`<li><a href="/login">Se connecter</a></li>
          <li><a href="/register">S'inscrire</a></li>`
          };
          if (role === 'admin') {
  html += `<li><a href="/admin">Page Admin</a></li>
          `};
          if (role === 'admin' || role === 'user') {
  html +=`<form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>`
          };
  html += `</ul>
      </nav> 
    </header>`;
    return html;
}

module.exports = showHeader;
