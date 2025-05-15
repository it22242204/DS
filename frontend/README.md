# FoodieGo Frontend

This is the frontend of the FoodieGo application, built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **shadcn-ui**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

---

## Project Overview

FoodieGo is a food delivery platform that connects customers, restaurants, and delivery partners. This repository contains the frontend code for the application.

---

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: For type safety and better developer experience.
- **Vite**: For fast development and build tooling.
- **Tailwind CSS**: For styling.
- **shadcn-ui**: For pre-built UI components.

---

## Getting Started

### Prerequisites

1. **Node.js and npm**: Install Node.js (v16 or higher) and npm. You can download them from [Node.js official website](https://nodejs.org/).
2. **Git**: Ensure Git is installed on your system.

### Installation

1. Clone the repository:
   ```sh
   git clone <YOUR_REPOSITORY_URL>
   cd FoodieGo/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

---

## Development

### Running the Development Server

Start the development server with hot reloading:
```sh
npm run dev
```

The application will be available at [http://localhost:8080](http://localhost:8080).

### Linting

Run the linter to check for code quality:
```sh
npm run lint
```

---

## Environment Variables

The project requires the following environment variables. Create a `.env` file in the root of the `frontend` directory and add the following:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

Replace `your-stripe-public-key` with your actual Stripe public key.

---

## Deployment

### Build for Production

To build the project for production:
```sh
npm run build
```

The production-ready files will be generated in the `dist` directory.

### Deployment Steps

1. Use a hosting platform like **Vercel**, **Netlify**, or **AWS S3** to deploy the `dist` folder.
2. Ensure the environment variables are configured in the hosting platform.

---

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.