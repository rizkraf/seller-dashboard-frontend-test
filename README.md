# Seller Dashboard — Frontend Test

A seller dashboard web application built as a test. It allows a seller to manage their products through a clean, responsive interface.

## Features

- **Authentication** — Login with email and password; session persisted via cookie
- **Product List** — Browse products with pagination (5 per page)
- **Filtering** — Filter products by title, price range, and category
- **Add Product** — Create a new product with title, price, description, category, and image upload
- **Edit Product** — Update an existing product's details
- **Delete Product** — Remove a product with a confirmation dialog
- **Image Upload** — Upload product images with per-file upload status indicators
- **Confirm Dialog** — All destructive or submit actions require user confirmation

## Tech Stack

| Category      | Library                                                          |
| ------------- | ---------------------------------------------------------------- |
| Framework     | [Vue 3](https://vuejs.org/) (Composition API + `<script setup>`) |
| Language      | TypeScript                                                       |
| Build Tool    | [Vite](https://vite.dev/)                                        |
| Routing       | [Vue Router 4](https://router.vuejs.org/)                        |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/)                      |
| UI Primitives | [Reka UI](https://reka-ui.com/)                                  |
| Icons         | [Iconify](https://iconify.design/)                               |
| Utilities     | [VueUse](https://vueuse.org/)                                    |

## Project Structure

```
src/
├── assets/         # Global styles
├── components/     # Reusable UI components
│   ├── ConfirmDialog.vue
│   ├── ProductCard.vue
│   ├── ProductFilter.vue
│   ├── ProductForm.vue
│   └── ProductPagination.vue
├── router/         # Vue Router configuration
├── types/          # TypeScript interfaces
└── views/          # Page-level components
    ├── LoginView.vue
    ├── DashboardView.vue
    ├── HomeView.vue
    ├── ProductView.vue
    ├── AddProductView.vue
    └── EditProductView.vue
```

## Getting Started

### Prerequisites

- Node.js 18+
- A running REST API (default: `http://localhost:3000`)

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Install Dependencies

```sh
npm install
```

### Run Development Server

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

### Type Check

```sh
npm run type-check
```

### Lint & Format

```sh
npm run lint
npm run format
```

## API Endpoints Used

| Method | Endpoint        | Description                                     |
| ------ | --------------- | ----------------------------------------------- |
| POST   | `/auth/login`   | Authenticate user                               |
| GET    | `/products`     | List products (supports filtering & pagination) |
| POST   | `/products`     | Create a product                                |
| PUT    | `/products/:id` | Update a product                                |
| DELETE | `/products/:id` | Delete a product                                |
| GET    | `/categories`   | List categories                                 |
| POST   | `/files/upload` | Upload an image file                            |
