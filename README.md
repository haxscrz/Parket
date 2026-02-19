# 🅿️ Parket - AI-Powered Smart Parking App

This is the code for **Parket**, an intelligent parking app with **Machine Learning** capabilities. Find optimal parking spots with AI-powered predictions and real-time insights!

Original design: https://www.figma.com/design/JCgzoMLIenYl8cBqWWyEtC/Smart-Parking-App-UI-Design

---

## ✨ Key Features

### 🤖 Machine Learning Integration
- **Peak Hours Prediction** - AI analyzes historical data to predict crowded times
- **Best Time Suggestions** - Get ML-powered recommendations for optimal parking times
- **Smart Slot Routing** - Intelligent parking spot selection based on traffic and distance
- **Real-time Occupancy Forecasts** - Know availability before you arrive

### 🎯 Core Features
- Interactive parking lot navigation
- Real-time slot availability
- E-wallet integration
- Parking history tracking
- Dark/Light mode support
- Responsive mobile design

---

## 🚀 How to Run This Project

### Quick Setup (Easy Way)

**For your friends:**

1. Click the green **Code** button at the top of this page
2. Click **Download ZIP**
3. Extract the ZIP file to a folder
4. Open the folder in your terminal/command prompt
5. Paste these commands one at a time:
   ```
   npm install
   npm run dev
   ```
6. Open your browser to `http://localhost:5173`

---

### Using Git (For developers)

```bash
# Clone the repository
git clone https://github.com/haxscrz/Parket.git
cd Parket

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open your browser to the URL shown (usually `http://localhost:5173`)

---

## 📋 Requirements

Before you can run this, you need to install **Node.js**:

1. Download from: https://nodejs.org/
2. Install it (use default settings)
3. Restart your terminal/command prompt
4. Done! (npm comes with it)

**Check if you have it:**
```bash
node --version
npm --version
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **Radix UI** - Accessible components

### Machine Learning
- **TensorFlow.js** - In-browser ML inference
- **Python (Training)** - scikit-learn, pandas, numpy
- **Random Forest** - Prediction algorithm (94.5% accuracy)
- **Jupyter Notebooks** - Model training environment

### Design
- **Figma** - Original design source

---

## 🧠 Machine Learning System

Parket uses advanced machine learning to provide intelligent parking recommendations.

### How It Works

1. **Data Collection** - Historical parking data from 6 locations
2. **Model Training** - Random Forest algorithm trained on patterns
3. **Real-time Predictions** - Forecasts occupancy based on time, day, weather
4. **Smart Recommendations** - Suggests optimal parking times and spots

### ML Features

#### 📊 Peak Hours Analysis
View AI-powered charts showing when parking lots are busiest:
- Weekend vs weekday patterns
- Hourly occupancy trends
- Top 3 times to avoid

#### ⏰ Best Time Suggestions
Get personalized recommendations for:
- Optimal parking times
- Availability percentages
- Confidence scores

#### 🎯 Smart Slot Routing
ML-optimized parking spot selection considering:
- Distance to mall entrance
- Current traffic levels
- Walking time estimation
- High availability probability

### Training Your Own Model

Want to customize the ML model? See [`ml/README.md`](ml/README.md) for:
- Dataset structure
- Training instructions
- Customization options
- Performance metrics

---

## 📁 Project Structure

```
Parket/
├── src/
│   ├── components/          # React components
│   │   ├── HomeScreen.tsx           # Main dashboard with ML insights
│   │   ├── ParkingNavigationScreen.tsx  # Navigation with smart routing
│   │   ├── PeakHoursChart.tsx      # ML-powered peak hours visualization
│   │   ├── BestTimeSuggestions.tsx # AI time recommendations
│   │   └── SmartSlotRecommendation.tsx  # Intelligent slot selection
│   ├── services/
│   │   └── mlPredictionService.ts  # ML inference service
│   ├── types/
│   │   └── ml-predictions.ts       # TypeScript types for ML
│   ├── App.tsx                     # Main app
│   └── main.tsx                    # Entry point
├── ml/
│   ├── parking_historical_data.csv # Training dataset
│   ├── parking_ml_training.ipynb   # Jupyter notebook for training
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # ML documentation
├── public/
│   └── parking_predictions.json    # Pre-computed ML predictions
├── package.json                    # Dependencies
└── vite.config.ts                  # Build config
```

---

## 📊 ML Model Performance

- **Accuracy**: 94.5% R² Score
- **Locations**: 6 parking areas analyzed
- **Data Points**: 300+ historical records
- **Predictions**: Hourly forecasts for all days

### Key Insights Discovered

- **Peak Times**: Friday-Sunday, 12 PM - 6 PM (96% occupancy)
- **Best Times**: Monday-Thursday, 6-8 AM (25% occupancy)
- **Weekend Impact**: 40-50% higher occupancy than weekdays
- **Optimal Location**: St. Luke's Hospital (lowest congestion)

---

## 💡 Tips

- Press **h** in the terminal while the dev server runs for more options
- Changes to files automatically reload in your browser
- The app runs locally - no internet needed (except for first setup)

---

**Created by:** Hans Carlo C. Cruz

**Questions?** Check the issues or create a new one!
