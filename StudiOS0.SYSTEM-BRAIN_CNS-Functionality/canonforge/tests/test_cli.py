from pathlib import Path

from typer.testing import CliRunner

from canonforge.cli import app

runner = CliRunner()


def test_ingest_command_creates_cards_and_run_db(tmp_path: Path) -> None:
    docs = tmp_path / "docs"
    docs.mkdir()
    (docs / "note.md").write_text("# Note\n\nUseful source text.", encoding="utf-8")

    result = runner.invoke(app, ["ingest", "docs", "--workspace", str(tmp_path), "--quiet"])

    assert result.exit_code == 0, result.output
    assert "Ingested 1 source(s)" in result.output
    assert (tmp_path / ".canonforge" / "runs.sqlite").exists()
    cards = list((tmp_path / ".canonforge" / "logs").glob("*/source-cards/*.yaml"))
    assert len(cards) == 1


def test_ingest_command_reports_missing_target(tmp_path: Path) -> None:
    result = runner.invoke(app, ["ingest", "missing", "--workspace", str(tmp_path)])

    assert result.exit_code == 1
    assert "Ingestion failed" in result.output


def test_plan_command_persists_review_artifacts(tmp_path: Path) -> None:
    result = runner.invoke(
        app,
        [
            "plan",
            "organize primitive notes",
            "--target",
            "docs/primitives.md",
            "--workspace",
            str(tmp_path),
        ],
    )

    assert result.exit_code == 0, result.output
    assert "Action: restructure" in result.output
    run_dirs = list((tmp_path / ".canonforge" / "logs").iterdir())
    assert len(run_dirs) == 1
    assert (run_dirs[0] / "task-packet.yaml").exists()
    assert (run_dirs[0] / "work-order.yaml").exists()
    assert (run_dirs[0] / "foreman-result.yaml").exists()
