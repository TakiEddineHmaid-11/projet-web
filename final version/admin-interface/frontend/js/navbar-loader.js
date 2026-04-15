// Navbar and footer loader
function loadNavbarFooter() {
  return fetch('components/navbar.html')
    .then(response => response.text())
    .then(html => {
      // Split navbar and footer - navbar ends with closing </nav> tag
      const navbarEnd = html.indexOf('</nav>') + '</nav>'.length;
      const navbarHTML = html.substring(0, navbarEnd);
      const footerHTML = html.substring(navbarEnd);

      const navbarContainer = document.getElementById('navbar-container');
      const footerContainer = document.getElementById('footer-container');

      // Load navbar
      if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
        initializeNavbar();
      }
      
      // Load footer
      if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
      }
    })
    .catch(error => console.error('Error loading navbar/footer:', error));
}

// Initialize navbar functionality
function initializeNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Search functionality
  function performSearch() {
    if (searchInput && searchInput.value.trim()) {
      const query = searchInput.value;
      window.location.href = `movies.html?search=${encodeURIComponent(query)}`;
    }
  }
  
  if (searchInput) {
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch();
      }
    });
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Load when DOM is ready
document.addEventListener('DOMContentLoaded', loadNavbarFooter);
