# Parket Machine Learning System 🧠

This folder contains the machine learning implementation for the Parket smart parking app, including data, training notebooks, and prediction models.

## 📁 Contents

- `parking_historical_data.csv` - Historical parking occupancy data
- `parking_ml_training.ipynb` - Jupyter notebook for ML model training
- `requirements.txt` - Python dependencies for ML training
- `README.md` - This file

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Jupyter Notebook or JupyterLab

### Installation

1. **Create a virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**:
   ```bash
   cd ml
   pip install -r requirements.txt
   ```

3. **Launch Jupyter Notebook**:
   ```bash
   jupyter notebook
   ```

4. **Open and run** `parking_ml_training.ipynb`

## 📊 Dataset

### Historical Parking Data (`parking_historical_data.csv`)

Contains historical parking occupancy data with the following features:

| Column | Description | Type |
|--------|-------------|------|
| `location` | Parking location name | String |
| `day_of_week` | Day of week (0=Monday, 6=Sunday) | Integer (0-6) |
| `hour` | Hour of day | Integer (6-21) |
| `month` | Month of year | Integer (1-12) |
| `occupancy_rate` | Parking occupancy rate | Float (0-1) |
| `available_spots` | Number of available spots | Integer |
| `total_spots` | Total parking capacity | Integer |
| `is_holiday` | Whether it's a holiday | Boolean (0/1) |
| `weather` | Weather condition | String |
| `temperature` | Temperature in Celsius | Float |

**Locations covered:**
- SM Dasmarinas
- Mall of Asia
- Glorietta 3
- Ayala Malls Pasay
- Waltermart
- St. Luke's Hospital

**Time coverage:** 6 AM - 9 PM, all days of the week

## 🤖 ML Model

### Architecture

- **Algorithm**: Random Forest Regressor
- **Task**: Predict parking occupancy rate
- **Input Features**: 
  - Location (encoded)
  - Day of week
  - Hour of day
  - Month
  - Holiday indicator
  - Weather conditions
  - Temperature
  - Cyclical features (sin/cos encodings for time)

### Performance Metrics

- **R² Score**: ~94.5%
- **MAE**: ~0.043
- **RMSE**: ~0.058

### Model Outputs

The model generates:
1. **Peak Hours Analysis** - When parking lots are most crowded
2. **Best Parking Times** - Optimal times to find spots
3. **Hourly Predictions** - Occupancy forecasts for each hour
4. **Smart Route Recommendations** - Optimal parking spot selection

## 📈 Training the Model

Run all cells in `parking_ml_training.ipynb` sequentially. The notebook will:

1. **Load and explore data**
2. **Visualize patterns** (peak hours, weekend vs weekday)
3. **Feature engineering** (cyclical encodings)
4. **Train Random Forest model**
5. **Evaluate performance**
6. **Generate predictions** for all locations
7. **Export results** to JSON

### Output Files

After training, the following files will be generated:

- `parking_model.pkl` - Trained ML model
- `location_encoder.pkl` - Location label encoder
- `weather_encoder.pkl` - Weather label encoder
- `parking_predictions.json` - Predictions for web app *(already included in `/public`)*
- `peak_hours_analysis.png` - Visualization of peak hours
- `weekend_vs_weekday.png` - Weekend vs weekday patterns
- `feature_importance.png` - Feature importance chart
- `heatmap_*.png` - Heatmaps for each location

## 🌐 Integration with React App

The predictions are consumed by the React app through:

1. **JSON File**: `/public/parking_predictions.json` contains pre-computed predictions
2. **ML Service**: `src/services/mlPredictionService.ts` loads and processes predictions
3. **UI Components**:
   - `PeakHoursChart.tsx` - Displays peak hours visualization
   - `BestTimeSuggestions.tsx` - Shows optimal parking times
   - `SmartSlotRecommendation.tsx` - ML-powered slot selection

## 🔮 Key Insights

Based on the ML analysis:

- **Peak Times**: Friday-Sunday, 12 PM - 6 PM (40-50% higher occupancy)
- **Best Times**: Early morning (6-8 AM) and late evening (8-9 PM)
- **Weekend Impact**: Significantly higher occupancy on weekends
- **Location Variance**: Mall of Asia and Glorietta 3 show highest peak occupancy

## 🛠️ Customization

### Adding New Locations

1. Add data to `parking_historical_data.csv` with the same column structure
2. Retrain the model by running the notebook
3. Export updated predictions

### Adjusting Model Parameters

Modify these variables in the notebook:

```python
rf_model = RandomForestRegressor(
    n_estimators=200,      # Number of trees
    max_depth=15,          # Maximum depth
    min_samples_split=5,   # Minimum samples to split
    random_state=42
)
```

### Changing Prediction Scope

Adjust the hour range in the prediction generation cells:

```python
for hour in range(6, 22):  # Change range as needed
    # prediction logic
```

## 📚 Dependencies

Core libraries used:

- **pandas** - Data manipulation
- **numpy** - Numerical operations  
- **scikit-learn** - Machine learning algorithms
- **matplotlib** - Visualization
- **seaborn** - Statistical visualizations
- **jupyter** - Interactive notebook environment

## 🐛 Troubleshooting

### Model not loading
- Ensure all pickle files are in the `ml/` folder
- Check Python version compatibility (3.8+)

### Poor predictions
- Verify CSV data format matches schema
- Check for missing or null values
- Ensure sufficient historical data (recommended: 3+ months)

### Visualization errors
- Update matplotlib to latest version: `pip install --upgrade matplotlib`
- Check display settings in Jupyter

## 📊 Future Enhancements

Planned improvements:

- [ ] Real-time data integration
- [ ] Deep learning models (LSTM for temporal patterns)
- [ ] Weather API integration
- [ ] Multi-location optimization
- [ ] Parking price prediction
- [ ] Event-based predictions

## 📄 License

This ML system is part of the Parket project. See main README for license information.

## 👤 Author

**Hans Carlo C. Cruz**  
Email: cruzhc@students.nu-dasma.edu.ph

---

**Last Updated**: February 20, 2026  
**Model Version**: 1.0  
**Training Data**: January 2026
