// Movie Details Page JavaScript

class MovieDetailsPage {
  constructor() {
    this.movie = null;
    this.selectedDate = null;
    this.init();
  }

  init() {
    this.loadMovieData();
    this.setupEventListeners();
  }

  loadMovieData() {
    // Get movie ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = parseInt(urlParams.get('id')) || 1;

    // Find movie in data
    const allMovies = [...moviesData.nowShowing, ...moviesData.comingSoon];
    this.movie = allMovies.find(m => m.id === movieId);

    if (!this.movie) {
      window.location.href = 'index.html';
      return;
    }

    this.renderMovieDetails();
    this.setupDateselector();
    this.displayShowtimes();
  }

  renderMovieDetails() {
    const movie = this.movie;

    // Banner
    const bannerSection = document.getElementById('movieBanner');
    bannerSection.style.backgroundImage = `url('${movie.banner}')`;

    // Poster & title
    document.getElementById('posterImage').src = movie.poster;
    document.getElementById('movieTitle').textContent = movie.title;

    // Meta info
    document.getElementById('movieGenre').textContent = movie.genre;
    document.getElementById('movieDuration').textContent = movie.duration;
    document.getElementById('movieDirector').textContent = movie.director;
    document.getElementById('movieLanguages').textContent = movie.languages.join(', ');

    // Rating
    if (movie.rating) {
      document.getElementById('ratingNumber').textContent = movie.rating;
    } else {
      document.querySelector('.movie-rating-large').innerHTML =
        '<span class="rating-text">Coming Soon</span>';
    }

    // Description & Cast
    document.getElementById('movieDescription').textContent = movie.description;
    document.getElementById('movieCast').textContent = movie.cast;

    // Trailer
    document.getElementById('trailerEmbed').src = movie.trailer;

    // Page title
    document.title = `${movie.title} - CineMax`;
  }

  setupDateselector() {
    const dateSelect = document.getElementById('dateSelect');
    const availableDates = getAvailableDates();

    availableDates.forEach((date, index) => {
      const option = document.createElement('option');
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      option.value = date;
      option.textContent = formattedDate;
      dateSelect.appendChild(option);
    });

    this.selectedDate = availableDates[0];
    dateSelect.addEventListener('change', (e) => {
      this.selectedDate = e.target.value;
      this.displayShowtimes();
    });
  }

  displayShowtimes() {
    const showTimesGrid = document.getElementById('showTimesGrid');
    showTimesGrid.innerHTML = '';

    if (this.movie.showtimes.length === 0) {
      showTimesGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-secondary);">No showtimes available for this date</p>';
      return;
    }

    this.movie.showtimes.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'showtime-btn available';
      btn.textContent = time;
      btn.addEventListener('click', () => {
        this.selectShowtime(time);
      });
      showTimesGrid.appendChild(btn);
    });
  }

  selectShowtime(time) {
    localStorage.setItem('selectedMovie', JSON.stringify(this.movie));
    localStorage.setItem('selectedShowtime', JSON.stringify({
      date: this.selectedDate,
      time: time
    }));
    window.location.href = 'booking.html';
  }

  setupEventListeners() {
    document.getElementById('bookTicketsBtn').addEventListener('click', () => {
      const showTimesGrid = document.getElementById('showTimesGrid');
      showTimesGrid.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('shareBtn').addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: this.movie.title,
          text: `Check out ${this.movie.title} on CineMax!`,
          url: window.location.href
        });
      } else {
        alert('Share: ' + window.location.href);
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MovieDetailsPage();
});
