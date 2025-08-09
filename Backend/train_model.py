import pandas as pd
from prophet import Prophet
import joblib
import logging
import os
import pandas as pd
from data_agent import DataAgent
from datetime import date, timedelta

# Enable logging
logging.basicConfig(level=logging.INFO)

def create_training_data(agent, districts, start_date, end_date):
    """
    Creates a training dataset by fetching data for a range of dates and districts.
    """
    all_data = []
    current_date = start_date
    while current_date <= end_date:
        for district in districts:
            logging.info(f"Fetching data for {district} on {current_date.strftime('%Y-%m-%d')}...")
            data = agent.get_data_for_district(district, current_date.strftime('%Y-%m-%d'))
            if data:
                data['District'] = district
                data['Date'] = current_date
                all_data.append(data)
        current_date += timedelta(days=1)
    
    return pd.DataFrame(all_data)

def train_and_save_models():
    """
    Trains Prophet models for load, price, and blackout risk for each district
    and saves them to a file.
    """
    gemini_api_key = os.environ.get("GEMINI_API_KEY")
    if not gemini_api_key:
        logging.error("GEMINI_API_KEY environment variable not set.")
        return

    agent = DataAgent(api_key=gemini_api_key)
    
    # Define the districts and date range for training data
    districts = ["Kolkata", "Mumbai", "Delhi", "Chennai", "Bangalore"]  # Example districts
    end_date = date.today()
    start_date = end_date - timedelta(days=30)  # Use 30 days of data for training

    # Create the training data
    training_data = create_training_data(agent, districts, start_date, end_date)
    
    if training_data.empty:
        logging.error("No training data could be created. Aborting model training.")
        return

    # Create a dictionary for installed capacity lookup
    # This should also be dynamic, but for now we'll use a placeholder
    installed_capacity = {
        "Kolkata": 2000,
        "Mumbai": 5000,
        "Delhi": 7000,
        "Chennai": 3000,
        "Bangalore": 4000,
    }

    # Train Prophet models for each district
    models = {}
    for district in districts:
        logging.info(f"Training models for {district}...")
        district_data = training_data[training_data['District'] == district].copy()
        
        if district_data.empty:
            logging.warning(f"No training data for {district}. Skipping.")
            continue

        # Load Demand Model
        load_model = Prophet()
        load_model.add_regressor('Price (₹/unit)')
        load_model.add_regressor('Installed Capacity (MW)')
        load_model.fit(district_data.rename(columns={'Date': 'ds', 'Load Demand (MW)': 'y'}))

        # Price Model
        price_model = Prophet()
        price_model.add_regressor('Load Demand (MW)')
        price_model.fit(district_data.rename(columns={'Date': 'ds', 'Price (₹/unit)': 'y'}))

        # Blackout Risk Model
        blackout_model = Prophet()
        blackout_model.add_regressor('Load Demand (MW)')
        blackout_model.add_regressor('Installed Capacity (MW)')
        blackout_model.fit(district_data.rename(columns={'Date': 'ds', 'Blackout Risk (%)': 'y'}))

        models[district] = {
            'load': load_model,
            'price': price_model,
            'blackout': blackout_model
        }

    # Save the models and installed capacity to files
    joblib.dump(models, 'prophet_models.pkl')
    joblib.dump(installed_capacity, 'installed_capacity.pkl')
    logging.info("Models and installed capacity have been trained and saved successfully.")

if __name__ == '__main__':
    train_and_save_models()