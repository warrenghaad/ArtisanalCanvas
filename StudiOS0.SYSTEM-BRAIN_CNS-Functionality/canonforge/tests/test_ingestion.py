from datetime import UTC, datetime
from pathlib import Path

from canonforge.ingestion import discover_sources, ingest_file


def test_discovery_is_recursive_filtered_and_deterministic(tmp_path: Path) -> None:
    (tmp_path / "nested").mkdir()
    (tmp_path / "nested" / "b.txt").write_text("B", encoding="utf-8")
    (tmp_path / "a.md").write_text("# A", encoding="utf-8")
    (tmp_path / "ignored.json").write_text("{}", encoding="utf-8")

    assert [path.name for path in discover_sources(tmp_path)] == ["a.md", "b.txt"]


def test_markdown_ingestion_builds_source_card(tmp_path: Path) -> None:
    source_path = tmp_path / "source.md"
    source_path.write_text("# Canon Title\n\nFirst paragraph.\n\nSecond.", encoding="utf-8")
    moment = datetime(2026, 7, 21, tzinfo=UTC)

    source = ingest_file(source_path, tmp_path, moment)

    assert source.card.title == "Canon Title"
    assert source.card.summary == "First paragraph."
    assert source.card.source_path == "source.md"
    assert source.card.source_type == "markdown"
    assert len(source.card.content_hash) == 64
