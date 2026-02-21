# MedCase 🏥

A platform for browsing real anonymized patient treatment journeys to help people make informed decisions after a diagnosis.

## 🌐 Live Demo
[medcase.up.railway.app](https://medcase.up.railway.app)

## 📸 Screenshots

> Add 3 screenshots here after deployment:
> `docs/screenshots/dashboard.png`
> `docs/screenshots/browse-cases.png`
> `docs/screenshots/ask-ai.png`

## 🎥 Demo Video
[Watch Demo]https://drive.google.com/file/d/1PLqS_iVC03q9jawC6KgN1sYQnTfN2nI1/view?usp=drive_link

## 🛠 Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **AI:** Google Gemini 2.5 Flash API
- **Charts:** Recharts
- **Routing:** React Router v6
- **Deployment:** Railway

## ✨ Features
1. **Browse Anonymized Cases** — Search and filter real patient treatment journeys by disease, severity, outcome, age, and gender
2. **Dashboard Analytics** — Visual charts showing recovery rates by hospital, treatment costs, and outcome distributions
3. **Ask AI** — Gemini-powered chat panel to ask questions about diseases, treatments, and how to interpret case data
4. **Submit Cases** — Authorized medical institutions can submit new anonymized patient cases via a gated form
5. **Real-time Filtering** — Filter cases by multiple parameters simultaneously with live result counts
6. **Hospital Comparisons** — Compare recovery rates and average treatment costs across contributing hospitals

## 🏗 Architecture
```
medcase/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx       # Landing/marketing page
│   │   ├── Home.jsx          # Dashboard with charts
│   │   ├── Results.jsx       # Browse & filter cases
│   │   └── Submit.jsx        # Submit new case (gated)
│   ├── components/
│   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   ├── GeminiPanel.jsx   # AI chat side panel
│   │   ├── StatCard.jsx      # Dashboard stat cards
│   │   ├── RecoveryChart.jsx # Bar chart - recovery by hospital
│   │   ├── HospitalCostChart.jsx  # Line chart - costs
│   │   ├── OutcomePieChart.jsx    # Pie chart - outcomes
│   │   ├── CaseCard.jsx      # Table row for a case
│   │   └── FilterPanel.jsx   # Filter sidebar
│   ├── lib/
│   │   └── supabase.js       # Supabase client
│   └── main.jsx
├── public/
├── docs/
│   └── screenshots/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/medcase.git
cd medcase

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your keys in .env
```

## 🔑 Environment Variables

Create a `.env` file in the root:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## ▶️ Run
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🗄 Database Schema

**Table: `cases`**
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| disease | text | Disease name |
| disease_spec | text | Specification/details |
| hospital_name | text | Hospital name |
| age | int | Patient age |
| gender | text | Patient gender |
| severity | text | Mild / Moderate / Severe |
| treatment | text | Treatment used |
| treatment_start_date | date | Start date |
| treatment_end_date | date | End date |
| total_cost_inr | int | Total cost in INR |
| outcome | text | Recovered / Improved / Stable / Deteriorating |
| side_effects | text | Side effects noted |
| report_available | boolean | Whether report exists |

## 🤖 AI Tools Used
- **Claude (Anthropic)** — Used for generating component code, debugging, and UI improvements
- Prompts focused on React component generation, Tailwind styling, and Gemini API integration

## 👥 Team
- Ruth Domini, Sreelakshmi

## 📄 License
[MIT](LICENSE)