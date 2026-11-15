from __future__ import annotations

import shlex
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.prompt import Prompt

from canonforge.config import ConfigError, load_config
from canonforge.ingestion import IngestionError
from canonforge.output import runs_table
from canonforge.service import ingest_target, prepare_store
from canonforge.contracts import OutputLevel
from canonforge.orchestration.planning import create_plan

app = typer.Typer(
    name="canonforge",
    help="Local, review-first knowledge ingestion for CanonForge workspaces.",
    no_args_is_help=True,
)
console = Console()
WorkspaceOption = Annotated[Path, typer.Option("--workspace", "-w", help="Workspace root.")]


def _config_or_exit(workspace: Path):
    try:
        return load_config(workspace)
    except ConfigError as exc:
        console.print(f"[bold red]Configuration error:[/bold red] {exc}")
        raise typer.Exit(2) from exc


@app.command()
def ingest(
    target: Annotated[Path, typer.Argument(help="Markdown/text file or folder to ingest.")],
    workspace: WorkspaceOption = Path("."),
    quiet: Annotated[
        bool, typer.Option("--quiet", help="Do not print individual source cards.")
    ] = False,
) -> None:
    """Ingest Markdown and text, log a run, and emit source cards."""
    config = _config_or_exit(workspace)
    try:
        run_id, count = ingest_target(config, target, console, show_cards=not quiet)
    except IngestionError as exc:
        console.print(f"[bold red]Ingestion failed:[/bold red] {exc}")
        raise typer.Exit(1) from exc
    console.print(f"[bold green]Ingested {count} source(s).[/bold green] Run: {run_id}")


@app.command()
def runs(
    workspace: WorkspaceOption = Path("."),
    limit: Annotated[int, typer.Option(min=1, max=200)] = 20,
) -> None:
    """Show recent ingestion runs."""
    config = _config_or_exit(workspace)
    rows = prepare_store(config).list_runs(limit)
    console.print(runs_table(rows))


@app.command()
def status(workspace: WorkspaceOption = Path(".")) -> None:
    """Show workspace configuration and local run counts."""
    config = _config_or_exit(workspace)
    store = prepare_store(config)
    run_count, source_count = store.counts()
    console.print(f"[bold]{config.values.workspace.name}[/bold]")
    console.print(f"Workspace: {config.root}")
    console.print(
        f"Config: {config.config_path} ({'loaded' if config.config_path.exists() else 'defaults'})"
    )
    console.print(f"Database: {config.database_path}")
    console.print(f"Runs: {run_count} · Sources: {source_count}")


@app.command()
def plan(
    request: Annotated[str, typer.Argument(help="Natural-language goal to translate and plan.")],
    workspace: WorkspaceOption = Path("."),
    target: Annotated[str | None, typer.Option(help="Explicit file or folder target.")] = None,
    domain: Annotated[str | None, typer.Option(help="Domain boundary for the task.")] = None,
    output_level: Annotated[
        OutputLevel | None,
        typer.Option("--output", case_sensitive=False, help="Requested output rung."),
    ] = None,
    constraint: Annotated[
        list[str] | None,
        typer.Option("--constraint", help="Repeatable scoped constraint."),
    ] = None,
) -> None:
    """Translate a request and produce a reviewable Foreman work order."""
    config = _config_or_exit(workspace)
    create_plan(
        config,
        request,
        console,
        target=target,
        domain=domain,
        output_level=output_level,
        constraints=constraint,
    )


@app.command()
def show(
    task_id: Annotated[str, typer.Argument(help="Full task-packet ID.")],
    workspace: WorkspaceOption = Path("."),
) -> None:
    """Show a stored task packet and its work order."""
    config = _config_or_exit(workspace)
    stored = prepare_store(config).get_plan(task_id)
    if stored is None:
        console.print(f"[red]Task not found:[/red] {task_id}")
        raise typer.Exit(1)
    packet, order = stored
    console.print_json(packet.model_dump_json(indent=2))
    console.print_json(order.model_dump_json(indent=2))


@app.command()
def chat(workspace: WorkspaceOption = Path(".")) -> None:
    """Open the local CanonForge studio console."""
    config = _config_or_exit(workspace)
    prepare_store(config)
    console.print(f"[bold cyan]CanonForge[/bold cyan] · {config.values.workspace.name}")
    console.print("Commands: ingest <path>, plan <request>, status, runs, help, exit")
    while True:
        try:
            command = Prompt.ask("[bold cyan]canonforge>[/bold cyan]").strip()
        except (EOFError, KeyboardInterrupt):
            console.print()
            break
        if not command:
            continue
        parts = shlex.split(command)
        verb = parts[0].lower()
        if verb in {"exit", "quit"}:
            break
        if verb == "help":
            console.print("ingest <path> · plan <request> · status · runs · help · exit")
        elif verb == "status":
            run_count, source_count = prepare_store(config).counts()
            console.print(f"Runs: {run_count} · Sources: {source_count}")
        elif verb == "runs":
            console.print(runs_table(prepare_store(config).list_runs()))
        elif verb == "ingest" and len(parts) == 2:
            try:
                run_id, count = ingest_target(config, Path(parts[1]), console)
                console.print(f"[green]Ingested {count} source(s).[/green] Run: {run_id}")
            except IngestionError as exc:
                console.print(f"[red]Ingestion failed:[/red] {exc}")
        elif verb == "plan" and len(parts) > 1:
            create_plan(config, " ".join(parts[1:]), console)
        else:
            console.print(
                "[yellow]Supports: ingest <path>, plan <request>, status, runs, help, exit[/yellow]"
            )


if __name__ == "__main__":
    app()
