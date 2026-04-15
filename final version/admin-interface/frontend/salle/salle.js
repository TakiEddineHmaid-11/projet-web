// Éléments du DOM
const tableBody = document.getElementById('salles-tbody');
const searchInput = document.getElementById('filter-search');
const btnAddSalle = document.getElementById('btn-add-salle');
const modal = document.getElementById('salle-modal');
const form = document.getElementById('salle-form');
const btnCancel = document.getElementById('btn-cancel');

// État global
let sallesData = [];

/**
 * Charge les salles depuis l'API backend
 */
async function loadSalles() {
    try {
        const response = await fetch('../../backend/api/salle/salles.php');
        const data = await response.json();

        if (data.salles) {
            sallesData = data.salles;
            renderSalles(sallesData);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des salles:', error);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:red;">Erreur lors du chargement des salles</td></tr>';
        }
    }
}

/**
 * Rend les salles dans le tableau
 */function renderSalles(salles) {
    if (!tableBody) return;

    if (salles.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" style="text-align:center; padding: 40px; color: var(--text-muted);">Aucune salle trouvée</td></tr>';
        return;
    }

    tableBody.innerHTML = salles.map(salle => {
        return `
            <tr>
                <td><strong>${salle.nom}</strong></td>
                <td>${salle.capacite} places</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm" onclick="editSalle(${salle.id})">Modifier</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSalle(${salle.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Ouvre la modale d'ajout/édition
 */
function openModal(isEdit = false, salleId = null) {
    if (!modal) return;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    if (isEdit && salleId) {
        // Mode édition
        const salle = sallesData.find(s => s.id === salleId);
        if (salle) {
            document.getElementById('modal-title').textContent = 'Modifier : ' + salle.nom;
            document.getElementById('salle-id').value = salle.id;
            document.getElementById('nom').value = salle.nom;
            document.getElementById('capacite').value = salle.capacite;
        }
    } else {
        // Mode ajout
        document.getElementById('modal-title').textContent = 'Nouvelle salle';
        document.getElementById('salle-id').value = '';
        if (form) form.reset();
    }
}

/**
 * Ferme la modale
 */
function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (form) form.reset();
    document.getElementById('salle-id').value = '';
    removeErrorMessage();
}

/**
 * Édite une salle
 */
function editSalle(salleId) {
    openModal(true, salleId);
}

/**
 * Supprime une salle
 */
async function deleteSalle(salleId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
        return;
    }

    try {
        const response = await fetch(`../../backend/api/salle/salles.php?id=${salleId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            sallesData = sallesData.filter(s => s.id !== salleId);
            renderSalles(sallesData);
        } else {
            alert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la salle');
    }
}

/**
 * Filtre les salles selon la recherche
 */
function filterSalles() {
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    const filtered = sallesData.filter(salle =>
        salle.nom.toLowerCase().includes(query)
    );

    renderSalles(filtered);
}

/**
 * Affiche un message d'erreur dans la modale
 */
function showError(message) {
    removeErrorMessage();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.insertBefore(errorDiv, modalContent.querySelector('form'));
    }
}

/**
 * Supprime le message d'erreur
 */
function removeErrorMessage() {
    const errorDiv = document.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Écouteurs d'événements
if (btnAddSalle) {
    btnAddSalle.addEventListener('click', () => openModal(false));
}

if (btnCancel) {
    btnCancel.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', filterSalles);
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const salleId = document.getElementById('salle-id').value;
        const nom = document.getElementById('nom').value.trim();
        const capacite = parseInt(document.getElementById('capacite').value);

        if (!nom || nom.length < 2) {
            showError('Le nom doit contenir au moins 2 caractères');
            return;
        }

        if (!capacite || capacite < 1 || capacite > 500) {
            showError('La capacité doit être entre 1 et 500 places');
            return;
        }

        const payload = {
            nom: nom,
            capacite: capacite
        };

        try {
            const url = salleId
                ? `../../backend/api/salle/salles.php?id=${salleId}`
                : '../../backend/api/salle/salles.php';

            const method = salleId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                await loadSalles();
                closeModal();
            } else if (result.error) {
                showError(result.error);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            showError('Erreur lors de l\'envoi du formulaire');
        }
    });
}

// Clavier - Échap pour fermer la modale
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('show')) {
        closeModal();
    }
});

// Charger les salles au démarrage
document.addEventListener('DOMContentLoaded', loadSalles);
