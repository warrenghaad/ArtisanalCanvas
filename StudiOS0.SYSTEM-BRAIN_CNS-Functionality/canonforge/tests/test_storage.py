from datetime import UTC, datetime
from pathlib import Path

from canonforge.models import SourceCard
from canonforge.storage import RunStore
from canonforge.agents.foreman import create_work_order
from canonforge.agents.translator import translate


def test_run_and_source_records_round_trip(tmp_path: Path) -> None:
    store = RunStore(tmp_path / "runs.sqlite")
    store.initialize()
    run_id = store.start_run(tmp_path, "ingest notes")
    store.add_source(
        run_id,
        SourceCard(
            source_id="source-1",
            source_path="notes/a.md",
            source_type="markdown",
            title="A",
            date_ingested=datetime(2026, 7, 21, tzinfo=UTC),
            summary="Summary",
            domains=[],
            content_hash="a" * 64,
        ),
    )
    store.finish_run(run_id, "completed", 1)

    rows = store.list_runs()
    assert len(rows) == 1
    assert rows[0]["status"] == "completed"
    assert rows[0]["source_count"] == 1
    assert store.counts() == (1, 1)


def test_task_packet_and_work_order_round_trip(tmp_path: Path) -> None:
    store = RunStore(tmp_path / "runs.sqlite")
    store.initialize()
    run_id = store.start_run(tmp_path, "organize notes", run_type="plan")
    packet = translate("organize notes", target="notes")
    order = create_work_order(packet, tmp_path, "patch_review")

    store.add_plan(run_id, packet, order)
    stored = store.get_plan(packet.task_id)

    assert stored is not None
    stored_packet, stored_order = stored
    assert stored_packet == packet
    assert stored_order == order
