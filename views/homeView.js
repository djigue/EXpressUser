const footerView = require ('../views/footerView');

function homeView () {
    return `<!DOCTYPE html>
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
      ${footerView()}`;
}

module.exports = homeView;