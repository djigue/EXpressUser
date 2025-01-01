const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function panierView(annoncesArray, totalPanier, flash = {}, role) {

  console.log("annArray : ", annoncesArray);
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
      <div class="min-h-screen bg-zinc-200 py-10">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-center mb-8">Votre Panier</h1>`;
  
    if (annoncesArray.length > 0) {
      html += `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      `;
  
      annoncesArray.forEach(annonce => {
        const totalAnnonce = annonce.prix * annonce.quantite;
        const imageUrl = annonce.images.length > 0 ? annonce.images[0] : null;
        html += `
          <div class="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div>
              <h2 class="text-lg font-semibold mb-2">${annonce.titre}</h2>
              <h2 class="text-sm text-gray-500">Catégorie : ${annonce.categorie}</h2>
            </div>
            <div class="w-full h-48 bg-gray-100 flex items-center justify-center">
              ${annonce.images.length > 0 
                  ? `<img src="/images/${annonce.images[0]}" alt="Image de l'annonce ${annonce.titre}" class="object-cover h-full w-full">`
                  : '<p class="text-gray-500">Aucune image disponible</p>'
                }
            </div>
            <div>
              <p class="text-gray-700 mb-2">Prix : ${annonce.prix} €</p>
              <p class="text-gray-700 mb-4">Quantité : ${annonce.quantite}</p>
              <p class="text-gray-900 font-bold">Total : ${totalAnnonce} €</p>
            </div>
            <div class="flex justify-between items-center mt-4">
              <form method="POST" action="/panier-diminuer/${annonce.id}">
                <button type="submit" class="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Diminuer</button>
              </form>
              <form method="POST" action="/panier-augmenter/${annonce.id}">
                <button type="submit" class="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600">Augmenter</button>
              </form>
              <form method="POST" action="/panier-supprimer/${annonce.id}">
                <button type="submit" class="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">Supprimer</button>
              </form>
            </div>
          </div>
        `;
      });
  
      html += `
        </div>
        <div class="mt-8 text-center">
          <h3 class="text-xl font-semibold">Total Panier : ${totalPanier} €</h3>
        </div>
      `;
    } else {
      html += `
        <p class="text-center text-gray-700 text-lg">Votre panier est vide.</p>
      `;
    }
  
    html += `
        </div>
      </div>
      ${footerView()}
    `;
  
    return html;
  }
  
  module.exports = panierView;
  
