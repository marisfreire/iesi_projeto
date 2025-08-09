
if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
fi


echo "Activating virtual environment..."
. .venv/bin/activate

if ! pip show -q -r ./backend/requirements.txt; then
  pip install -r ./backend/requirements.txt
fi

python3 ./backend/app.py &
BACKEND_PID=$!

# === Frontend Setup ===
cd frontend || exit

if [ ! -d "node_modules" ]; then
  npm install
fi

cleanup() {
  if ps -p $BACKEND_PID > /dev/null; then
    kill $BACKEND_PID
  fi
  exit 0
}

npm start
trap cleanup SIGINT SIGTERM EXIT
