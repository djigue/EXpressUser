const headerView = require ('../views/headerView');
const footerView = require ('../views/footerView');

function depotView(flash = {}, role) {
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
        <div class="min-h-screen bg-zinc-200 py-10 flex justify-center items-center">
            <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
                <h1 class="text-2xl font-bold mb-6">Déposer une annonce</h1>
                <form action="/depot" method="POST" enctype="multipart/form-data" class="space-y-6">
                    <!-- Section images -->
                    <fieldset class="border border-gray-300 rounded-md p-4">
                        <legend class="text-lg font-semibold">1- Les images</legend>
                        <div class="mt-4">
                            <label for="imagesUser" class="block text-sm font-medium text-gray-700">
                                Choisir une image (vous pouvez en sélectionner 3 maximum) :
                            </label>
                            <input 
                                type="file" 
                                id="imagesUser" 
                                name="imagesUser" 
                                accept="image/*" 
                                multiple 
                                class="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </fieldset>
                    
                    <!-- Section annonce -->
                    <fieldset class="border border-gray-300 rounded-md p-4">
                        <legend class="text-lg font-semibold">2- L'annonce</legend>
                        <div class="mt-4 space-y-4">
                            <div>
                                <label for="categorie" class="block text-sm font-medium text-gray-700">Catégorie :</label>
                                <select 
                                    id="categorie" 
                                    name="categorie" 
                                    class="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option></option>
                                    <option value="immobilier">Immobilier</option>
                                    <option value="maison">Maison et Jardin</option>
                                    <option value="vehicule">Véhicules</option>
                                    <option value="vetements">Vêtements</option>
                                    <option value="elec">Électronique</option>
                                    <option value="loisirs">Loisirs</option>
                                    <option value="autres">Autres</option>
                                </select>
                            </div>
                            <div>
                                <label for="titre" class="block text-sm font-medium text-gray-700">Titre :</label>
                                <input 
                                    type="text" 
                                    id="titre" 
                                    name="titre" 
                                    class="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            </div>
                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700">Description :</label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    rows="10" 
                                    placeholder="Décrivez votre produit" 
                                    class="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                            </div>
                            <div>
                                <label for="prix" class="block text-sm font-medium text-gray-700">Prix :</label>
                                <input 
                                    type="number" 
                                    name="prix" 
                                    id="prix" 
                                    min="0" 
                                    step="0.01" 
                                    class="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                            </div>
                        </div>
                    </fieldset>
                    
                    <!-- Bouton de soumission -->
                    <div class="flex justify-end">
                        <button 
                            type="submit" 
                            class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 shadow">
                            Publier
                        </button>
                    </div>
                </form>
            </div>
        </div>
        ${footerView()}`;

    return html;
}

module.exports = depotView;



module.exports = depotView;