-- Cinema Database Schema
-- Create the database
CREATE DATABASE IF NOT EXISTS cinema_db;
USE cinema_db;

-- Films table
CREATE TABLE films (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    classification VARCHAR(10) NOT NULL,
    synopsis TEXT,
    poster_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Salles (Rooms) table
CREATE TABLE salle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL
);

-- Seances (Showtimes) table
CREATE TABLE seances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    film_id INT NOT NULL,
    room_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    total_seats INT NOT NULL,
    available_seats INT NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES salle(id) ON DELETE CASCADE
);

-- Reservations table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seance_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20),
    num_seats INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reservation_code VARCHAR(50) UNIQUE NOT NULL,
    FOREIGN KEY (seance_id) REFERENCES seances(id) ON DELETE CASCADE
);

-- Sample data
-- Insert sample films
INSERT INTO films (title, genre, duration_minutes, classification, synopsis, poster_url) VALUES
('Inception', 'Science Fiction', 148, 'PG-13', 'A thief who steals corporate secrets through the use of dream-sharing technology.', 'https://example.com/posters/inception.jpg'),
('The Dark Knight', 'Action', 152, 'PG-13', 'Batman faces the Joker in Gotham City.', 'https://example.com/posters/dark_knight.jpg'),
('Pulp Fiction', 'Crime', 154, 'R', 'The lives of two mob hitmen intertwine with those of a boxer and a pair of diner bandits.', 'https://example.com/posters/pulp_fiction.jpg');

-- Insert sample salles
INSERT INTO salle (name, capacity) VALUES
('Salle 1', 100),
('Salle 2', 150),
('Salle 3', 200);

-- Insert sample seances
INSERT INTO seances (film_id, room_id, start_time, total_seats, available_seats, base_price) VALUES
(1, 1, '2024-04-20 14:00:00', 100, 100, 12.50),
(2, 2, '2024-04-20 16:30:00', 150, 150, 15.00),
(3, 3, '2024-04-20 19:00:00', 200, 200, 10.00);

-- Insert sample reservations
INSERT INTO reservations (seance_id, user_name, user_email, user_phone, num_seats, total_price, reservation_code) VALUES
(1, 'John Doe', 'john@example.com', '123-456-7890', 2, 25.00, 'RES001'),
(2, 'Jane Smith', 'jane@example.com', '098-765-4321', 4, 60.00, 'RES002');