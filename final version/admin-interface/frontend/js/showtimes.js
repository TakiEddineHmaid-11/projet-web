// Showtimes Page JavaScript

class ShowtimesPage {
  constructor() {
    this.selectedDate = null;
    this.movies = moviesData.nowShowing;
    this.init();
  }

  init() {
    this.setupDates();
    this.displayShowtimes();
  }

  setupDates() {
    const dateButtonsContainer = document.getElementById('dateButtons');
    const availableDates = getAvailableDates();

    availableDates.slice(0, 14).forEach((date, index) => {
      const dateObj = new Date(date);
      const button = document.createElement('button');
      button.className = `date-button ${index === 0 ? 'active' : ''}`;
      button.textContent = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      button.addEventListener('click', () => {
        this.selectDate(date, button);
      });
      dateButtonsContainer.appendChild(button);
    });

    this.selectedDate = availableDates[0];
  }

  selectDate(date, button) {
    // Remove active class from all buttons
    document.querySelectorAll('.date-button').forEach(btn => {
      btn.classList.remove('active');
    });

    // Add active class to selected button
    button.classList.add('active');
    this.selectedDate = date;
    this.displayShowtimes();
  }

  displayShowtimes() {
    const container = document.getElementById('showTimesContainer');
    const noShowtimes = document.getElementById('noShowtimes');
    container.innerHTML = '';

    if (this.movies.length === 0) {
      container.style.display = 'none';
      noShowtimes.style.display = 'block';
      return;
    }

    container.style.display = 'block';
    noShowtimes.style.display = 'none';

    this.movies.forEach(movie => {
      const movieShowtime = this.createMovieShowtime(movie);
      container.appendChild(movieShowtime);
    });
  }

  createMovieShowtime(movie) {
    const movieDiv = document.createElement('div');
    movieDiv.className = 'movie-showtimes fade-in';

    // Create movie header with poster
    const headerDiv = document.createElement('div');
    headerDiv.className = 'movie-header';
    headerDiv.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" class="movie-poster-small">
      <div class="movie-header-info">
        <h3>${movie.title}</h3>
        <div class="movie-header-meta">
          <span class="meta-badge">🎭 ${movie.genre}</span>
          <span class="meta-badge">⏱️ ${movie.duration}</span>
          ${movie.rating ? `<span class="meta-badge">⭐ ${movie.rating}/10</span>` : ''}
        </div>
      </div>
    `;

    // Create showtimes grid
    const timesDiv = document.createElement('div');
    timesDiv.className = 'showtimes-grid';

    movie.showtimes.forEach(time => {
      const timeCard = document.createElement('div');
      const availableSeats = Math.floor(Math.random() * 80) + 20;
      const isBooked = availableSeats < 10;

      timeCard.className = `showtime-card ${isBooked ? 'booked' : ''}`;
      timeCard.innerHTML = `
        <div class="showtime-time">${time}</div>
        <div class="showtime-capacity">${availableSeats} seats</div>
        <div class="showtime-available">${isBooked ? 'Almost Full' : 'Available'}</div>
      `;

      if (!isBooked) {
        timeCard.addEventListener('click', () => {
          this.selectShowtime(movie.id, time);
        });
      }

      timesDiv.appendChild(timeCard);
    });

    movieDiv.appendChild(headerDiv);
    movieDiv.appendChild(timesDiv);

    return movieDiv;
  }

  selectShowtime(movieId, time) {
    // Find the movie
    const movie = this.movies.find(m => m.id === movieId);

    // Store selected data
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
    localStorage.setItem('selectedShowtime', JSON.stringify({
      date: this.selectedDate,
      time: time
    }));

    // Redirect to booking page
    window.location.href = 'booking.html';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ShowtimesPage();
});
