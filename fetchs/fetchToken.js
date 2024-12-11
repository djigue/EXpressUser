function getCookie(token) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${token}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

if (token) {
    fetch('/user', {
        method: 'GET',  
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,  
        },
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
} else {
    console.log('Token non trouvé dans les cookies');
}
