from __future__ import annotations

from pathlib import Path

from canonforge.contracts import (
    Action,
    ForemanResult,
    OutputLevel,
    TaskPacket,
    WorkOrder,
    WriteMode,
)

AGENTS_BY_ACTION: dict[Action, list[str]] = {
    Action.RESTRUCTURE: ["ingestion", "canon_mapper", "document_architect", "critic"],
    Action.SUMMARIZE: ["ingestion", "concept_extractor", "critic"],
    Action.CLASSIFY: ["ingestion", "concept_extractor", "canon_mapper", "critic"],
    Action.DRAFT: ["ingestion", "document_architect", "editor", "critic"],
    Action.PATCH: ["ingestion", "editor", "critic", "patch_agent"],
    Action.COMPARE: ["ingestion", "concept_extractor", "critic"],
    Action.PROMOTE_AGENT: ["critic"],
    Action.MAP_CONCEPTS: ["ingestion", "concept_extractor", "canon_mapper", "critic"],
}


def create_work_order(packet: TaskPacket, workspace: Path, default_write_mode: str) -> WorkOrder:
    intent = packet.user_intent
    target_files = [intent.target] if intent.target else []
    source_material = [intent.target] if intent.target else []
    write_mode = _write_mode(intent.output_level, default_write_mode)
    gates = ["review_task_packet", "review_work_order"]
    if write_mode is not WriteMode.PLAN:
        gates.append("approve_patch_before_write")

    risks: list[str] = []
    if intent.questions_for_user:
        risks.append("Target is unresolved; do not perform file writes.")
        write_mode = WriteMode.PLAN
    if intent.output_level is OutputLevel.FULL_PROSE:
        risks.append("Full prose was explicitly requested; preserve source and scope boundaries.")

    return WorkOrder(
        task_id=packet.task_id,
        goal=packet.raw_request,
        source_material=source_material,
        workspace=str(workspace),
        target_files=target_files,
        agent_assignments=AGENTS_BY_ACTION[intent.action],
        expected_outputs=[intent.output_level.value, "critic_result", "run_summary"],
        approval_gates=gates,
        write_mode=write_mode,
        risk_notes=risks,
    )


def summarize_plan(packet: TaskPacket, order: WorkOrder) -> ForemanResult:
    intent = packet.user_intent
    target = intent.target or "an unresolved target"
    unresolved = list(intent.questions_for_user)
    return ForemanResult(
        summary=f"Prepared a {order.write_mode.value} work order for {intent.action.value} on {target}.",
        proposed_changes=[
            f"Run agents in bounded order: {', '.join(order.agent_assignments)}.",
            f"Produce {', '.join(order.expected_outputs)}.",
        ],
        unresolved_decisions=unresolved,
        recommended_next_command=(
            "resolve the target and rerun plan"
            if unresolved
            else f"canonforge show {packet.task_id}"
        ),
    )


def _write_mode(output_level: OutputLevel, configured: str) -> WriteMode:
    if output_level not in {OutputLevel.PATCH, OutputLevel.FULL_PROSE}:
        return WriteMode.PLAN
    try:
        return WriteMode(configured)
    except ValueError:
        return WriteMode.PATCH_REVIEW
