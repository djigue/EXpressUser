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
        const annonce_id = formData.get('annonce_id');
        const titre = formData.get('titre');
        const description = formData.get('description');
        const prix = parseInt(formData.get('prix'));
        
        if (!user_id) {
            alert("Utilisateur non connecté. Veuillez vous connecter.");
            window.location.href = '/login';é
            return;
        }

        if (!titre) {
            alert('Veuillez renseigner un titre.');
            return;
        }

        if (!description) {
            alert('Veuillez renseigner une déscription.');
            return;
        }

        if (!prix) {
            alert('Veuillez renseigner un prix.');
            return;
        }

        fetch('/depot', {
            method: 'POST',
            body: JSON.stringify({ user_id, annonce_id, titre, description, prix }),
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
                alert('Annonce ajoutée avec succès !');
            } else {
                alert(data.message || 'Une erreur est survenue.');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'ajout de l\'annonce.');
        });
    });
});
