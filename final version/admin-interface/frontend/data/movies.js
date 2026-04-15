// Movie data for cinema website
const moviesData = {
  nowShowing: [
    {
      id: 1,
      title: "The Quantum Realm",
      genre: "Sci-Fi, Action",
      duration: "148 min",
      rating: 8.5,
      poster: "https://via.placeholder.com/300x450/1a1a2e/00d4ff?text=Quantum+Realm",
      banner: "https://via.placeholder.com/1920x600/0f3460/00d4ff?text=Quantum+Realm+Banner",
      description: "In a dystopian future, a team of scientists must navigate through the quantum realm to prevent a catastrophic event.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-03-15",
      director: "Christopher Nolan",
      cast: "Leonardo DiCaprio, Emma Stone, Tom Hardy",
      languages: ["English", "Arabic"],
      showtimes: ["14:00", "17:30", "20:00", "22:30"]
    },
    {
      id: 2,
      title: "Desert Love",
      genre: "Romance, Drama",
      duration: "132 min",
      rating: 8.2,
      poster: "https://via.placeholder.com/300x450/1a1a2e/ff006e?text=Desert+Love",
      banner: "https://via.placeholder.com/1920x600/0f3460/ff006e?text=Desert+Love+Banner",
      description: "A beautiful love story set against the backdrop of the Sahara Desert during the golden age of trade routes.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-02-20",
      director: "Sofia Coppola",
      cast: "Ryan Gosling, Saoirse Ronan, Javier Bardem",
      languages: ["English", "French", "Arabic"],
      showtimes: ["15:00", "18:00", "21:00"]
    },
    {
      id: 3,
      title: "Code Black",
      genre: "Thriller, Mystery",
      duration: "156 min",
      rating: 8.8,
      poster: "https://via.placeholder.com/300x450/1a1a2e/0096ff?text=Code+Black",
      banner: "https://via.placeholder.com/1920x600/0f3460/0096ff?text=Code+Black+Banner",
      description: "A cybersecurity expert races against time to stop a global digital attack that could cripple the world's infrastructure.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-04-01",
      director: "Denis Villeneuve",
      cast: "John David Washington, Cillian Murphy, Zendaya",
      languages: ["English", "Arabic"],
      showtimes: ["16:00", "19:00", "22:00"]
    },
    {
      id: 4,
      title: "The Last Dance",
      genre: "Drama, Music",
      duration: "142 min",
      rating: 7.9,
      poster: "https://via.placeholder.com/300x450/1a1a2e/ffd60a?text=Last+Dance",
      banner: "https://via.placeholder.com/1920x600/0f3460/ffd60a?text=Last+Dance+Banner",
      description: "Follow a legendary ballet dancer's final performance as she reflects on her extraordinary life and sacrifices.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-03-25",
      director: "Damien Chazelle",
      cast: "Natalie Portman, Michael Fassbender, Timothée Chalamet",
      languages: ["English", "Arabic"],
      showtimes: ["15:30", "18:30", "20:30"]
    }
  ],
  comingSoon: [
    {
      id: 5,
      title: "Infinity Wars 2",
      genre: "Action, Adventure",
      duration: "165 min",
      rating: null,
      poster: "https://via.placeholder.com/300x450/1a1a2e/ff006e?text=Infinity+Wars+2",
      banner: "https://via.placeholder.com/1920x600/0f3460/ff006e?text=Infinity+Wars+2+Banner",
      description: "The ultimate battle for the fate of the universe begins as heroes unite against an ancient evil.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-05-15",
      director: "Taika Waititi",
      cast: "Chris Hemsworth, Scarlett Johansson, Tom Hiddleston",
      languages: ["English", "Arabic"],
      showtimes: []
    },
    {
      id: 6,
      title: "The Midnight Library",
      genre: "Fantasy, Adventure",
      duration: "138 min",
      rating: null,
      poster: "https://via.placeholder.com/300x450/1a1a2e/00d4ff?text=Midnight+Library",
      banner: "https://via.placeholder.com/1920x600/0f3460/00d4ff?text=Midnight+Library+Banner",
      description: "A woman discovers a magical library where each book leads to an alternate life she could have lived.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-06-01",
      director: "Greta Gerwig",
      cast: "Florence Pugh, Andrew Garfield, Saoirse Ronan",
      languages: ["English", "Arabic"],
      showtimes: []
    },
    {
      id: 7,
      title: "Ocean's Heart",
      genre: "Adventure, Drama",
      duration: "144 min",
      rating: null,
      poster: "https://via.placeholder.com/300x450/1a1a2e/00ff88?text=Oceans+Heart",
      banner: "https://via.placeholder.com/1920x600/0f3460/00ff88?text=Oceans+Heart+Banner",
      description: "A deep-sea expedition uncovers mysterious civilizations and the secrets of the ocean depths.",
      trailer: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      releaseDate: "2026-07-10",
      director: "James Cameron",
      cast: "Zoe Saldana, Aquafina, Jason Momoa",
      languages: ["English", "Arabic"],
      showtimes: []
    }
  ]
};

// Available dates for bookings (next 30 days)
function getAvailableDates() {
  const dates = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

// Cinema halls data
const cinemaHalls = [
  { id: 1, name: "Hall 1", rows: 8, cols: 10 },
  { id: 2, name: "Hall 2", rows: 8, cols: 12 },
  { id: 3, name: "Hall 3 - VIP", rows: 6, cols: 8 }
];

// Ticket prices
const ticketPrices = {
  standard: 12,
  vip: 18
};
