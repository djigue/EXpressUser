const footerView = require ('../views/footerView');

function homeView (rows) {
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
        <li><a href="/login">Se connecter</a></li>
        <li><a href="/register">S'inscrire</a></li>
      </nav>
    </header>
    <body>
      <h1>Bienvenue chez Express User</h1>
      <p>BLA BLA BLA</p>
      <ul>`;

      rows.forEach(annonce => {
        html += `
        <li>
            <strong>${annonce.titre}</strong> - ${annonce.description} - <strong>${annonce.prix} €</strong>
            
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