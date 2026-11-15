from __future__ import annotations

from pathlib import Path

import yaml
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from canonforge.models import SourceCard
from pydantic import BaseModel

from canonforge.contracts import PlanResult


def write_source_card(card: SourceCard, output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{card.source_id}.yaml"
    payload = {"source_card": card.model_dump(mode="json")}
    output_path.write_text(
        yaml.safe_dump(payload, sort_keys=False, allow_unicode=True), encoding="utf-8"
    )
    return output_path


def write_yaml_artifact(key: str, model: BaseModel, output_path: Path) -> Path:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {key: model.model_dump(mode="json")}
    output_path.write_text(
        yaml.safe_dump(payload, sort_keys=False, allow_unicode=True),
        encoding="utf-8",
    )
    return output_path


def print_source_card(console: Console, card: SourceCard) -> None:
    body = (
        f"[bold]{card.title}[/bold]\n"
        f"[dim]{card.source_path} · {card.source_type}[/dim]\n\n"
        f"{card.summary or '[dim]No summary text found.[/dim]'}"
    )
    console.print(Panel(body, title=f"Source card {card.source_id[:8]}", border_style="cyan"))


def runs_table(rows: list) -> Table:
    table = Table(title="CanonForge runs")
    table.add_column("Run")
    table.add_column("Started")
    table.add_column("Status")
    table.add_column("Sources", justify="right")
    table.add_column("Goal")
    for row in rows:
        table.add_row(
            row["id"][:8],
            row["started_at"],
            row["status"],
            str(row["source_count"]),
            row["user_goal"],
        )
    return table


def print_plan(console: Console, plan: PlanResult) -> None:
    intent = plan.task_packet.user_intent
    order = plan.work_order
    body = (
        f"[bold]Action:[/bold] {intent.action.value}\n"
        f"[bold]Target:[/bold] {intent.target or '[yellow]unresolved[/yellow]'}\n"
        f"[bold]Output:[/bold] {intent.output_level.value}\n"
        f"[bold]Write mode:[/bold] {order.write_mode.value}\n"
        f"[bold]Agents:[/bold] {', '.join(order.agent_assignments)}\n\n"
        f"{plan.foreman_result.summary}"
    )
    if plan.foreman_result.unresolved_decisions:
        body += "\n\n[bold yellow]Needs your decision:[/bold yellow]\n- " + "\n- ".join(
            plan.foreman_result.unresolved_decisions
        )
    console.print(Panel(body, title=f"Plan {plan.task_packet.task_id[:8]}", border_style="magenta"))
    console.print(f"Artifacts: {plan.output_dir}")
