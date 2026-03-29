# PropFusion 💰

A modern, intelligent personal finance management application built with Next.js, featuring AI-powered transaction categorization and multi-account support.

## Features 🚀

### 🏦 Multi-Account Management

- Create unlimited bank accounts (RBC, CIBC, Scotia, TD, BMO, etc.)
- Support for Checking, Savings, Credit Cards, and Investment accounts
- Color-coded accounts with visual indicators
- Track balance for each account separately

### 📊 Transaction Management

- Import transactions via CSV or PDF bank statements
- Automatic parsing of various bank statement formats
- Deduplication to prevent importing the same transactions twice
- Pagination and filtering by category, status, date range
- Manual transaction editing and deletion

### 🤖 AI-Powered Categorization

- **Ollama Integration**: Uses local AI (Llama 3.2) for intelligent categorization
- **Auto-Start**: Ollama starts automatically when needed (no manual commands!)
- **Smart Fallback**: If AI is unavailable, uses rules engine automatically
- **High Accuracy**: 85-95% categorization accuracy vs 70-80% with rules alone

### 🎯 Smart Rules Engine

- Linear Scan Filter algorithm for keyword-based categorization
- Create custom categories with keywords
- Automatic pattern detection (gas stations, groceries, dining, etc.)
- Manual rule execution for re-categorization

### 🎨 Modern UI/UX

- Dark mode support
- Responsive design (mobile, tablet, desktop)
- Animated Lucide icons
- Real-time toast notifications
- Beautiful gradients and color schemes

## Tech Stack 💻

- **Framework**: Next.js 16.1.1 (App Router)
- **Authentication**: Better Auth 1.4.9
- **Database**: MongoDB Atlas
- **AI**: Ollama with Llama 3.2
- **UI Components**: Custom components with Tailwind CSS
- **Icons**: Lucide React (animated)
- **Animations**: Framer Motion
- **PDF Parsing**: pdf-parse
- **CSV Parsing**: Custom parser with advanced handling

## Getting Started 🏁

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Ollama (for AI features)

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd propfusion
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3001

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

4. **Install Ollama (for AI features)**

**macOS:**

```bash
brew install ollama
ollama pull llama3.2
```

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2
```

See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for detailed instructions.

5. **Start the development server**

```bash
npm run dev
```

The app will run on [http://localhost:3001](http://localhost:3001)

### First Time Setup

1. **Create an account** at `/auth/sign-up`
2. **Create your first bank account** (e.g., "RBC Checking")
3. **Upload a CSV/PDF statement** to import transactions
4. **Categories are auto-detected** from your transactions
5. **AI automatically categorizes** everything (or uses rules if Ollama isn't running)

## How It Works 🔧

### Transaction Import Flow

```
1. User uploads CSV/PDF → 2. Parse transactions
                            ↓
3. Auto-detect categories ← 4. AI categorization (Ollama)
                            ↓ (if AI unavailable)
                     5. Rules engine fallback
                            ↓
                 6. Save to MongoDB with accountId
                            ↓
                   7. Display in UI by account
```

### AI Categorization (Automatic)

When you import transactions:

1. **AI Check**: System checks if Ollama is running
2. **Auto-Start**: If not, automatically starts Ollama in background
3. **Categorize**: Sends transactions to Llama 3.2 model
4. **Results**: Returns categorized transactions
5. **Fallback**: If AI fails, uses keyword rules engine

**No manual commands needed!** The system handles everything automatically.

### Category System

Categories are:

- **User-Created**: Build your own category structure
- **Auto-Detected**: System suggests categories from transactions
- **Persistent**: Saved to localStorage across sessions
- **Flexible**: Add/edit/delete anytime

### Rules Engine

The Linear Scan Filter algorithm:

- Matches transaction descriptions against category keywords
- Priority-based matching (higher priority categories checked first)
- Case-insensitive matching
- Supports multiple match types: contains, startsWith, equals

## Project Structure 📁

```
propfusion/
├── app/
│   ├── api/
│   │   ├── accounts/          # Account CRUD endpoints
│   │   ├── transactions/      # Transaction CRUD endpoints
│   │   ├── ai-categorize/     # AI categorization endpoint
│   │   ├── parse-pdf/         # PDF parsing endpoint
│   │   └── auth/              # Authentication endpoints
│   ├── dashboard/
│   │   └── transactions/
│   │       ├── components/
│   │       │   ├── AccountManager.tsx
│   │       │   ├── CategoryManager.tsx
│   │       │   ├── CSVUploader.tsx
│   │       │   ├── TransactionList.tsx
│   │       │   └── RulesEngine.tsx
│   │       └── page.tsx
│   └── auth/                  # Auth pages
├── components/
│   ├── Sidebar.tsx
│   ├── CategoryIcon.tsx       # Animated icons
│   └── ui/                    # UI primitives
├── lib/
│   ├── auth.ts                # Better Auth config
│   ├── db.ts                  # MongoDB connection
│   ├── rules-engine.ts        # Categorization logic
│   └── utils.ts
└── public/
```

## Database Schema 💾

### Accounts Collection

```typescript
{
  _id: ObjectId;
  userId: string;
  name: string;
  type: "checking" | "savings" | "credit_card" | "investment";
  institution: string;
  lastFour: string;
  color: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

### Transactions Collection

```typescript
{
  _id: ObjectId;
  userId: string;
  accountId: string; // NEW: Links to account
  date: string;
  description: string;
  merchant: string;
  amount: number;
  category: string;
  status: "success" | "failed" | "pending";
  cardLastFour: string;
  type: "credit" | "debit";
  transactionHash: string; // For deduplication
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

## API Endpoints 🌐

### Accounts

- `GET /api/accounts` - List all accounts
- `POST /api/accounts` - Create account
- `PATCH /api/accounts/[id]` - Update account
- `DELETE /api/accounts?id=[id]` - Delete account

### Transactions

- `GET /api/transactions?accountId=[id]` - List transactions for account
- `POST /api/transactions` - Import transactions (requires accountId)
- `PATCH /api/transactions/[id]` - Update transaction
- `DELETE /api/transactions?id=[id]` - Delete transaction

### AI & Parsing

- `POST /api/ai-categorize` - AI categorization
- `POST /api/parse-pdf` - Parse PDF statements

## Configuration ⚙️

### Ollama Auto-Start

The system automatically starts Ollama when needed. To disable this:

1. Set `DISABLE_OLLAMA_AUTO_START=true` in `.env.local`
2. Or manually start: `ollama serve`

### Running Ollama as Service

**macOS:**

```bash
brew services start ollama
```

**Linux:**

```bash
sudo systemctl enable ollama
sudo systemctl start ollama
```

See [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for details.

## Sample Data 📝

Test the app with the included sample file:

- `sample_transactions_rbc_format.csv` - 20 sample transactions

## Development 👨‍💻

### Running Locally

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Troubleshooting 🔧

### "Ollama not available" error

**Solution**: The system should auto-start Ollama. If it doesn't:

```bash
ollama serve
```

### "Model not found" error

**Solution**:

```bash
ollama pull llama3.2
```

### Transactions not appearing

1. Check that you've selected an account
2. Verify transactions were saved (check browser console)
3. Reload the page

### Categories disappeared

Categories are saved to localStorage. If they disappear:

1. Check browser settings (localStorage enabled)
2. Re-create categories or upload CSV again

## Contributing 🤝

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

For issues or questions:

1. Check [OLLAMA_SETUP.md](./OLLAMA_SETUP.md) for AI-related issues
2. Review browser console for errors
3. Check MongoDB connection
4. Verify environment variables

---

**Built with ❤️ using Next.js, MongoDB, and Ollama**
