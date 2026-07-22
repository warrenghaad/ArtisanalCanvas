from __future__ import annotations

import hashlib
import re
from datetime import datetime
from pathlib import Path
from uuid import uuid4

from canonforge.models import IngestedSource, SourceCard, utc_now

SUPPORTED_SUFFIXES = {".md", ".markdown", ".txt"}


class IngestionError(ValueError):
    """Raised when an ingestion target is missing or unreadable."""


def discover_sources(target: Path) -> list[Path]:
    target = target.expanduser().resolve()
    if not target.exists():
        raise IngestionError(f"Ingestion target does not exist: {target}")
    if target.is_file():
        return [target] if target.suffix.lower() in SUPPORTED_SUFFIXES else []
    if not target.is_dir():
        raise IngestionError(f"Ingestion target is not a file or directory: {target}")
    return sorted(
        path
        for path in target.rglob("*")
        if path.is_file()
        and path.suffix.lower() in SUPPORTED_SUFFIXES
        and ".canonforge" not in path.parts
    )


def ingest_file(
    path: Path, workspace_root: Path, ingested_at: datetime | None = None
) -> IngestedSource:
    try:
        raw = path.read_bytes()
        text = raw.decode("utf-8-sig")
    except (OSError, UnicodeError) as exc:
        raise IngestionError(f"Could not read {path}: {exc}") from exc

    source_type = "markdown" if path.suffix.lower() in {".md", ".markdown"} else "text"
    try:
        source_path = path.resolve().relative_to(workspace_root.resolve()).as_posix()
    except ValueError:
        source_path = str(path.resolve())

    card = SourceCard(
        source_id=str(uuid4()),
        source_path=source_path,
        source_type=source_type,
        title=_extract_title(text, path),
        date_ingested=ingested_at or utc_now(),
        summary=_extract_summary(text),
        domains=[],
        content_hash=hashlib.sha256(raw).hexdigest(),
    )
    return IngestedSource(path=path.resolve(), card=card)


def _extract_title(text: str, path: Path) -> str:
    if path.suffix.lower() in {".md", ".markdown"}:
        for line in text.splitlines():
            match = re.match(r"^#\s+(.+?)\s*$", line)
            if match:
                return match.group(1).strip()
    return path.stem.replace("-", " ").replace("_", " ").strip()


def _extract_summary(text: str, limit: int = 280) -> str:
    cleaned_lines = []
    in_frontmatter = False
    for index, line in enumerate(text.splitlines()):
        stripped = line.strip()
        if index == 0 and stripped == "---":
            in_frontmatter = True
            continue
        if in_frontmatter:
            if stripped == "---":
                in_frontmatter = False
            continue
        if stripped.startswith("#") or stripped.startswith("```"):
            continue
        cleaned_lines.append(stripped)

    paragraphs = re.split(r"\n\s*\n", "\n".join(cleaned_lines))
    summary = next((re.sub(r"\s+", " ", p).strip() for p in paragraphs if p.strip()), "")
    if len(summary) <= limit:
        return summary
    return summary[: limit - 1].rstrip() + "…"
