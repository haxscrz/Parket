# 🅿️ Parket - Smart Parking App

This is the code for **Parket**, a smart parking app UI design with **Machine Learning** capabilities. Find and navigate to parking spots easily with AI-powered recommendations!

Original design: https://www.figma.com/design/JCgzoMLIenYl8cBqWWyEtC/Smart-Parking-App-UI-Design

---

## ✨ Features

- 🤖 **AI-Powered Recommendations** - Machine learning predicts parking availability
- 🎯 **Smart Parking** - Get personalized spot recommendations based on your preferences
- 🗺️ **Navigation** - Real-time pathfinding to your parking spot
- 💰 **E-Wallet** - Integrated payment system
- 📊 **Parking History** - Track your past parking sessions
- 🔔 **Notifications** - Stay updated on parking status
- 🌙 **Dark Mode** - Eye-friendly night theme

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

- **React** - UI framework
- **TypeScript** - Programming language
- **TensorFlow.js** - Machine Learning
- **Vite** - Super fast build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Figma** - Design tool

---

## 🤖 Machine Learning

Parket uses **TensorFlow.js** to provide intelligent features:

- **Availability Prediction**: Predicts parking spot availability based on time, location, and patterns
- **Smart Recommendations**: Ranks parking locations using ML-powered scoring
- **AI Insights**: Real-time recommendations and predictions displayed in the app

For detailed ML documentation, see [ML_INTEGRATION.md](ML_INTEGRATION.md)

---

## 📁 Project Structure

```
Parket/
├── src/
│   ├── components/        # React components
│   ├── ml/               # Machine Learning modules
│   ├── App.tsx           # Main app
│   └── main.tsx          # Entry point
├── package.json          # Dependencies
└── vite.config.ts        # Build config
```

---

## 💡 Tips

- Press **h** in the terminal while the dev server runs for more options
- Changes to files automatically reload in your browser
- The app runs locally - no internet needed (except for first setup)

---

**Created by:** Hans Carlo C. Cruz

**Questions?** Check the issues or create a new one!
