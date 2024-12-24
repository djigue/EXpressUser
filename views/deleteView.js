const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function deleteView(flash = {}, role) {
    return `${headerView(role)}
    <div id="notifications" style="position: fixed; top: 10px; right: 10px; z-index: 1000; max-width: 300px;"></div>
       <script>
        const flash = {
            success: "${flash.success || ''}",
            error: "${flash.error || ''}"
        };
       </script>;
       <script src="/scripts/notif.js"></script>
            <h1>Supprimer</h1>
            <form method="post" action="/delete">
                <label for="id">ID : </label>
                <input type="text" id="id" name="id">
                <br>
                <button type="submit">Supprimer</button>
            </form>
            ${footerView()}`;
}

module.exports = deleteView;