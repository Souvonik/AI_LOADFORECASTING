
# Load Forecaster

**Load Forecaster** is a web application that visualizes **solar daily generation** and **estimated daily savings** for selected cities based on their load demand and electricity price data. It features an interactive map centered on West Bengal, India, to provide insights into local solar energy potential and cost savings.

---

## Features

- **Solar Generation Estimates**  
  Displays daily solar power generation projections for selected cities.

- **Estimated Daily Savings**  
  Calculates daily cost savings by comparing solar generation with load demand and local electricity prices.

- **Interactive Map Interface**  
  Easily select cities on a flat map focused on India for comparative analysis.

- **Dynamic Data Visualization**  
  Presents charts and metrics showing load demand, solar generation, price trends, and estimated savings.
  
- **AI COPILOT**
  Answers any query you have regarding the metrics

---

## Technology Stack

- **Frontend:** React.js, TypeScript, Vite  
- **Backend:** Python, Flask  
- **Mapping:** Leaflet.js with OpenStreetMap tiles  
- **Data Processing:** Custom algorithms using synthetic and real load and price datasets

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)  
- [npm](https://www.npmjs.com/) (comes with Node.js)  
- Python 3.7+  
- pip (Python package manager)  
- Docker (optional, for containerized deployment)

---

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/AI_LOADFORECASTING.git
   cd AI_LOADFORECASTING
   ```

2. **Frontend setup**

   Install dependencies and start the development server:

   ```bash
   npm install
   npm run dev
   ```

   This will start the frontend on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is busy).

3. **Backend setup**

   Navigate to the backend folder if applicable (or project root), then:

   - Create and activate a virtual environment (optional but recommended):

     ```bash
     python -m venv venv
     # Windows
     venv\Scripts\activate
     # macOS/Linux
     source venv/bin/activate
     ```

   - Install Python dependencies:

     ```bash
     pip install -r requirements.txt
     ```

   - Run the Flask backend server:

     ```bash
     python app.py
     ```

4. **Configure Frontend Backend API URL**

   Ensure the frontend API requests point to your backend server (e.g., `http://localhost:5000`). This can be configured in a `.env` file or frontend config depending on your setup.

---

## Environment Variables (`.env`)

Create a `.env` file in the backend root folder with the following variables (example):

```env
FLASK_ENV=development
FLASK_DEBUG=1
SECRET_KEY=your_secret_key_here
API_BASE_URL=http://localhost:5000/api
```

Adjust values as needed for production or development.

---

## Sample `requirements.txt`

```text
Flask==2.2.2
flask-cors==3.0.10
numpy==1.24.2
pandas==1.5.3
scikit-learn==1.2.1
requests==2.28.1
```

---

## Docker Deployment (Optional)

You can run the backend and frontend inside Docker containers.

### Dockerfile for Backend

Create a `Dockerfile` in the backend folder:

```Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0

EXPOSE 5000

CMD ["flask", "run"]
```

### Dockerfile for Frontend

Create a `Dockerfile` in the frontend folder:

```Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

### Running with Docker Compose

Create a `docker-compose.yml` at the root of the project:

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

Start both services with:

```bash
docker-compose up --build
```

---

## Data & Calculations

- **Solar Generation**  
  Estimated from local solar irradiance data, panel capacity assumptions, and typical weather patterns.

- **Estimated Savings**  
  Calculated by comparing solar-generated energy with the city’s load demand and prevailing electricity prices, providing a projection of cost savings.

---

## Usage

- Open the app in your browser.  
- Use the interactive map to select cities of interest.  
- View daily solar generation estimates and potential savings.  
- Explore charts for detailed load, price, and generation data.

---

## Future Improvements

- Integrate real-time weather and solar panel efficiency data for better accuracy.  
- Add hourly solar and load predictions.  
- Expand coverage beyond West Bengal to other regions.  
- Allow user-uploaded load and price data for personalized forecasts.  
- Enhance UI with more detailed visualizations and comparisons.

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository.  
2. Create your feature branch (`git checkout -b feature/your-feature`).  
3. Commit your changes (`git commit -m 'Add some feature'`).  
4. Push to the branch (`git push origin feature/your-feature`).  
5. Open a pull request.

---




## Acknowledgements

- OpenStreetMap contributors for map data  
- React, Vite, Flask communities for amazing tools and frameworks

---

