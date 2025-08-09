# Ativando o ambiente virtual
python3 -m venv .venv
. .venv/bin/activate


# Rodando backend
pip install -r ./backend/requirements.txt
python3 ./backend/app.py &

# Rodando frontend
cd frontend
npm start 