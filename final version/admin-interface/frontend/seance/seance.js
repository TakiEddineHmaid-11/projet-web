// Éléments du DOM
const tableBody = document.getElementById('seances-tbody');
const searchInput = document.getElementById('filter-search');
const statusFilter = document.getElementById('filter-statut');
const dateFilter = document.getElementById('filter-date');
const btnAddSeance = document.getElementById('btn-add-seance');
const modal = document.getElementById('seance-modal');
const form = document.getElementById('seance-form');
const btnCancel = document.getElementById('btn-cancel');

const filmSelect = document.getElementById('film-select');
const salleSelect = document.getElementById('salle-select');

// État global
let seancesData = [];

/**
 * Charge les données des selects (films et salles)
 */
async function loadSelectData() {
    try {
        const response = await fetch('../../backend/api/seance/seances.php?action=select-data');
        const data = await response.json();

        if (data.films && data.salles) {
            // Remplir le select des films
            if (filmSelect) {
                const filmOptions = data.films.map(film => 
                    `<option value="${film.id}">${film.nom}</option>`
                ).join('');
                filmSelect.innerHTML = '<option value="">Sélectionner un film...</option>' + filmOptions;
            }

            // Remplir le select des salles
            if (salleSelect) {
                const salleOptions = data.salles.map(salle => 
                    `<option value="${salle.id}">${salle.nom}</option>`
                ).join('');
                salleSelect.innerHTML = '<option value="">Sélectionner une salle...</option>' + salleOptions;
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

/**
 * Charge les séances depuis l'API backend
 */
async function loadSeances() {
    try {
        const response = await fetch('../../backend/api/seance/seances.php');
        const data = await response.json();

        if (data.seances) {
            seancesData = data.seances;
            renderSeances(seancesData);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des séances:', error);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:red; padding:20px;">Erreur lors du chargement des séances</td></tr>';
        }
    }
}

/**
 * Rend les séances dans le tableau
 */
function renderSeances(seances) {
    if (!tableBody) return;

    if (seances.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding:40px;">Aucune séance trouvée</td></tr>';
        return;
    }

    tableBody.innerHTML = seances.map(seance => {
        const statutClass = seance.status.toLowerCase() === 'disponible' ? 'badge-disponible' : 
                           seance.status.toLowerCase() === 'complet' ? 'badge-complet' : 'badge-annule';
        
        return `
            <tr>
                <td><strong>${seance.film_nom}</strong></td>
                <td>${seance.salle_nom}</td>
                <td>${seance.date}</td>
                <td>${seance.heure}</td>
                <td>${seance.available_seats}/${seance.total_seats}</td>
                <td>${seance.base_price} TND</td>
                <td><span class="badge ${statutClass}">${seance.status}</span></td>
                <td>
                    <div class="actions">
                        <button class="btn btn-sm" onclick="editSeance(${seance.id})">Modifier</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSeance(${seance.id})">Supprimer</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Ouvre la modale d'ajout/édition
 */
function openModal(isEdit = false, seanceId = null) {
    if (!modal) return;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    if (isEdit && seanceId) {
        // Mode édition
        const seance = seancesData.find(s => s.id === seanceId);
        if (seance) {
            document.getElementById('modal-title').textContent = 'Modifier séance';
            document.getElementById('seance-id').value = seance.id;
            
            // Remplir le formulaire
            if (filmSelect) filmSelect.value = seance.film_id;
            if (salleSelect) salleSelect.value = seance.room_id;
            
            // Séparer date et heure
            const [date, time] = seance.start_time.split(' ');
            if (document.getElementById('date-input')) {
                document.getElementById('date-input').value = date;
            }
            if (document.getElementById('heure-input')) {
                document.getElementById('heure-input').value = time.substring(0, 5);
            }
            
            if (document.getElementById('prix-input')) {
                document.getElementById('prix-input').value = seance.base_price;
            }
        }
    } else {
        // Mode ajout
        document.getElementById('modal-title').textContent = 'Nouvelle séance';
        document.getElementById('seance-id').value = '';
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
    document.getElementById('seance-id').value = '';
    removeErrorMessage();
}

/**
 * Édite une séance
 */
function editSeance(seanceId) {
    openModal(true, seanceId);
}

/**
 * Supprime une séance
 */
async function deleteSeance(seanceId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
        return;
    }

    try {
        const response = await fetch(`../../backend/api/seance/seances.php?id=${seanceId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            seancesData = seancesData.filter(s => s.id !== seanceId);
            renderSeances(seancesData);
        } else {
            alert(data.error || 'Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la séance');
    }
}

/**
 * Filtre les séances selon les critères de recherche
 */
function filterSeances() {
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const statusQuery = statusFilter ? statusFilter.value : '';
    const dateQuery = dateFilter ? dateFilter.value : '';

    const filtered = seancesData.filter(seance => {
        const matchSearch = searchQuery === '' || 
                           seance.film_nom.toLowerCase().includes(searchQuery) ||
                           seance.salle_nom.toLowerCase().includes(searchQuery);
        
        const matchStatus = statusQuery === '' || seance.status === statusQuery;
        const matchDate = dateQuery === '' || seance.date.replace(/\//g, '-').includes(dateQuery);

        return matchSearch && matchStatus && matchDate;
    });

    renderSeances(filtered);
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
        modalContent.insertBefore(errorDiv, modalContent.firstChild);
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
if (btnAddSeance) {
    btnAddSeance.addEventListener('click', () => openModal(false));
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
    searchInput.addEventListener('input', filterSeances);
}

if (statusFilter) {
    statusFilter.addEventListener('change', filterSeances);
}

if (dateFilter) {
    dateFilter.addEventListener('change', filterSeances);
}

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const seanceId = document.getElementById('seance-id').value;
        const filmId = parseInt(filmSelect?.value || 0);
        const salleId = parseInt(salleSelect?.value || 0);
        const dateInput = document.getElementById('date-input')?.value;
        const heureInput = document.getElementById('heure-input')?.value;
        const prixInput = parseFloat(document.getElementById('prix-input')?.value || 0);

        // Validation côté client
        if (!filmId) {
            showError('Veuillez sélectionner un film');
            return;
        }

        if (!salleId) {
            showError('Veuillez sélectionner une salle');
            return;
        }

        if (!dateInput || !heureInput) {
            showError('Veuillez entrer une date et une heure');
            return;
        }

        if (prixInput < 0) {
            showError('Le prix ne peut pas être négatif');
            return;
        }

        // Formater la date et l'heure
        const startTime = `${dateInput} ${heureInput}:00`;

        const payload = {
            film_id: filmId,
            room_id: salleId,
            start_time: startTime,
            base_price: prixInput
        };

        try {
            const url = seanceId
                ? `../../backend/api/seance/seances.php?id=${seanceId}`
                : '../../backend/api/seance/seances.php';

            const method = seanceId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                // Recharger les séances
                await loadSeances();
                closeModal();
            } else if (result.error) {
                showError(result.error);
            } else {
                showError('Une erreur est survenue');
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

// Charger les données au démarrage
document.addEventListener('DOMContentLoaded', async () => {
    await loadSelectData();
    await loadSeances();
});
