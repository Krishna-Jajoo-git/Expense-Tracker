const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const Transaction = require('./models/Transaction');

const TEST_DATA_IN_SEQUENCE = [
  // --- Month 1: May 2026 ---
  {
    title: 'Monthly Tech Salary - May',
    amount: 45000.00,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-05-01T09:00:00.000Z')
  },
  {
    title: 'Apartment Monthly Rent - May',
    amount: 7000.00,
    type: 'expense',
    category: 'Rent',
    date: new Date('2026-05-03T10:00:00.000Z')
  },
  {
    title: 'Supermarket Groceries - May',
    amount: 4500.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-05-08T14:30:00.000Z')
  },
  {
    title: 'Electricity & Water Utility - May',
    amount: 1200.00,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-05-15T11:00:00.000Z')
  },

  // --- Month 2: June 2026 ---
  {
    title: 'Monthly Tech Salary - Jun',
    amount: 45000.00,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-06-01T09:00:00.000Z')
  },
  {
    title: 'Web Design Freelance Gig',
    amount: 6000.00,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-06-05T16:00:00.000Z')
  },
  {
    title: 'Apartment Monthly Rent - Jun',
    amount: 7000.00,
    type: 'expense',
    category: 'Rent',
    date: new Date('2026-06-02T10:00:00.000Z')
  },
  {
    title: 'Summer Vacation Flight Tickets',
    amount: 5500.00,
    type: 'expense',
    category: 'Travel',
    date: new Date('2026-06-14T12:00:00.000Z')
  },
  {
    title: 'Local Supermarket - Jun',
    amount: 4100.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-06-20T17:00:00.000Z')
  },

  // --- Month 3: July 2026 ---
  {
    title: 'Monthly Tech Salary - Jul',
    amount: 48000.00,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-07-01T09:00:00.000Z')
  },
  {
    title: 'Apartment Monthly Rent - Jul',
    amount: 7000.00,
    type: 'expense',
    category: 'Rent',
    date: new Date('2026-07-02T10:00:00.000Z')
  },
  {
    title: 'Monthly Groceries - Jul',
    amount: 4800.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-07-10T15:00:00.000Z')
  },
  {
    title: 'Concert & Dining Experience',
    amount: 2500.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-07-18T20:30:00.000Z')
  },

  // --- Month 4: August 2026 ---
  {
    title: 'Monthly Tech Salary - Aug',
    amount: 48000.00,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-08-01T09:00:00.000Z')
  },
  {
    title: 'React Dashboard Consultation',
    amount: 8000.00,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-08-12T14:00:00.000Z')
  },
  {
    title: 'Apartment Monthly Rent - Aug',
    amount: 7000.00,
    type: 'expense',
    category: 'Rent',
    date: new Date('2026-08-02T10:00:00.000Z')
  },
  {
    title: 'High-speed Fiber & Cloud Bill',
    amount: 1400.00,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-08-09T11:00:00.000Z')
  },
  {
    title: 'Weekly Farm-Fresh Provisions',
    amount: 4600.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-08-22T16:00:00.000Z')
  },

  // --- Month 5: September 2026 ---
  {
    title: 'Monthly Tech Salary - Sep',
    amount: 50000.00,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-09-01T09:00:00.000Z')
  },
  {
    title: 'Stock Dividend Payout - Q3',
    amount: 3500.00,
    type: 'income',
    category: 'Investment',
    date: new Date('2026-09-15T10:30:00.000Z')
  },
  {
    title: 'Apartment Monthly Rent - Sep',
    amount: 7000.00,
    type: 'expense',
    category: 'Rent',
    date: new Date('2026-09-02T10:00:00.000Z')
  },
  {
    title: 'Grocery Mart Basket - Sep',
    amount: 4400.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-09-07T13:00:00.000Z')
  },
  {
    title: 'Train Passes & Fuel Commute',
    amount: 3200.00,
    type: 'expense',
    category: 'Travel',
    date: new Date('2026-09-18T18:00:00.000Z')
  },

  // --- Month 6: October 2026 (Current Active Month - Direct Test Cases) ---
  // TC-SCRUM-16 (KPI Salary & Income Baseline)
  {
    title: 'Monthly Tech Salary - Oct',
    amount: 50000.00,
    type: 'income',
    category: 'Salary',
    date: new Date('2026-10-01T09:00:00.000Z')
  },
  // TC-SCRUM-16 (Rent Baseline)
  {
    title: 'Apartment Monthly Rent - Oct',
    amount: 7000.00,
    type: 'expense',
    category: 'Rent',
    date: new Date('2026-10-02T10:00:00.000Z')
  },
  // Utilities
  {
    title: 'High-speed Fiber Internet',
    amount: 750.00,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-10-05T11:30:00.000Z')
  },
  {
    title: 'Electricity & Gas Bill',
    amount: 1200.00,
    type: 'expense',
    category: 'Utilities',
    date: new Date('2026-10-07T12:00:00.000Z')
  },
  // TC-MOD1-02 / Income Consulting
  {
    title: 'Consulting Fee - Oct',
    amount: 15000.00,
    type: 'income',
    category: 'Freelance',
    date: new Date('2026-10-10T14:00:00.000Z')
  },
  // Entertainment
  {
    title: 'Weekend Dinner & IMAX Cinema',
    amount: 1800.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-10-11T20:00:00.000Z')
  },
  // Travel
  {
    title: 'Metro Card & Cab Commute',
    amount: 2200.00,
    type: 'expense',
    category: 'Travel',
    date: new Date('2026-10-13T09:30:00.000Z')
  },
  // TC-SCRUM-13 (Core Test Case 1)
  {
    title: 'Grocery Shopping',
    amount: 1250.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-10-15T15:30:00.000Z')
  },
  // TC-EXT-02 (Boundary Value Analysis - Minimum Amount)
  {
    title: 'Micro Transaction (BVA Test)',
    amount: 0.01,
    type: 'expense',
    category: 'Other',
    date: new Date('2026-10-16T10:00:00.000Z')
  },
  // TC-SCRUM-14 (Category & Search Filter Target)
  {
    title: 'Organic Food & Vegetable Mart',
    amount: 850.00,
    type: 'expense',
    category: 'Food',
    date: new Date('2026-10-18T16:45:00.000Z')
  },
  // TC-SCRUM-15 (Target Record for Delete Confirmation Test)
  {
    title: 'Temporary Test Subscription (Delete Target)',
    amount: 299.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date('2026-10-20T11:15:00.000Z')
  }
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is missing in server/.env');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    console.log('1. Emptying existing transaction collection...');
    const deleteResult = await Transaction.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing records from database.`);

    console.log('2. Inserting test case records in chronological sequence...');
    const insertedRecords = await Transaction.insertMany(TEST_DATA_IN_SEQUENCE);
    console.log(`Successfully inserted ${insertedRecords.length} records in sequence!`);

    console.log('\n--- Summary of Seeded Database ---');
    const incomeRecords = insertedRecords.filter((r) => r.type === 'income');
    const expenseRecords = insertedRecords.filter((r) => r.type === 'expense');

    const totalIncome = incomeRecords.reduce((acc, r) => acc + r.amount, 0);
    const totalExpense = expenseRecords.reduce((acc, r) => acc + r.amount, 0);

    console.log(`Total Incomes:   ${incomeRecords.length} records totaling RS ${totalIncome.toFixed(2)}`);
    console.log(`Total Expenses:  ${expenseRecords.length} records totaling RS ${totalExpense.toFixed(2)}`);
    console.log(`Net Balance:     RS ${(totalIncome - totalExpense).toFixed(2)}`);
    console.log('----------------------------------\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB. Seeding completed cleanly!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err.message);
    process.exit(1);
  }
}

seedDatabase();
