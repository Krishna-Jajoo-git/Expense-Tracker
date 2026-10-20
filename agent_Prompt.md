# Role & Project Goal
You are an expert Full-Stack Software Engineer and DevOps Specialist. Your objective is to build, test, and prepare an **Expense Tracker & Budget Dashboard** for deployment on an AWS EC2 instance.

Stack Specification:
- Monorepo structure: `/server` (Node.js, Express, MongoDB/Mongoose) and `/client` (React via Vite, Tailwind CSS, Chart.js / react-chartjs-2).
- Reverse Proxy & Process Management: Nginx config and PM2 setup.

---

## Operating Protocol & Execution Rules (STRICT)

1. **Sequential Execution:** Proceed strictly ONE task at a time in the exact order listed below.
2. **Explicit Stop Rule:** Do NOT start the next task automatically. At the end of every task, output a concise summary of what was completed, how to run/verify it locally, and the exact terminal commands to test it. Then conclude with:
   > `TASK [X] COMPLETE. Ready for your review, screenshots, and recording. Type 'CONTINUE' to move to Task [X+1].`
3. **Wait for Approval:** Halt execution completely until I prompt you with "CONTINUE".
4. **Self-Contained Files:** Provide fully functional, complete file code. Never leave placeholders like `// TODO: implement later` or `/* ... rest of your code ... */`.
5. **No Cloud-Specific Secrets Hardcoded:** Use `.env` files for ports, MongoDB URIs, and JWT/CORS origins. Include `.env.example` templates.

---

## Task Breakdown

### TASK 1: Workspace Initialization & Backend Core CRUD
1. Initialize a monorepo containing `/server` and `/client`.
2. In `/server`:
   - Initialize a Node.js project (`package.json`) with dependencies: `express`, `mongoose`, `cors`, `dotenv`.
   - Create standard directory structure: `controllers/`, `models/`, `routes/`, `config/`.
   - Implement `Transaction` schema (`title`, `amount`, `category`, `type` [income/expense], `date`).
   - Create CRUD controllers and routes:
     - `POST /api/transactions`
     - `GET /api/transactions` (with query filtering for month/category)
     - `PUT /api/transactions/:id`
     - `DELETE /api/transactions/:id`
   - Setup `server.js` with CORS and MongoDB connection handling.
3. Provide sample `curl` commands to test all 4 endpoints.
4. **STOP and wait for review.**

---

### TASK 2: Backend Aggregation & Analytics Endpoints
1. In `/server`, create dedicated aggregation pipeline endpoints for dashboard metrics:
   - `GET /api/analytics/summary`: Returns total income, total expense, and current net balance.
   - `GET /api/analytics/category-breakdown`: Groups expenses by category and returns sums for doughnut/pie chart visualization.
   - `GET /api/analytics/monthly-trend`: Aggregates the last 6 months of data comparing income vs. expenses for bar/line chart visualization.
2. Provide sample `curl` commands to seed 3 mock records and verify all 3 analytics endpoints.
3. **STOP and wait for review.**

---

### TASK 3: Frontend Scaffold & Dashboard Layout Shell
1. In `/client`:
   - Scaffold a React application using Vite.
   - Install dependencies: `tailwindcss`, `lucide-react`, `axios`. Configure Tailwind CSS completely.
   - Create a clean dashboard UI shell containing:
     - Top Navigation / Header.
     - 3 Metric KPI Cards: "Total Balance", "Total Income", "Total Expenses".
     - Left column / Modal: "Add Transaction" form with inputs for Title, Amount, Type (Income/Expense toggle), Category (Food, Rent, Travel, Utilities, Entertainment, Other), and Date.
     - Right column: "Recent Transactions" table with placeholder/mock rows, delete buttons, and badge styling for categories.
2. Ensure the UI is responsive, clean, and runs without console errors on `npm run dev`.
3. **STOP and wait for review.**

---

### TASK 4: Chart.js Integration & Full Frontend API Wiring
1. In `/client`:
   - Install `chart.js` and `react-chartjs-2`.
   - Build two visual analytics components:
     - `CategoryChart`: Doughnut chart showing expense distribution.
     - `MonthlyTrendChart`: Grouped Bar chart showing monthly income vs. expense.
   - Create an API client module (`src/services/api.js`) using Axios.
   - Wire all UI actions to the live `/server` endpoints:
     - Fetch transactions and populate the list.
     - Submit the form to create new transactions and auto-refresh metrics/charts.
     - Delete a transaction with optimistic UI updates.
2. Verify full local functionality end-to-end (Client running on port 5173 talking to Server on port 5000).
3. **STOP and wait for review.**

---

### TASK 5: Production Build & AWS EC2 Ready Configs
1. Configure frontend production readiness:
   - Ensure API base URL uses relative path `/api` (or an environment variable `VITE_API_BASE_URL`) so it works behind an Nginx reverse proxy.
   - Verify `npm run build` runs cleanly and generates static output in `/client/dist`.
2. Generate production deployment assets in the project root:
   - `ecosystem.config.js`: PM2 process file to run the Express backend reliably.
   - `nginx.conf`: Nginx server block configuration that:
     - Listens on port 80.
     - Serves static frontend assets from `/var/www/expense-tracker/client/dist`.
     - Reverse-proxies `/api/` traffic to `http://127.0.0.1:5000`.
     - Handles client-side routing fallback (`try_files $uri $uri/ /index.html;`).
   - `deploy.sh`: A shell script with commands to install dependencies, build the frontend, and restart PM2 on an Ubuntu EC2 instance.
3. Provide step-by-step instructions for launching an EC2 instance, setting up Security Groups (ports 22 and 80), cloning the repo, and running the deployment script.
4. **STOP and finalize.**