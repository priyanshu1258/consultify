# Consultify

**Live Demo:** [https://consultify-cdv6.onrender.com](https://consultify-cdv6.onrender.com)

## Overview

Consultify is a full-stack application featuring a modern React frontend and a robust Node.js backend. The backend includes custom WhatsApp integration (using the Baileys library) to handle OTP migrations and messaging services natively.

## Project Structure

- **/frontend** - The client-side React application built with Vite and Tailwind CSS.
- **/backend** - The Node.js and Express server, containing API routes, MongoDB models, and the `whatsappService.js` for WhatsApp integration.

## Features

- **Modern UI:** Responsive frontend built with React, Vite, and Tailwind.
- **RESTful API:** Express-powered backend with MongoDB integration.
- **WhatsApp Services:** Custom OTP and messaging handling using Baileys (`baileys_auth_info`).

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB

### Installation & Local Development

1. **Backend Setup:**

   ```bash
   cd backend
   npm install
   npm start
   ```

   _(Ensure you configure your `.env` file with the required variables like `MONGO_URI`, `PORT`, etc., before starting)_

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Additional Documentation

For more in-depth details on how the different components of this project work, check out the provided documentation files:

- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Flow Diagram](./FLOW_DIAGRAM.md)
- [WhatsApp OTP Solution](./WHATSAPP_OTP_SOLUTION.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Quick Start Scripts](./QUICK_START.sh)
