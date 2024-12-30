const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function AnnonceVoirView(annonce, images, flash = {}, role, nextAnnonceId, prevAnnonceId) {
    let html = `${headerView(role)}
                <h1>Liste des annonces</h1>
                <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
    </script>
    <script src="/scripts/notif.js"></script>
    <section>
    <h1>${annonce.titre}</h1>
    <div>
     ${images.length > 0
                    ? images.map((image) => `
                        <div class="image-container">
                            <img src="/images/${image.url}" alt="Image ${image.id}" width="100">
                             <input type="hidden" name="existImages[]" value="${image.id}">
                        </div>
                    `).join('')
                    : '<p>Aucune image associée à cette annonce.</p>'
                }
    </div> 
    <div>
     ${annonce.description}
    </div> 
    <div>
    <strong>${annonce.prix} €</strong>
    </div>
    </section>
    <div>
    <form id="panier-${annonce.id}" action="/panier" method="POST">
        <input type="hidden" name="annonces_id" value="${annonce.id}" />
        <label>Quantité :</label>
        <input type="number" name="quantite" value="1" min="1" />
        <button type="submit">Ajouter au panier</button>
    </form>
    </div>
    <div>
     <a href="/annonce"><button>Retour</button></a>
    </div>
    <div>
        ${prevAnnonceId ? `
            <a href="/annonce-voir/${prevAnnonceId}?prev=1">
                <button>Annonce précédente</button>
            </a>` : `
            <p>Il n'y a pas d'autre annonce.</p>
        `}
    </div>
    <div>
        ${nextAnnonceId ? `
            <a href="/annonce-voir/${nextAnnonceId}?next=1">
                <button>Annonce suivante</button>
            </a>` : `
            <p>Il n'y a pas d'autre annonce.</p>
        `}
    </div>
    ${footerView()}`
    
    return html;
}

module.exports = AnnonceVoirView;