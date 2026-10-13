# Kallos — Employer Branding Analysis Platform

Kallos is a Flask-based platform designed to help HR professionals in small and medium-sized companies **evaluate and enhance their employer brand**.  
It integrates **data analytics**, **NLP**, and **Large Language Models (LLMs)** to provide a holistic understanding of company reputation, employee sentiment, and benchmarking insights.


##  Overview

Kallos combines:
- **Flask** for the backend web application
- **PostgreSQL** (managed via **DBeaver**) for data storage
- **LM Studio** for local Large Language Model (LLM) inference
- **PyNaCl** for secure encryption of sensitive data

The result is a secure, intelligent, and modular platform for analyzing HR data and generating actionable insights.


## Repository Structure
- **`app.py`** – Main entry point that initializes the Flask app.  
- **`models.py`** – Contains SQLAlchemy models for database tables.  
- **`routes/`** – Defines API endpoints and application logic.  
- **`templates/`** – Jinja2 templates used to render HTML pages.  
- **`static/`** – Static assets such as CSS, JS, and images.  
- **`requirements.txt`** – Lists Python dependencies.  
- **`.env.example`** – Template for environment variables.  
- **`schema.sql`** – SQL script to create and seed the database.  
- **`README.md`** – Project documentation (this file).  

## Features

- **Holistic Analysis** — evaluate all aspects of an employer brand  
- **Data Integration** — combine surveys, web data, and internal questions  
- **AI-Powered Insights** — sentiment and NLP analysis powered by LM Studio LLMs  
- **Benchmarking** — compare performance with industry standards  
- **Secure Storage** — sensitive data encrypted with PyNaCl  
- **User Dashboard** — interactive charts, KPIs, and recommendations  

## Setup & Installation

Follow these steps to set up and run the Kallos Flask application locally.

### 1. Clone the Repository
Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/kallos.git
cd kallos
```

### 2. Create a Virtual Environment

It’s recommended to use a Python virtual environment to manage dependencies.

```bash
Windows: venv\Scripts\activate
macOS/Linux: source venv/bin/activate
```

### 3. Install Dependencies

Install the required Python packages listed in requirements.txt.

```bash
pip install -r requirements.txt
```

### 4. Configure Enviornment Variables

Create a .env file in the root directory based on .env.example:

```bash
FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/kallos
LM_STUDIO_API_URL=http://localhost:1234/v1/chat/completions
SECRET_KEY=your_secret_key
```

### 5. Set Up the Database

Create the PostgreSQL database and apply the schema:

```bash
psql -U your_username -d kallos_db -f schema.sql
```

### 6. Start LM Studio

1. Launch LM Studio and start the local server (default: http://localhost:1234)

2. Load your preferred model (e.g. mistral, llama3)

3. Make sure the .env variable LM_STUDIO_API_URL matches your LM Studio server address

### 7. Run the Application

Start the Flask development server:

```bash
flask run
```
The app will be available at:
 http://localhost:5000
 
