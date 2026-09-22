from __future__ import annotations

from enum import StrEnum
from pathlib import Path
from uuid import uuid4

from pydantic import BaseModel, Field


class Action(StrEnum):
    RESTRUCTURE = "restructure"
    SUMMARIZE = "summarize"
    CLASSIFY = "classify"
    DRAFT = "draft"
    PATCH = "patch"
    COMPARE = "compare"
    PROMOTE_AGENT = "promote_agent"
    MAP_CONCEPTS = "map_concepts"


class OutputLevel(StrEnum):
    SOURCE_CARD = "source_card"
    CONCEPTS = "concepts"
    OUTLINE = "outline"
    SCHEMA = "schema"
    PATCH_PLAN = "patch_plan"
    PATCH = "patch"
    FULL_PROSE = "full_prose"


class ProseMode(StrEnum):
    STRUCTURAL_DEFAULT = "structural_default"
    EXPLICIT_FULL_PROSE = "explicit_full_prose"


class WriteMode(StrEnum):
    PLAN = "plan"
    PATCH_REVIEW = "patch_review"
    TRUSTED_PATCH = "trusted_patch"


class InstructionScope(BaseModel):
    instruction_text: str
    applies_to: list[str] = Field(default_factory=lambda: ["current_run"])
    strength: str = "default"
    expiration: str = "current_run"
    positive_contract: str


class UserIntent(BaseModel):
    action: Action
    target: str | None = None
    scope: str = "current_run"
    output_level: OutputLevel = OutputLevel.OUTLINE
    prose_mode: ProseMode = ProseMode.STRUCTURAL_DEFAULT
    domain: str | None = None
    constraints: list[str] = Field(default_factory=list)
    approval_required: bool = True
    questions_for_user: list[str] = Field(default_factory=list)


class TaskPacket(BaseModel):
    task_id: str = Field(default_factory=lambda: str(uuid4()))
    raw_request: str
    user_intent: UserIntent
    instruction_scope: list[InstructionScope] = Field(default_factory=list)


class WorkOrder(BaseModel):
    task_id: str
    goal: str
    source_material: list[str] = Field(default_factory=list)
    workspace: str
    target_files: list[str] = Field(default_factory=list)
    agent_assignments: list[str] = Field(default_factory=list)
    expected_outputs: list[str] = Field(default_factory=list)
    approval_gates: list[str] = Field(default_factory=list)
    write_mode: WriteMode = WriteMode.PLAN
    risk_notes: list[str] = Field(default_factory=list)


class ForemanResult(BaseModel):
    summary: str
    proposed_changes: list[str] = Field(default_factory=list)
    files_to_create: list[str] = Field(default_factory=list)
    files_to_update: list[str] = Field(default_factory=list)
    files_to_skip: list[str] = Field(default_factory=list)
    unresolved_decisions: list[str] = Field(default_factory=list)
    recommended_next_command: str


class PlanResult(BaseModel):
    run_id: str
    task_packet: TaskPacket
    work_order: WorkOrder
    foreman_result: ForemanResult
    output_dir: Path
