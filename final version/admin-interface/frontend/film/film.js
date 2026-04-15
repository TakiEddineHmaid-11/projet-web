// Elements du DOM
const tableBody = document.getElementById('films-tbody');
const searchInput = document.getElementById('filter-search');
const btnAddFilm = document.getElementById('btn-add-film');

// Modale
const modal = document.getElementById('film-modal');
const form = document.getElementById('film-form');
const btnCancel = document.getElementById('btn-cancel');

// Load films from database
async function loadFilms() {
    try {
        const response = await fetch('../../backend/api/film/film.php');
        const html = await response.text();
        
        if (tableBody) {
            tableBody.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading films:', error);
        alert('Erreur lors du chargement des films');
    }
}

function openModal() {
    if (!modal) return;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    
    // Only reset form if adding new film (not editing)
    const filmId = document.getElementById('film-id').value;
    if (!filmId) {
        if (form) form.reset();
        document.getElementById('modal-title').textContent = 'Nouveau film';
    }
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    if (form) form.reset();
    document.getElementById('film-id').value = '';
    document.getElementById('modal-title').textContent = 'Nouveau film';
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

if (btnAddFilm) {
    btnAddFilm.addEventListener('click', openModal);
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
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        const filmId = document.getElementById('film-id').value;
        
        try {
            let url = '../../backend/api/film/film.php';
            let method = 'POST';
            
            // If editing an existing film
            if (filmId) {
                url += `?id=${filmId}`;
                method = 'PUT';
            }
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.text();
            
            if (result === 'OK') {
                closeModal();
                loadFilms();
                
                if (filmId) {
                    alert('Film modifié avec succès!');
                    document.getElementById('film-id').value = '';
                    document.getElementById('modal-title').textContent = 'Nouveau film';
                } else {
                    alert('Film ajouté avec succès!');
                }
            } else {
                alert('Erreur: ' + result);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Erreur: ' + error.message);
        }
    });
}

async function deleteFilm(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce film?')) return;
    
    try {
        const response = await fetch(`../../backend/api/film/film.php?id=${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.text();
        
        if (result === 'OK') {
            loadFilms();
            alert('Film supprimé avec succès!');
        } else {
            alert('Erreur: ' + result);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur: ' + error.message);
    }
}

function editFilm(id) {
    // Fetch the film data
    fetch(`../../backend/api/film/get-film.php?id=${id}`)
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                alert('Erreur: ' + result.error);
                return;
            }
            
            const film = result.data;
            
            // Populate form with film data (use form field names, not IDs)
            document.getElementById('film-id').value = film.id;
            document.querySelector('[name="title"]').value = film.title;
            document.querySelector('[name="genre"]').value = film.genre;
            document.querySelector('[name="duration_minutes"]').value = film.duration_minutes;
            document.querySelector('[name="classification"]').value = film.classification;
            document.querySelector('[name="poster_url"]').value = film.poster_url || '';
            document.querySelector('[name="synopsis"]').value = film.synopsis || '';
            
            // Update modal title
            document.getElementById('modal-title').textContent = 'Modifier: ' + film.title;
            
            // Show modal
            openModal();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Erreur lors du chargement: ' + error.message);
        });
}

// Load films when page loads
document.addEventListener('DOMContentLoaded', loadFilms);
