const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function panierView(rows, totalPanier, flash) {
    
        let html = `${headerView()}
         <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>`;
   html += `<script src="/scripts/notif.js"></script>
            
                    <h1>Votre Panier</h1>
                    <ul>`;
        if (rows.length === 0) {
            html += `<p>Aucun produit trouvé.</p>`;
        } else {
            rows.forEach(annonce => {
                console.log(annonce); 
                console.log(`id annonce : ${annonce.id}`)
                let totalAnnonce = annonce.prix * annonce.quantite;
                html += `<li>${annonce.titre} - Prix : ${annonce.prix} € - Quantité : ${annonce.quantite} - Total = ${totalAnnonce}</li>
                       <form method="POST" action="/panier-diminuer/${annonce.id}" style="display:inline;">
                       <button type="submit">Diminuer</button>
                        </form>
                        <form method="POST" action="/panier-augmenter/${annonce.id}" style="display:inline;">
                       <button type="submit">Augmenter</button>
                        </form>
                        <form method="POST" action="/panier-supprimer/${annonce.id}" style="display:inline;">
                            <button type="submit">Supprimer</button>
                        </form>`;
            });

            html += `
                    </ul>
                    <h3>Total Panier : ${totalPanier} €</h3>
                    ${footerView()}`;

        return html; 
        }
    }

module.exports = panierView;
