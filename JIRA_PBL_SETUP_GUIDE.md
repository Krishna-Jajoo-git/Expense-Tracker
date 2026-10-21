# JIRA Setup & Project-Based Learning (PBL) Reference Guide

**Project Title:** Expense Tracker & Budget Control System  
**Tech Stack:** MERN (MongoDB Atlas, Express.js, React + Vite, Node.js), Tailwind CSS, Chart.js  
**Atlassian JIRA Workspace:** [expense-tracker-24.atlassian.net](https://expense-tracker-24.atlassian.net)  

---

## 1. Project Information
- **Project Name:** My Software Team / Expense Tracker & Budget Control System
- **Key:** `SCRUM`
- **Project Lead / Reporter:** Krishna Jajoo (Student ID: `A4_B1_8_KRISHNA JAJOO`)
- **Methodology:** Agile / Scrum
- **Project Description:** A full-stack web application designed for personal finance tracking, category-based expenditure monitoring, and multi-dimensional financial analytics.

---

## 2. Selected Two Modules (as per PBL Guidelines)

### Module 1: Core Transaction Management (Epic: `SCRUM-11`)
- **Scope:** Complete transaction lifecycle management (Create, Read, Update, Delete).
- **Key Features:** Form validation, category tagging, date filtering, Month-wise and Expense/Category filters, search, CSV export, optimistic UI updates, and MongoDB persistence.

### Module 2: Visual Analytics & Financial Reporting (Epic: `SCRUM-12`)
- **Scope:** Real-time financial intelligence and data visualization.
- **Key Features:** MongoDB aggregation pipelines, Summary KPI cards (Balance, Income, Expense in RS), Expense & Income Breakdown Doughnut Chart, and 6-Month Cashflow Trend Grouped Bar Chart.

---

## 3. Epics & User Stories for JIRA

### Epic 1: [SCRUM-11] Module 1 - Core Transaction Management
**Description:** Implement robust transaction capture, editing, deletion, and chronological querying with data validation.

#### Story 1.1: [SCRUM-13] Record New Transactions
- **User Story:** *As a user, I want to record an income or expense transaction with title, amount, category, and date, so that I can accurately track my financial flow.*
- **Assignee:** Krishna Jajoo
- **Priority:** Medium
- **Status:** Done
- **Acceptance Criteria:**
  - Amount must be positive (> RS 0.01).
  - Title cannot be empty.
  - Category must default to a valid option.
  - Returns 201 Created and updates the UI instantly.

#### Story 1.2: [SCRUM-14] View and Filter Recent Transactions
- **User Story:** *As a user, I want to view my transaction history in a clear table and filter by All / Expenses / Income, Month, and Category, so that I can audit specific entries.*
- **Assignee:** A4_B1_8_KRISHNA JAJOO
- **Priority:** Medium
- **Status:** Done
- **Acceptance Criteria:**
  - Distinct badge colors for each category.
  - Correct signed values (`+ RS ...` for Income, `- RS ...` for Expense).
  - Real-time client filtering by Type, Month, and Category without unnecessary page reloads.
  - Real-time search by title or note.

#### Story 1.3: [SCRUM-15] Transaction Deletion with Optimistic UI
- **User Story:** *As a user, I want to delete incorrect transactions with confirmation, so that my ledger remains accurate.*
- **Assignee:** Krishna Jajoo
- **Priority:** Medium
- **Status:** Done
- **Acceptance Criteria:**
  - Inline confirmation before deletion.
  - Immediate visual row removal (optimistic update).
  - Backend `DELETE /api/transactions/:id` executed in background.
  - Automatic state rollback if network/server call fails.

---

### Epic 2: [SCRUM-12] Module 2 - Visual Analytics & Financial Reporting
**Description:** Implement financial aggregation pipelines and visual dashboard charts using Chart.js.

#### Story 2.1: [SCRUM-16] Summary KPI Cards (Balance, Income, Expense)
- **User Story:** *As a user, I want to view high-level metrics for Total Balance, Total Income, and Total Expense in RS, so that I understand my net liquidity at a glance.*
- **Assignee:** Unassigned
- **Priority:** Medium
- **Status:** Done
- **Acceptance Criteria:**
  - Net Balance = Total Income - Total Expense.
  - Formatted using Indian Numbering system (`RS #,##,###.##`).
  - Color-coded badges indicating positive vs. deficit financial standing.

#### Story 2.2: [SCRUM-17] Expense Distribution Doughnut Chart
- **User Story:** *As a user, I want to see a visual breakdown of my expenses by category in a Doughnut chart, so that I know where most of my money is being spent.*
- **Assignee:** Unassigned
- **Priority:** Medium
- **Status:** Done
- **Acceptance Criteria:**
  - Aggregated by category using MongoDB pipeline.
  - Displays category percentages and hover tooltips formatted in RS.
  - Toggle between Expense and Income breakdown.
  - Displays friendly empty state when no expenses exist.

#### Story 2.3: [SCRUM-18] 6-Month Monthly Cashflow Trend Bar Chart
- **User Story:** *As a user, I want to compare monthly income versus expense over the last 6 months, so that I can observe seasonal financial patterns.*
- **Assignee:** Unassigned
- **Priority:** Medium
- **Status:** Done
- **Acceptance Criteria:**
  - Continuous 6-month sequence (no missing months even if 0 transactions).
  - Grouped bars: Income (Emerald) and Expense (Rose).
  - Y-axis dynamic scale in RS.

---

## 4. Sprint Schedule & Planning

| Sprint | Goal | Included Issues | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | Implement Module 1 (Schemas, CRUD routes, Form & Table) | SCRUM-13, SCRUM-14, SCRUM-15, SCRUM-19 | Medium | Closed / Done (100%) |
| **Sprint 2** | Implement Module 2 (Aggregation Pipelines, KPI Cards, Charts) | SCRUM-16, SCRUM-17, SCRUM-18, SCRUM-20 | Medium | Closed / Done (100%) |

---

## 5. Bugs / Defects Recorded in JIRA

### Bug 1: [SCRUM-19] Negative Amount Allowed in Transaction Form
- **Summary:** Form accepts negative number input causing incorrect total calculations.
- **Priority:** Medium
- **Severity:** Major
- **Reporter:** Krishna Jajoo
- **Component:** Module 1 (`SCRUM-11`)
- **Steps to Reproduce:**
  1. Open Add Transaction form.
  2. Enter Amount `-200`.
  3. Click Add Expense.
- **Expected:** Form rejects submission with error: "Please enter a valid amount greater than 0".
- **Actual:** Transaction was created with negative value, falsifying calculations.
- **Status:** Closed / Resolved (Done)
- **Fix:** Added validation rule in Mongoose schema `min: [0.01]` and client-side check `parsedAmount <= 0`.

### Bug 2: [SCRUM-20] Missing Categories in Doughnut Chart on Empty State
- **Summary:** Chart container throws warning and shows blank space when 0 expense records exist.
- **Priority:** Medium
- **Severity:** Minor
- **Reporter:** Krishna Jajoo
- **Component:** Module 2 (`SCRUM-12`)
- **Steps to Reproduce:**
  1. Reset database or have 0 expense transactions.
  2. Load dashboard.
- **Expected:** Clean message: "No expense records found. Add an expense to view distribution."
- **Actual:** Blank canvas with console warnings.
- **Status:** Closed / Resolved (Done)
- **Fix:** Added conditional `hasData` check and fallback empty-state view.
