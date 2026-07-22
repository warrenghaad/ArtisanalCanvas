from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from pydantic import BaseModel


def utc_now() -> datetime:
    return datetime.now(UTC)


class SourceCard(BaseModel):
    source_id: str
    source_path: str
    source_type: str
    title: str
    date_ingested: datetime
    summary: str
    domains: list[str]
    extraction_status: str = "ingested"
    content_hash: str


class IngestedSource(BaseModel):
    path: Path
    card: SourceCard
