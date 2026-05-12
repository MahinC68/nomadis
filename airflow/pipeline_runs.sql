-- Run once to create the pipeline_runs table in nomadis_db.
-- The DAG also creates it idempotently on first run, so this is optional
-- but useful if you want the table to exist before the first DAG execution.

CREATE TABLE IF NOT EXISTS pipeline_runs (
    id               SERIAL PRIMARY KEY,
    run_timestamp    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    pois_checked     INTEGER      NOT NULL DEFAULT 0,
    pois_flagged     INTEGER      NOT NULL DEFAULT 0,
    trips_updated    INTEGER      NOT NULL DEFAULT 0,
    duration_seconds NUMERIC(10,2),
    status           VARCHAR(20)  NOT NULL DEFAULT 'success',
    notes            TEXT
);

-- Optional index for querying recent runs quickly
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_timestamp
    ON pipeline_runs (run_timestamp DESC);
