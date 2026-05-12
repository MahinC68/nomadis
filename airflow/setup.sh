#!/usr/bin/env bash
# Nomadis Airflow setup — run once from inside WSL.
# Usage: cd /path/to/nomadis && bash airflow/setup.sh

set -euo pipefail

AIRFLOW_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export AIRFLOW_HOME="$AIRFLOW_DIR"

AIRFLOW_VERSION="2.9.3"
PYTHON_VERSION="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')"
CONSTRAINT_URL="https://raw.githubusercontent.com/apache/airflow/constraints-${AIRFLOW_VERSION}/constraints-${PYTHON_VERSION}.txt"

echo ">>> Creating Python venv at $AIRFLOW_DIR/venv"
python3 -m venv "$AIRFLOW_DIR/venv"
source "$AIRFLOW_DIR/venv/bin/activate"

echo ">>> Installing Airflow ${AIRFLOW_VERSION} (Python ${PYTHON_VERSION})"
pip install --quiet --upgrade pip
pip install --quiet "apache-airflow==${AIRFLOW_VERSION}" --constraint "$CONSTRAINT_URL"
pip install --quiet psycopg2-binary python-dotenv

echo ">>> Initialising Airflow metadata DB (SQLite)"
airflow db init

echo ">>> Creating admin user  (login: admin / admin)"
airflow users create \
    --username admin \
    --firstname Nomadis \
    --lastname Admin \
    --role Admin \
    --email admin@nomadis.local \
    --password admin 2>/dev/null || echo "(user already exists — skipped)"

echo ""
echo "======================================================"
echo "  Setup complete. To run Airflow, open two terminals:"
echo "======================================================"
echo ""
echo "  Terminal 1 — scheduler:"
echo "    export AIRFLOW_HOME=$AIRFLOW_DIR"
echo "    source $AIRFLOW_DIR/venv/bin/activate"
echo "    airflow scheduler"
echo ""
echo "  Terminal 2 — web UI:"
echo "    export AIRFLOW_HOME=$AIRFLOW_DIR"
echo "    source $AIRFLOW_DIR/venv/bin/activate"
echo "    airflow webserver --port 8080"
echo ""
echo "  Then open: http://localhost:8080  (admin / admin)"
echo ""
