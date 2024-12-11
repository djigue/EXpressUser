const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function panierView(rows) {
    
        let html = `${headerView()}
            
                    <h1>Votre Panier</h1>
                    <ul>`;
       
        if (rows.length === 0) {
            html += `<p>Aucun produit trouvé.</p>`;
        } else {
            rows.forEach(produit => {
                html += `<li>${produit.nom} - ${produit.prix} € x ${produit.quantite}</li>`;
            });

            html += `
                    </ul>
                    ${footerView()}`;
        
        console.log("HTML généré :", html);
        console.log("Envoi de la réponse HTML...");
        return html; 
        }
    }

module.exports = panierView;
