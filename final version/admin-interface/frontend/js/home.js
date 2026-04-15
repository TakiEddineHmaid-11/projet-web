// Home Page JavaScript

class HomePage {
  constructor() {
    this.currentSlide = 0;
    this.movies = moviesData.nowShowing;
    this.init();
  }

  init() {
    this.setupCarousel();
    this.renderNowShowing();
    this.renderComingSoon();
    this.setupEventListeners();
  }

  setupCarousel() {
    const carouselTrack = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('dots');

    // Create slides
    this.movies.forEach((movie, index) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      slide.style.backgroundImage = `url('${movie.banner}')`;
      carouselTrack.appendChild(slide);

      // Create dot
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => this.goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    this.updateHeroContent(0);

    // Auto-advance carousel
    setInterval(() => {
      this.nextSlide();
    }, 8000);
  }

  updateHeroContent(index) {
    const movie = this.movies[index];
    document.getElementById('heroTitle').textContent = movie.title;
    document.getElementById('heroDescription').textContent = movie.description;

    // Update buttons
    document.getElementById('bookNow').onclick = () => {
      window.location.href = `movie-details.html?id=${movie.id}`;
    };

    document.getElementById('watchTrailer').onclick = () => {
      this.showTrailer(movie.trailer);
    };
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.movies.length;
    this.goToSlide(this.currentSlide);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.movies.length) % this.movies.length;
    this.goToSlide(this.currentSlide);
  }

  goToSlide(index) {
    this.currentSlide = index;
    const carouselTrack = document.getElementById('carouselTrack');
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    this.updateHeroContent(index);
  }

  renderNowShowing() {
    const grid = document.getElementById('nowShowingGrid');
    grid.innerHTML = '';

    moviesData.nowShowing.forEach(movie => {
      const card = this.createMovieCard(movie);
      grid.appendChild(card);
    });
  }

  renderComingSoon() {
    const grid = document.getElementById('comingSoonGrid');
    grid.innerHTML = '';

    moviesData.comingSoon.forEach(movie => {
      const card = this.createMovieCard(movie, true);
      grid.appendChild(card);
    });
  }

  createMovieCard(movie, isComingSoon = false) {
    const card = document.createElement('div');
    card.className = 'movie-card fade-in';
    card.style.animationDelay = `${Math.random() * 0.3}s`;

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

  showTrailer(trailerUrl) {
    const modal = document.getElementById('trailerModal');
    const trailerVideo = document.getElementById('trailerVideo');
    trailerVideo.src = trailerUrl;
    modal.classList.add('active');

    const closeBtn = document.getElementById('closeModal');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      trailerVideo.src = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        trailerVideo.src = '';
      }
    });
  }

  setupEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', () => this.prevSlide());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());

    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing with ${email}!`);
        newsletterForm.reset();
      });
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new HomePage();
});
