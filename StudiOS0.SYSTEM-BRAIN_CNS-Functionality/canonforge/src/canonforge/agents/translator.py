from __future__ import annotations

import re

from canonforge.contracts import (
    Action,
    InstructionScope,
    OutputLevel,
    ProseMode,
    TaskPacket,
    UserIntent,
)

ACTION_PATTERNS: tuple[tuple[Action, tuple[str, ...]], ...] = (
    (Action.PROMOTE_AGENT, ("promote", "promotion")),
    (Action.MAP_CONCEPTS, ("map", "mapping", "canonical placement")),
    (Action.RESTRUCTURE, ("restructure", "reorganize", "organize", "move")),
    (Action.SUMMARIZE, ("summarize", "summary", "condense")),
    (Action.CLASSIFY, ("classify", "categorize", "taxonomy")),
    (Action.COMPARE, ("compare", "difference", "versus", " vs ")),
    (Action.DRAFT, ("draft", "write")),
    (Action.PATCH, ("patch", "edit", "apply", "change")),
)


def translate(
    request: str,
    *,
    target: str | None = None,
    domain: str | None = None,
    output_level: OutputLevel | None = None,
    constraints: list[str] | None = None,
) -> TaskPacket:
    normalized = " ".join(request.strip().split())
    lowered = normalized.lower()
    action = _detect_action(lowered)
    level = output_level or _detect_output_level(lowered, action)
    prose_mode = (
        ProseMode.EXPLICIT_FULL_PROSE
        if level is OutputLevel.FULL_PROSE
        else ProseMode.STRUCTURAL_DEFAULT
    )
    resolved_target = target or _quoted_target(normalized)
    questions: list[str] = []
    if action in {Action.PATCH, Action.RESTRUCTURE, Action.COMPARE} and not resolved_target:
        questions.append("Which file or folder should this plan target?")

    scoped_rules = [
        InstructionScope(
            instruction_text="Use structural outputs unless full prose is explicitly requested.",
            applies_to=["current_run", "repo_docs"],
            strength="default",
            expiration="current_run",
            positive_contract=(
                "Prefer source cards, concepts, outlines, schemas, and patch plans before long prose."
            ),
        )
    ]
    return TaskPacket(
        raw_request=normalized,
        user_intent=UserIntent(
            action=action,
            target=resolved_target,
            output_level=level,
            prose_mode=prose_mode,
            domain=domain,
            constraints=constraints or [],
            questions_for_user=questions,
        ),
        instruction_scope=scoped_rules,
    )


def _detect_action(request: str) -> Action:
    for action, patterns in ACTION_PATTERNS:
        if any(pattern in request for pattern in patterns):
            return action
    return Action.CLASSIFY


def _detect_output_level(request: str, action: Action) -> OutputLevel:
    if "full prose" in request or "finished prose" in request:
        return OutputLevel.FULL_PROSE
    if "schema" in request or "json" in request or "yaml" in request:
        return OutputLevel.SCHEMA
    if "patch plan" in request or "plan only" in request:
        return OutputLevel.PATCH_PLAN
    if action is Action.PATCH:
        return OutputLevel.PATCH_PLAN
    if action in {Action.CLASSIFY, Action.MAP_CONCEPTS}:
        return OutputLevel.CONCEPTS
    return OutputLevel.OUTLINE


def _quoted_target(request: str) -> str | None:
    match = re.search(r"['\"]([^'\"]+)['\"]", request)
    return match.group(1).strip() if match else None
