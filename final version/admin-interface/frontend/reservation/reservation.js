const tableBody = document.getElementById('reservations-tbody');
const searchInput = document.getElementById('filter-search');
const btnAddReservation = document.getElementById('btn-add-reservation');
const filmSelect = document.getElementById('film-input');

const modal = document.getElementById('reservation-modal');
const form = document.getElementById('reservation-form');
const btnCancel = document.getElementById('btn-cancel');

// Load reservations from database
async function loadReservations() {
    try {
        const response = await fetch('../../../backend/display_reservations.php');
        const html = await response.text();
        
        if (tableBody) {
            tableBody.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:red;">Erreur lors du chargement des réservations</td></tr>';
        }
    }
}

// Load films from database
async function loadFilmsList() {
    try {
        const response = await fetch('../../../backend/api/film/get-films.php');
        const result = await response.json();
        const films = result.data || [];
        
        if (filmSelect) {
            // Clear existing options except the first placeholder
            filmSelect.innerHTML = '<option value="">Sélectionner un film</option>';
            
            // Add film options
            films.forEach(film => {
                const option = document.createElement('option');
                option.value = film.id;
                option.textContent = film.title;
                filmSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading films:', error);
    }
}

function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    if (form) form.reset();
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (form) form.reset();
}

function filterTable() {
    if (!tableBody || !searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = query === '' || text.includes(query) ? '' : 'none';
    });
}

function editReservation(id) {
    alert('La fonction modifier sera implémentée prochainement');
}

function deleteReservation(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) return;
    
    try {
        fetch(`../../../backend/api/reservation/reservation.php?id=${id}`, {
            method: 'DELETE'
        }).then(response => {
            loadReservations();
            alert('Réservation supprimée avec succès!');
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    }
}

if (btnAddReservation) {
    btnAddReservation.addEventListener('click', openModal);
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
    searchInput.addEventListener('input', filterTable);
}

if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        closeModal();
    });
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadReservations();
    loadFilmsList();
});
