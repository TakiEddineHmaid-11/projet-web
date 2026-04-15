// Confirmation Page JavaScript

class ConfirmationPage {
  constructor() {
    this.booking = null;
    this.init();
  }

  init() {
    this.loadBookingData();
    this.renderConfirmation();
    this.setupEventListeners();
  }

  loadBookingData() {
    const bookingData = localStorage.getItem('booking');

    if (!bookingData) {
      window.location.href = 'index.html';
      return;
    }

    this.booking = JSON.parse(bookingData);
  }

  renderConfirmation() {
    const booking = this.booking;

    // Booking ID
    document.getElementById('bookingId').textContent = booking.bookingId;

    // Movie Details
    document.getElementById('movieName').textContent = booking.movie.title;
    document.getElementById('movieGenre').textContent = booking.movie.genre;
    document.getElementById('movieDuration').textContent = booking.movie.duration;

    // Show Details
    const dateObj = new Date(booking.showtime.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    document.getElementById('showDate').textContent = formattedDate;
    document.getElementById('showTime').textContent = booking.showtime.time;

    // Seats
    const seatsDisplay = document.getElementById('seatsDisplay');
    seatsDisplay.innerHTML = booking.seats
      .map(seat => `<span class="seat-badge">${seat}</span>`)
      .join('');

    // Customer Details
    document.getElementById('customerName').textContent = booking.customer.fullName;
    document.getElementById('customerEmail').textContent = booking.customer.email;
    document.getElementById('customerPhone').textContent = booking.customer.phone;

    // Price Details
    const ticketPrice = 12; // Standard ticket price
    const numSeats = booking.seats.length;
    const subtotal = numSeats * ticketPrice;
    const tax = subtotal * 0.05;
    const total = parseFloat(booking.totalPrice);

    document.getElementById('ticketPrice').textContent = `$${ticketPrice}`;
    document.getElementById('numSeats').textContent = numSeats;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total}`;

    // Page title
    document.title = `Booking Confirmation - CineMax`;
  }

  setupEventListeners() {
    // Copy Booking ID
    document.getElementById('copyBtn').addEventListener('click', () => {
      const bookingId = this.booking.bookingId;
      navigator.clipboard.writeText(bookingId).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      });
    });

    // Download Ticket
    document.getElementById('downloadBtn').addEventListener('click', () => {
      this.downloadTicket();
    });

    // Home Button
    document.getElementById('homeBtn').addEventListener('click', () => {
      this.clearBookingData();
      window.location.href = 'index.html';
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach((btn, index) => {
      btn.addEventListener('click', () => {
        this.shareBooking(index);
      });
    });
  }

  downloadTicket() {
    const booking = this.booking;
    let ticketContent = `
CINEMAX - BOOKING TICKET
========================

Booking ID: ${booking.bookingId}

MOVIE DETAILS
Name: ${booking.movie.title}
Genre: ${booking.movie.genre}
Duration: ${booking.movie.duration}

SHOW DETAILS
Date: ${new Date(booking.showtime.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
Time: ${booking.showtime.time}
Hall: Hall 1

YOUR SEATS
${booking.seats.join(', ')}

CUSTOMER INFORMATION
Name: ${booking.customer.fullName}
Email: ${booking.customer.email}
Phone: ${booking.customer.phone}

PRICE SUMMARY
Total: $${booking.totalPrice}

IMPORTANT NOTES
- Arrive 15 minutes before the show
- Present your booking ID and valid ID at counter
- Cancellation allowed up to 2 hours before show
- A confirmation email has been sent

Thank you for booking with CineMax!
www.cinemax.tn
    `;

    // Create blob and download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(ticketContent));
    element.setAttribute('download', `CineMax_Ticket_${booking.bookingId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // Show feedback
    const btn = document.getElementById('downloadBtn');
    const originalText = btn.textContent;
    btn.textContent = '✓ Downloaded!';
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2000);
  }

  shareBooking(index) {
    const booking = this.booking;
    const shareText = `Check out my booking at CineMax! 🎬\nMovie: ${booking.movie.title}\nDate: ${new Date(booking.showtime.date).toLocaleDateString()}\nTime: ${booking.showtime.time}\nBooking ID: ${booking.bookingId}`;
    const shareUrl = window.location.href;

    switch (index) {
      case 0: // Facebook
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 1: // Twitter
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 2: // WhatsApp
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
        break;
      case 3: // Copy Link
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
    }
  }

  clearBookingData() {
    localStorage.removeItem('selectedMovie');
    localStorage.removeItem('selectedShowtime');
    localStorage.removeItem('booking');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ConfirmationPage();
});
