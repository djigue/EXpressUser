function panierView(rows) {
    
        let html = `
            <html>
                <head><title>Mon Panier</title></head>
                <body>
                    <h1>Votre Panier</h1>
                    <ul>
        `;
       
            rows.forEach(produit => {
                html += `<li>${produit.nom} - ${produit.prix} € x ${produit.quantite}</li>`;
            });

            if (rows.length === 0) {
                html += `<p>Aucun produit trouvé.</p>`;
            } 

        html += `
                    </ul>
                </body>
            </html>
        `;
        
        console.log("HTML généré :", html);
        console.log("Envoi de la réponse HTML...");
        return html; 
        
}

module.exports = panierView;
