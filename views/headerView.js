function showHeader () {
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
        <ul>
          <li><a href="/user">Acceuil</a></li>
          <li><a href="/produits">Produits</a></li>
          <li><a href="/annonce">Voir les annonces</a></li>
          <li><a href="/depot/formulaire">Déposer une annonce</a></li>
          <li><a href="/depot">Voir vos annonce</a></li>
          <li><a href="/login">Se connecter</a></li>
          <li><a href="/register">S'inscrire</a></li>
          <li><a href="/panier">Voir le panier</a></li>
          <form method="post" action="/logout">
              <button type="submit">Se déconnecter</button>
          </form>
        </ul>
      </nav> 
    </header>`;
}

module.exports = showHeader;
