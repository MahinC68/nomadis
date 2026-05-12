"""
Nomadis nightly pipeline, runs daily at midnight.

Tasks:
  1. data_quality_check       — scan pois for all-zero/null scores
  2. recalculate_match_scores — recompute avg_match_score on every trip
  3. log_pipeline_run         — write summary row to pipeline_runs
"""

import os
import time
from datetime import datetime, timedelta
from pathlib import Path

import psycopg2
from dotenv import load_dotenv

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.utils.trigger_rule import TriggerRule

# Database connection

# airflow/dags/ -> airflow/ -> project root -> backend/.env
_env_path = Path(__file__).resolve().parent.parent.parent / "backend" / ".env"
load_dotenv(_env_path)

_DB = {
    "host":     os.getenv("POSTGRES_HOST", "localhost"),
    "port":     int(os.getenv("POSTGRES_PORT", 5432)),
    "dbname":   os.getenv("POSTGRES_DB", "nomadis_db"),
    "user":     os.getenv("POSTGRES_USER", "postgres"),
    "password": os.getenv("POSTGRES_PASSWORD", ""),
}


def _conn():
    return psycopg2.connect(**_DB)


def _ensure_pipeline_runs_table():
    with _conn() as cn, cn.cursor() as cur:
        cur.execute("""
            CREATE TABLE IF NOT EXISTS pipeline_runs (
                id               SERIAL PRIMARY KEY,
                run_timestamp    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                pois_checked     INTEGER     NOT NULL DEFAULT 0,
                pois_flagged     INTEGER     NOT NULL DEFAULT 0,
                trips_updated    INTEGER     NOT NULL DEFAULT 0,
                duration_seconds NUMERIC(10,2),
                status           VARCHAR(20) NOT NULL DEFAULT 'success',
                notes            TEXT
            )
        """)
        cn.commit()


# Data quality check

def data_quality_check(**context):
    """Count POIs where every feature score is zero or NULL."""
    ti = context["ti"]
    ti.xcom_push(key="pipeline_start", value=time.time())

    with _conn() as cn, cn.cursor() as cur:
        cur.execute("SELECT COUNT(*) FROM pois")
        total = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(*) FROM pois
            WHERE COALESCE(adventure_score,   0) = 0
              AND COALESCE(culture_score,     0) = 0
              AND COALESCE(relaxation_score,  0) = 0
              AND COALESCE(nightlife_score,   0) = 0
              AND COALESCE(nature_score,      0) = 0
              AND COALESCE(food_score,        0) = 0
        """)
        flagged = cur.fetchone()[0]

    ti.xcom_push(key="pois_checked", value=total)
    ti.xcom_push(key="pois_flagged", value=flagged)
    print(f"[data_quality_check] checked={total}  flagged={flagged}")


# Recalculate match scores

def recalculate_match_scores(**context):
    """
    Re-derive avg_match_score for every trip from its stored itinerary_json.
    The JSON structure is:
      { "days": [ { "activities": [ { "match_score": float }, ... ] } ] }
    """
    ti = context["ti"]
    updated = 0

    with _conn() as cn, cn.cursor() as cur:
        cur.execute(
            "SELECT id, itinerary_json FROM trips WHERE itinerary_json IS NOT NULL"
        )
        rows = cur.fetchall()

        for trip_id, itinerary in rows:
            if not itinerary or "days" not in itinerary:
                continue

            scores = [
                act["match_score"]
                for day in itinerary["days"]
                for act in day.get("activities", [])
                if isinstance(act.get("match_score"), (int, float))
            ]
            if not scores:
                continue

            avg = round(sum(scores) / len(scores), 1)
            cur.execute(
                "UPDATE trips SET avg_match_score = %s WHERE id = %s",
                (avg, trip_id),
            )
            updated += 1

        cn.commit()

    ti.xcom_push(key="trips_updated", value=updated)
    print(f"[recalculate_match_scores] trips updated={updated}")


# Log pipeline run

def log_pipeline_run(**context):
    """Write a summary row to pipeline_runs; infers status from upstream states."""
    _ensure_pipeline_runs_table()

    ti       = context["ti"]
    dag_run  = context["dag_run"]

    # Pull metrics pushed by upstream tasks
    pipeline_start = ti.xcom_pull(task_ids="data_quality_check",       key="pipeline_start") or time.time()
    pois_checked   = ti.xcom_pull(task_ids="data_quality_check",       key="pois_checked")   or 0
    pois_flagged   = ti.xcom_pull(task_ids="data_quality_check",       key="pois_flagged")   or 0
    trips_updated  = ti.xcom_pull(task_ids="recalculate_match_scores", key="trips_updated")  or 0
    duration       = round(time.time() - pipeline_start, 2)

    # Determine overall run status from upstream task states
    t1 = dag_run.get_task_instance("data_quality_check")
    t2 = dag_run.get_task_instance("recalculate_match_scores")
    all_ok = (
        t1 and t1.state == "success" and
        t2 and t2.state == "success"
    )
    status = "success" if all_ok else "failed"

    notes_parts = []
    if pois_flagged:
        notes_parts.append(f"{pois_flagged} zero-score POI(s) detected")
    if not all_ok:
        failed = [t.task_id for t in [t1, t2] if t and t.state != "success"]
        notes_parts.append(f"failed tasks: {', '.join(failed)}")
    notes = "; ".join(notes_parts) or None

    with _conn() as cn, cn.cursor() as cur:
        cur.execute("""
            INSERT INTO pipeline_runs
                (pois_checked, pois_flagged, trips_updated, duration_seconds, status, notes)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (pois_checked, pois_flagged, trips_updated, duration, status, notes))
        cn.commit()

    print(
        f"[log_pipeline_run] status={status}  checked={pois_checked}  "
        f"flagged={pois_flagged}  trips_updated={trips_updated}  "
        f"duration={duration}s  notes={notes}"
    )


# DAG

default_args = {
    "owner":            "nomadis",
    "retries":          1,
    "retry_delay":      timedelta(minutes=5),
    "email_on_failure": False,
}

with DAG(
    dag_id="nomadis_nightly",
    description="Nightly data quality check and match-score recalculation",
    schedule_interval="0 0 * * *",
    start_date=datetime(2025, 1, 1),
    catchup=False,
    default_args=default_args,
    tags=["nomadis", "nightly"],
) as dag:

    t1 = PythonOperator(
        task_id="data_quality_check",
        python_callable=data_quality_check,
    )

    t2 = PythonOperator(
        task_id="recalculate_match_scores",
        python_callable=recalculate_match_scores,
    )

    t3 = PythonOperator(
        task_id="log_pipeline_run",
        python_callable=log_pipeline_run,
        trigger_rule=TriggerRule.ALL_DONE,  # runs even if t1/t2 fail
    )

    t1 >> t2 >> t3
