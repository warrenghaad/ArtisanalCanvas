from pathlib import Path

from canonforge.agents.foreman import create_work_order, summarize_plan
from canonforge.agents.translator import translate
from canonforge.contracts import WriteMode


def test_foreman_assigns_bounded_agents() -> None:
    packet = translate("map concepts into the canon", target="docs/theory.md")
    order = create_work_order(packet, Path("/workspace"), "patch_review")

    assert order.write_mode is WriteMode.PLAN
    assert order.agent_assignments == [
        "ingestion",
        "concept_extractor",
        "canon_mapper",
        "critic",
    ]
    assert order.target_files == ["docs/theory.md"]


def test_unresolved_target_forces_plan_mode() -> None:
    packet = translate("patch the architecture")
    order = create_work_order(packet, Path("/workspace"), "trusted_patch")
    result = summarize_plan(packet, order)

    assert order.write_mode is WriteMode.PLAN
    assert result.unresolved_decisions
    assert result.recommended_next_command == "resolve the target and rerun plan"
