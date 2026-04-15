# CinemaManager PHP Backend

## 1) Start backend locally

From `backend/api`:

```bash
php -S localhost:8000
```

### Windows note (`php` not recognized)

If PowerShell says `php` is not recognized:

1. Install PHP with winget:

```powershell
winget install --id PHP.PHP.8.3 --accept-package-agreements --accept-source-agreements
```

2. Close and reopen terminal (or VS Code), then retry:

```powershell
php -v
php -S localhost:8000
```

3. If it still fails, run with full path:

```powershell
& "C:\Users\Mezri\AppData\Local\Microsoft\WinGet\Packages\PHP.PHP.8.3_Microsoft.Winget.Source_8wekyb3d8bbwe\php.exe" -S localhost:8000
```

## 2) Create database

1. Create the database `cinema_manager` in MySQL.
2. Import `backend/sql/cinema_manager.sql`.

## 3) Environment variables (optional)

The API reads these values:

- `DB_HOST` (default: `127.0.0.1`)
- `DB_PORT` (default: `3306`)
- `DB_NAME` (default: `cinema_manager`)
- `DB_USER` (default: `root`)
- `DB_PASS` (default: empty)

## 4) Available endpoints

- `GET|POST|PUT|DELETE /films.php`
- `GET|POST|PUT|DELETE /seances.php`
- `GET /rooms.php`
- `GET|POST|PATCH /reservations.php`
- `POST /auth.php`
- `GET /dashboard.php`

## 5) Quick examples

### Login admin

```http
POST /auth.php
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

### Create film

```http
POST /films.php
Content-Type: application/json

{
  "title": "Avatar 3",
  "genre": "Sci-Fi",
  "duration_minutes": 160,
  "classification": "PG-13",
  "synopsis": "New adventure",
  "poster_url": "https://example.com/poster.jpg"
}
```

### Create reservation

```http
POST /reservations.php
Content-Type: application/json

{
  "seance_id": 1,
  "customer_name": "Test User",
  "customer_email": "test@example.com",
  "tickets_count": 2
}
```
