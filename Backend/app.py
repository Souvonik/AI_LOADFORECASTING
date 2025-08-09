from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import logging
import os
from data_agent import DataAgent

app = Flask(__name__)
CORS(app)

# Enable logging
logging.basicConfig(level=logging.INFO)

# Initialize the Data Agent
gemini_api_key = os.environ.get("AIzaSyAvwkP3u0wvx5sDOYNUWaPRAMbe6HDtWmw")
if not gemini_api_key:
    logging.error("GEMINI_API_KEY environment variable not set.")
    data_agent = None
else:
    data_agent = DataAgent(api_key=gemini_api_key)

# Load the trained models and installed capacity data
try:
    models = joblib.load('prophet_models.pkl')
    installed_capacity = joblib.load('installed_capacity.pkl')
except FileNotFoundError:
    models = None
    installed_capacity = None
    logging.error("Model or data files not found. Please run train_model.py first.")

@app.route('/predict', methods=['POST'])
def predict():
    if not models or not installed_capacity:
        return jsonify({'error': 'Models not trained yet. Please run the training script.'}), 503

    if not data_agent:
        return jsonify({'error': 'Data agent not initialized. Check API key.'}), 503

    req_data = request.get_json()
    district = req_data.get('district')
    future_date = req_data.get('date')

    if not district or not future_date:
        return jsonify({'error': 'Missing district or date'}), 400

    if district not in models:
        return jsonify({'error': 'Invalid district'}), 400

    try:
        # Get dynamic data from the agent
        dynamic_data = data_agent.get_data_for_district(district, future_date)
        if not dynamic_data:
            return jsonify({'error': 'Could not retrieve data for the district.'}), 500

        future_date = pd.to_datetime(future_date)
        future = pd.DataFrame({'ds': [future_date]})

        installed_capacity_value = installed_capacity.get(district)
        if installed_capacity_value is None:
            return jsonify({'error': 'Installed capacity not found for the district'}), 400

        # Predict Load Demand
        # This part needs to be updated based on the data provided by the agent
        # For now, we'll use placeholder values
        future['Price (₹/unit)'] = dynamic_data.get('price', 10) # Placeholder
        future['Installed Capacity (MW)'] = installed_capacity_value
        load_pred = models[district]['load'].predict(future)['yhat'].iloc[0]

        # Predict Price
        future['Load Demand (MW)'] = load_pred
        price_pred = models[district]['price'].predict(future)['yhat'].iloc[0]

        # Predict Blackout Risk
        future['Installed Capacity (MW)'] = installed_capacity_value
        blackout_pred = models[district]['blackout'].predict(future)['yhat'].iloc[0]

        response = {
            'district': district,
            'date': future_date.strftime('%Y-%m-%d'),
            'load': round(load_pred, 2),
            'price': round(price_pred, 2),
            'blackout_chance': round(blackout_pred, 2),
        }

        return jsonify(response)

    except Exception as e:
        logging.error(f"Prediction error: {e}")
        return jsonify({'error': 'Prediction failed', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)