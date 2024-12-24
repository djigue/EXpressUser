const headerView = require('../views/headerView');
const footerView = require('../views/footerView');

function showAdminUser (users, flash, role) {
    let html = `${headerView(role)}
                <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
                <script>
                  const flash = {
                  success: "${flash.success || ''}",
                  error: "${flash.error || ''}"
                  };
                </script>
                <script src="/scripts/notif.js"></script><section>
            <h1>Supprimer un utilisateur :</h1>
            <form method="post" action="/supprimer-utilisateur">
                <label for="user-id">ID utilisateur : </label>
                <input type="text" id="user-id" name="id">
                <button type="submit">Supprimer</button>
            </form>
            <ul>`
            users.forEach(user => {
                html += `
                <li>
                <strong>${user.id}</strong> - ${user.username}
            <form id="supp-${user.id}" action="/supprimer-utilisateur/${user.id}" method="POST">
                    <button type="submit">Supprimer</button>
                </form> `
            })
    html +=   `</ul> 
        </section>
        ${footerView()}`;
    return html;
}

module.exports = showAdminUser;