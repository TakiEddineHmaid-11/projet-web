// Booking Page JavaScript

class BookingPage {
  constructor() {
    this.movie = null;
    this.showtime = null;
    this.selectedSeats = [];
    this.ticketPrice = ticketPrices.standard;
    this.hall = cinemaHalls[0];
    this.init();
  }

  init() {
    this.loadBookingData();
    this.renderSeats();
    this.setupEventListeners();
    this.updateSummary();
  }

  loadBookingData() {
    const movieData = localStorage.getItem('selectedMovie');
    const showtimeData = localStorage.getItem('selectedShowtime');

    if (!movieData || !showtimeData) {
      window.location.href = 'index.html';
      return;
    }

    this.movie = JSON.parse(movieData);
    this.showtime = JSON.parse(showtimeData);

    // Update page content
    document.getElementById('movieTitle').textContent = this.movie.title;
    document.getElementById('summaryMovieTitle').textContent = this.movie.title;

    const dateObj = new Date(this.showtime.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    const dateTimeStr = `${formattedDate} at ${this.showtime.time}`;
    document.getElementById('summaryDateTime').textContent = dateTimeStr;

    document.getElementById('hallName').textContent = this.hall.name;
  }

  renderSeats() {
    const seatsContainer = document.getElementById('seatsContainer');
    seatsContainer.innerHTML = '';

    // Simulate some reserved seats
    const reservedSeats = new Set([2, 5, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38]);

    for (let row = 0; row < this.hall.rows; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seat-row';

      for (let col = 0; col < this.hall.cols; col++) {
        const seatButton = document.createElement('button');
        const seatNumber = row * this.hall.cols + col;
        const seatLabel = String.fromCharCode(65 + row) + (col + 1);

        seatButton.type = 'button';
        seatButton.className = 'seat available';
        seatButton.textContent = seatLabel.charAt(0);
        seatButton.dataset.seat = seatLabel;
        seatButton.dataset.seatNumber = seatNumber;

        if (reservedSeats.has(seatNumber)) {
          seatButton.classList.remove('available');
          seatButton.classList.add('reserved');
          seatButton.disabled = true;
        } else {
          seatButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSeat(seatButton, seatLabel);
          });
        }

        rowDiv.appendChild(seatButton);
      }

      seatsContainer.appendChild(rowDiv);
    }
  }

  toggleSeat(seatButton, seatLabel) {
    if (seatButton.classList.contains('selected')) {
      seatButton.classList.remove('selected');
      this.selectedSeats = this.selectedSeats.filter(s => s !== seatLabel);
    } else {
      seatButton.classList.add('selected');
      this.selectedSeats.push(seatLabel);
    }

    this.updateSummary();
  }

  updateSummary() {
    const numSeats = this.selectedSeats.length;
    const subtotal = numSeats * this.ticketPrice;
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    // Update selected seats list
    const selectedSeatsDiv = document.getElementById('selectedSeats');
    if (numSeats === 0) {
      selectedSeatsDiv.innerHTML = '<p class="text-secondary">No seats selected</p>';
    } else {
      selectedSeatsDiv.innerHTML = this.selectedSeats
        .map(seat => `<span class="seat-badge">${seat}</span>`)
        .join('');
    }

    // Update prices
    document.getElementById('seatPrice').textContent = `$${this.ticketPrice}`;
    document.getElementById('numSeats').textContent = numSeats;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalPrice').textContent = `$${total.toFixed(2)}`;

    // Enable/disable continue button
    const continueBtn = document.getElementById('continueBtn');
    continueBtn.disabled = numSeats === 0;
  }

  setupEventListeners() {
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitBooking();
    });

    const continueBtn = document.getElementById('continueBtn');
    continueBtn.addEventListener('click', () => {
      document.querySelector('.booking-form-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

  submitBooking() {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    // Get form data
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.getElementById('paymentMethod').value;

    // Validate
    if (!fullName || !email || !phone || !paymentMethod) {
      alert('Please fill in all required fields');
      return;
    }

    // Create booking object
    const booking = {
      bookingId: 'BK' + Math.floor(Math.random() * 1000000),
      movie: this.movie,
      showtime: this.showtime,
      seats: this.selectedSeats,
      customer: {
        fullName,
        email,
        phone
      },
      paymentMethod,
      bookingDate: new Date().toISOString(),
      totalPrice: this.calculateTotal()
    };

    // Store booking data
    localStorage.setItem('booking', JSON.stringify(booking));

    // Redirect to confirmation
    window.location.href = 'confirmation.html';
  }

  calculateTotal() {
    const subtotal = this.selectedSeats.length * this.ticketPrice;
    const tax = subtotal * 0.05;
    return (subtotal + tax).toFixed(2);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BookingPage();
});
