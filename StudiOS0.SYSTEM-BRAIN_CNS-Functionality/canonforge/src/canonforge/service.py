from __future__ import annotations

from pathlib import Path

from rich.console import Console

from canonforge.config import LoadedConfig, ensure_runtime_dirs
from canonforge.ingestion import IngestionError, discover_sources, ingest_file
from canonforge.output import print_source_card, write_source_card
from canonforge.storage import RunStore


def prepare_store(config: LoadedConfig) -> RunStore:
    ensure_runtime_dirs(config)
    store = RunStore(config.database_path)
    store.initialize()
    return store


def ingest_target(
    config: LoadedConfig, target: Path, console: Console, show_cards: bool = True
) -> tuple[str, int]:
    store = prepare_store(config)
    resolved_target = target.expanduser()
    if not resolved_target.is_absolute():
        resolved_target = config.root / resolved_target

    run_id = store.start_run(config.root, f"ingest {resolved_target}")
    count = 0
    try:
        paths = discover_sources(resolved_target)
        card_dir = config.resolve_path(config.values.paths.logs) / run_id / "source-cards"
        for path in paths:
            source = ingest_file(path, config.root)
            store.add_source(run_id, source.card)
            write_source_card(source.card, card_dir)
            if show_cards:
                print_source_card(console, source.card)
            count += 1
    except Exception as exc:
        store.finish_run(run_id, "failed", count, str(exc))
        if isinstance(exc, IngestionError):
            raise
        raise IngestionError(str(exc)) from exc

    status = "completed" if count else "completed_empty"
    store.finish_run(run_id, status, count)
    return run_id, count
