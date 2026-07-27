#  Sales, Inventory & CRM System

A business application for managing products, sales, customer relationships, and employee KPI tracking, built with Laravel (API) and React (frontend).

## Features

- **Product Management** — create, view, edit, and delete products (name, SKU, price, stock quantity)
- **Inventory Control** — sales automatically deduct stock and are blocked when stock is insufficient
- **Sales Recording** — record multi-item sales with automatic total calculation
- **Customer Purchase History** — view each customer's past purchases
- **Lost Customer Detection** — flag customers inactive for a configurable period
- **Customer Re-engagement** — trigger a re-engagement action for inactive customers
- **Employee Assignment** — assign inactive customers to employees for follow-up
- **KPI Tracking** — employee KPI score increases automatically when an assigned customer purchases again
- **Email Invoices** — a PDF invoice is automatically emailed to the customer after a successful sale (via Mailtrap)

## Prerequisites

- PHP 8.1+ and Composer
- Node.js 18+ and npm
- MySQL
- A [Mailtrap](https://mailtrap.io/) account (for invoice emails)

## Setting Up the Backend

```bash
cd Laravel

# Create your environment file
cp .env.example .env

# Install PHP dependencies
composer install

# Generate the application key
php artisan key:generate

# Run database migrations
php artisan migrate

# Run migrations with seed data (products, customers, employees, sales)
php artisan migrate --seed

# Start the development server
php artisan serve
```

Your API will now be accessible at **http://127.0.0.1:8000**.

### Environment Configuration

Before running the commands above, update `.env` with your database and mail credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sinodtech
DB_USERNAME=root
DB_PASSWORD=


MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your email
MAIL_PASSWORD=your password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your mail address
MAIL_FROM_NAME="${APP_NAME}"
```

Create the `sinodtech` database (or your chosen name) in MySQL before running migrations.

## Setting Up the Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be accessible at the URL shown in your terminal (typically **http://localhost:5173**) and communicates with the backend at `http://127.0.0.1:8000`.

## Running the Project

1. Start the backend: `php artisan serve` (from the `Laravel` directory)
2. Start the frontend: `npm run dev` (from the `frontend` directory)
3. Open the frontend URL in your browser — sample data from the seeders is ready to use immediately

## Notes

- Invoice emails are sent synchronously after each sale; if Mailtrap is unreachable, the sale still completes successfully and the error is logged rather than blocking the response.
- Check your Mailtrap inbox to view sent invoices (HTML email + PDF attachment).
