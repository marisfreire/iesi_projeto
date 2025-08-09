:: Create virtual environment
python -m venv .venv

:: Activate virtual environment
call .venv\Scripts\activate.bat

:: Run backend
pip install -r backend\requirements.txt
start cmd /k python backend\app.py

:: Run frontend
cd frontend
npm start
