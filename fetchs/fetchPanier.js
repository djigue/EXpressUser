function getCookie(id) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + id + '=');
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

document.querySelectorAll('form[id^="panier-"]').forEach(form => {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(this);
        const user_id = getCookie('id');
        const produit_id = formData.get('produit_id');
        const quantite = parseInt(formData.get('quantite'));

        if (!user_id) {
            alert("Utilisateur non connecté. Veuillez vous connecter.");
            window.location.href = '/login';
            return;
        }

        if (quantite <= 0 || isNaN(quantite)) {
            alert('Veuillez entrer une quantité valide.');
            return;
        }

        fetch('/panier', {
            method: 'POST',
            body: JSON.stringify({ user_id, produit_id, quantite }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => {
            console.log("Statut de la réponse :", response.status);
            console.log("Type de contenu :", response.headers.get('Content-Type'));
            return response.text();
        })
        .then(text => {
            console.log("Réponse brute :", text);
            return JSON.parse(text); 
        })
        .then(data => {
            console.log("Données reçues :", data);
            if (data.success) {
                alert('Produit ajouté au panier avec succès !');
            } else {
                alert(data.message || 'Une erreur est survenue.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout au panier.');
        });
    });
});
