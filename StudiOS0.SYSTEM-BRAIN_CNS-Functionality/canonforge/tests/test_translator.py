from canonforge.agents.translator import translate
from canonforge.contracts import Action, OutputLevel, ProseMode


def test_translator_defaults_to_structural_concept_output() -> None:
    packet = translate("classify the primitive grammar notes", domain="drawing")

    assert packet.user_intent.action is Action.CLASSIFY
    assert packet.user_intent.output_level is OutputLevel.CONCEPTS
    assert packet.user_intent.prose_mode is ProseMode.STRUCTURAL_DEFAULT
    assert packet.user_intent.domain == "drawing"
    assert packet.instruction_scope[0].expiration == "current_run"


def test_translator_requires_target_for_patch_plan() -> None:
    packet = translate("patch the architecture")

    assert packet.user_intent.action is Action.PATCH
    assert packet.user_intent.output_level is OutputLevel.PATCH_PLAN
    assert packet.user_intent.questions_for_user == [
        "Which file or folder should this plan target?"
    ]


def test_full_prose_must_be_explicit() -> None:
    packet = translate("draft full prose for the introduction", target="docs/intro.md")

    assert packet.user_intent.output_level is OutputLevel.FULL_PROSE
    assert packet.user_intent.prose_mode is ProseMode.EXPLICIT_FULL_PROSE
