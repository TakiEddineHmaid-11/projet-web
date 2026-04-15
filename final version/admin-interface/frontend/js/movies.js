// Movies Page JavaScript

class MoviesPage {
  constructor() {
    this.allMovies = [];
    this.filteredMovies = [];
    this.filters = {
      genre: '',
      status: '',
      rating: ''
    };
    this.init();
  }

  init() {
    this.loadMovies();
    this.setupEventListeners();
    this.renderMovies();
    this.handleSearch();
  }

  loadMovies() {
    this.allMovies = [...moviesData.nowShowing, ...moviesData.comingSoon];
    this.filteredMovies = this.allMovies;
  }

  setupEventListeners() {
    document.getElementById('genreFilter').addEventListener('change', (e) => {
      this.filters.genre = e.target.value;
      this.applyFilters();
    });

    document.getElementById('statusFilter').addEventListener('change', (e) => {
      this.filters.status = e.target.value;
      this.applyFilters();
    });

    document.getElementById('ratingFilter').addEventListener('change', (e) => {
      this.filters.rating = e.target.value;
      this.applyFilters();
    });

    document.getElementById('resetFilters').addEventListener('click', () => {
      this.resetFilters();
    });

    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
      this.resetFilters();
    });
  }

  applyFilters() {
    this.filteredMovies = this.allMovies.filter(movie => {
      // Genre filter
      if (this.filters.genre && !movie.genre.includes(this.filters.genre)) {
        return false;
      }

      // Status filter
      if (this.filters.status) {
        const isNowShowing = moviesData.nowShowing.some(m => m.id === movie.id);
        if (this.filters.status === 'now' && !isNowShowing) return false;
        if (this.filters.status === 'coming' && isNowShowing) return false;
      }

      // Rating filter
      if (this.filters.rating) {
        if (!movie.rating || movie.rating < parseFloat(this.filters.rating)) {
          return false;
        }
      }

      return true;
    });

    this.renderMovies();
  }

  resetFilters() {
    this.filters = {
      genre: '',
      status: '',
      rating: ''
    };

    document.getElementById('genreFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('ratingFilter').value = '';

    this.filteredMovies = this.allMovies;
    this.renderMovies();
  }

  renderMovies() {
    const grid = document.getElementById('moviesGrid');
    const noResults = document.getElementById('noResults');
    const resultCount = document.getElementById('resultCount');

    if (this.filteredMovies.length === 0) {
      grid.style.display = 'none';
      noResults.style.display = 'block';
      resultCount.textContent = 'No movies found matching your criteria';
      return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';
    resultCount.textContent = `Showing ${this.filteredMovies.length} movie(s)`;

    grid.innerHTML = '';

    this.filteredMovies.forEach(movie => {
      const isComingSoon = moviesData.comingSoon.some(m => m.id === movie.id);
      const card = this.createMovieCard(movie, isComingSoon);
      grid.appendChild(card);
    });
  }

  createMovieCard(movie, isComingSoon = false) {
    const card = document.createElement('div');
    card.className = 'movie-card fade-in';

    const ratingHTML = movie.rating
      ? `
        <div class="movie-rating">
          <span class="rating-stars">★★★★★</span>
          <span class="rating-value">${movie.rating}</span>
        </div>
      `
      : '<div class="movie-rating"><span class="rating-value">Coming Soon</span></div>';

    const buttonHTML = isComingSoon
      ? `<button class="btn btn-secondary btn-small" style="cursor: default;">Coming Soon</button>`
      : `<button class="btn btn-primary btn-small" onclick="window.location.href='movie-details.html?id=${movie.id}'">Book Now</button>`;

    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <div class="movie-meta">
          <span class="movie-genre">${movie.genre}</span>
          <span class="movie-duration">${movie.duration}</span>
        </div>
        ${ratingHTML}
        <div class="movie-card-footer">
          ${buttonHTML}
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (!isComingSoon) {
        window.location.href = `movie-details.html?id=${movie.id}`;
      }
    });

    return card;
  }

  handleSearch() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
      this.filteredMovies = this.allMovies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      this.renderMovies();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MoviesPage();
});
