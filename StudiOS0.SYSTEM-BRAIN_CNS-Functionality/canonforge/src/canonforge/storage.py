from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator
from uuid import uuid4

from canonforge.models import SourceCard, utc_now
from canonforge.contracts import TaskPacket, WorkOrder

SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    started_at TEXT NOT NULL,
    finished_at TEXT,
    workspace TEXT NOT NULL,
    user_goal TEXT NOT NULL,
    status TEXT NOT NULL,
    source_count INTEGER NOT NULL DEFAULT 0,
    error TEXT
);

CREATE TABLE IF NOT EXISTS sources (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES runs(id),
    path TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    hash TEXT NOT NULL,
    status TEXT NOT NULL,
    summary TEXT NOT NULL,
    ingested_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_sources_run_id ON sources(run_id);
CREATE INDEX IF NOT EXISTS idx_runs_started_at ON runs(started_at DESC);

CREATE TABLE IF NOT EXISTS task_packets (
    id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES runs(id),
    raw_request TEXT NOT NULL,
    payload_json TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS work_orders (
    task_id TEXT PRIMARY KEY,
    run_id TEXT NOT NULL REFERENCES runs(id),
    write_mode TEXT NOT NULL,
    payload_json TEXT NOT NULL
);
"""


class RunStore:
    def __init__(self, database_path: Path):
        self.database_path = database_path

    @contextmanager
    def connect(self) -> Iterator[sqlite3.Connection]:
        connection = sqlite3.connect(self.database_path)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            yield connection
            connection.commit()
        finally:
            connection.close()

    def initialize(self) -> None:
        with self.connect() as connection:
            connection.executescript(SCHEMA)

    def start_run(self, workspace: Path, user_goal: str, run_type: str = "ingest") -> str:
        run_id = str(uuid4())
        with self.connect() as connection:
            connection.execute(
                "INSERT INTO runs (id, started_at, workspace, user_goal, status) VALUES (?, ?, ?, ?, ?)",
                (run_id, utc_now().isoformat(), str(workspace), user_goal, "running"),
            )
        return run_id

    def add_plan(self, run_id: str, packet: TaskPacket, order: WorkOrder) -> None:
        with self.connect() as connection:
            connection.execute(
                "INSERT INTO task_packets (id, run_id, raw_request, payload_json) VALUES (?, ?, ?, ?)",
                (packet.task_id, run_id, packet.raw_request, packet.model_dump_json()),
            )
            connection.execute(
                """INSERT INTO work_orders (task_id, run_id, write_mode, payload_json)
                   VALUES (?, ?, ?, ?)""",
                (packet.task_id, run_id, order.write_mode.value, order.model_dump_json()),
            )

    def get_plan(self, task_id: str) -> tuple[TaskPacket, WorkOrder] | None:
        with self.connect() as connection:
            row = connection.execute(
                """SELECT task_packets.payload_json, work_orders.payload_json
                   FROM task_packets JOIN work_orders USING (run_id)
                   WHERE task_packets.id = ? AND work_orders.task_id = ?""",
                (task_id, task_id),
            ).fetchone()
        if row is None:
            return None
        return TaskPacket.model_validate_json(row[0]), WorkOrder.model_validate_json(row[1])

    def add_source(self, run_id: str, card: SourceCard) -> None:
        with self.connect() as connection:
            connection.execute(
                """INSERT INTO sources
                   (id, run_id, path, type, title, hash, status, summary, ingested_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    card.source_id,
                    run_id,
                    card.source_path,
                    card.source_type,
                    card.title,
                    card.content_hash,
                    card.extraction_status,
                    card.summary,
                    card.date_ingested.isoformat(),
                ),
            )

    def finish_run(
        self, run_id: str, status: str, source_count: int, error: str | None = None
    ) -> None:
        with self.connect() as connection:
            connection.execute(
                """UPDATE runs
                   SET finished_at = ?, status = ?, source_count = ?, error = ?
                   WHERE id = ?""",
                (utc_now().isoformat(), status, source_count, error, run_id),
            )

    def list_runs(self, limit: int = 20) -> list[sqlite3.Row]:
        with self.connect() as connection:
            return list(
                connection.execute(
                    """SELECT id, started_at, status, source_count, user_goal
                       FROM runs ORDER BY started_at DESC LIMIT ?""",
                    (limit,),
                )
            )

    def counts(self) -> tuple[int, int]:
        with self.connect() as connection:
            runs = int(connection.execute("SELECT COUNT(*) FROM runs").fetchone()[0])
            sources = int(connection.execute("SELECT COUNT(*) FROM sources").fetchone()[0])
        return runs, sources
