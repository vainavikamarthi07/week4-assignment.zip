[README.md](https://github.com/user-attachments/files/33307963/README.md)[Uploading READ# Week 4: Good Things E-Commerce Capstone

This project uses the e-commerce option from the Week 4 capstone brief and includes the mini e-commerce practice work.

## Project features

- React product catalog with search and a responsive layout.
- Account registration and sign-in using bcrypt password hashing and JWT.
- Shopping bag saved in browser storage, stock checks, demo checkout, and customer order history.
- Admin dashboard to add, edit, and delete products and update order status.
- Express + MongoDB/Mongoose API with product and order persistence, user-scoped orders, and role checks.
- Postman requests in `backend/postman/week4-api.postman_collection.json`.

Checkout is a class demo. It does not collect payment details or process real payments.

## Run locally

Prerequisites: Node.js 18+, MongoDB Community Server or a MongoDB Atlas database, and optionally Postman.

1. Open a terminal in `backend/` and copy `.env.example` to `.env`.
2. Set `MONGODB_URI` to your local or Atlas connection string. Set `JWT_SECRET` to a long random secret. Change `ADMIN_EMAIL` to the email address you plan to use for the store administrator **before registering that account**. Do not commit `.env`.
3. Install and start the API:

```sh
npm install
npm run seed
npm run dev
```

The seed command adds three demo products. The API runs at `http://localhost:5000`; `/api/health` is its health endpoint.

4. In a second terminal, open `frontend/` and run:

```sh
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Register using the email set in `ADMIN_EMAIL` to get the admin dashboard. Other registered accounts receive regular customer access.

## Important API routes

| Method | Route | Access |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/products` | Public |
| POST, PATCH, DELETE | `/api/products` and `/api/products/:id` | Admin |
| POST | `/api/orders` | Signed-in customer |
| GET | `/api/orders/mine` | Signed-in customer |
| GET | `/api/orders` | Admin |
| PATCH | `/api/orders/:id/status` | Admin |

Protected requests use `Authorization: Bearer <token>`. Import the Postman collection to try the API directly.

## Deploy the project

The project has separate frontend and backend folders. To deploy from GitHub, upload the **extracted project files and folders**, not only this ZIP file. A repository containing only the ZIP can be downloaded, but Vercel and Render cannot build the app from source files hidden inside that archive.

### 1. Create MongoDB Atlas database

Create a cluster, a database user, and an IP access list entry for the API service. Copy the Atlas connection string for the backend `MONGODB_URI`; keep the database password private. Atlas requires an allowed network address and a database user to connect ([Atlas connection docs](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)).

### 2. Deploy the backend on Render

Create a Render **Web Service** connected to your GitHub repository. Set **Root Directory** to `backend`, **Build Command** to `npm install`, and **Start Command** to `npm start`. Add these environment variables in Render:

- `MONGODB_URI`: Atlas connection string
- `JWT_SECRET`: a long random secret
- `ADMIN_EMAIL`: the email for your admin account
- `CLIENT_ORIGIN`: your deployed Vercel site origin, e.g. `https://your-shop.vercel.app`

Render assigns a public `onrender.com` URL to the service; its official guide covers web service creation and deploys ([Render Express guide](https://render.com/docs/deploy-node-express-app)).

### 3. Deploy the frontend on Vercel

Import the same GitHub repository into Vercel and set the project **Root Directory** to `frontend`. Vite uses `npm run build` and outputs `dist`. Add the environment variable `VITE_API_URL` with your Render API URL, such as `https://your-api.onrender.com`, then deploy. The included `vercel.json` supports client-side React routes. See [Vercel's Vite guide](https://vercel.com/docs/frameworks/frontend/vite).

After the first deployment, update Render's `CLIENT_ORIGIN` to the exact Vercel origin and redeploy the API. Register the account matching `ADMIN_EMAIL` to access the Admin page.

### Image upload note

The Week 3 image upload API is retained as an extra feature. It writes images to `backend/uploads/` on the server. Render's default filesystem is ephemeral, so uploaded files can disappear after restart or deploy; use a persistent disk or object storage for durable production uploads ([Render filesystem FAQ](https://render.com/docs/faq)).

## GitHub submission

If the course only needs a code link, create a public GitHub repository and upload the ZIP. For the Vercel/Render steps above, first upload the extracted project tree so the platforms can access `backend/` and `frontend/` directly. Never publish `.env`, MongoDB credentials, or JWT secrets.
ME.md…]()
