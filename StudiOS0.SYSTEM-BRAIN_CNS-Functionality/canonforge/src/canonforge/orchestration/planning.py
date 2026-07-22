from __future__ import annotations

from rich.console import Console

from canonforge.agents.foreman import create_work_order, summarize_plan
from canonforge.agents.translator import translate
from canonforge.config import LoadedConfig
from canonforge.contracts import OutputLevel, PlanResult
from canonforge.output import print_plan, write_yaml_artifact
from canonforge.service import prepare_store


def create_plan(
    config: LoadedConfig,
    request: str,
    console: Console,
    *,
    target: str | None = None,
    domain: str | None = None,
    output_level: OutputLevel | None = None,
    constraints: list[str] | None = None,
) -> PlanResult:
    store = prepare_store(config)
    run_id = store.start_run(config.root, request, run_type="plan")
    try:
        packet = translate(
            request,
            target=target,
            domain=domain,
            output_level=output_level,
            constraints=constraints,
        )
        order = create_work_order(
            packet,
            config.root,
            config.values.modes.default_write_mode,
        )
        result = summarize_plan(packet, order)
        output_dir = config.resolve_path(config.values.paths.logs) / run_id
        write_yaml_artifact("task_packet", packet, output_dir / "task-packet.yaml")
        write_yaml_artifact("work_order", order, output_dir / "work-order.yaml")
        write_yaml_artifact("foreman_result", result, output_dir / "foreman-result.yaml")
        store.add_plan(run_id, packet, order)
        store.finish_run(run_id, "needs_decision" if result.unresolved_decisions else "planned", 0)
    except Exception as exc:
        store.finish_run(run_id, "failed", 0, str(exc))
        raise

    plan = PlanResult(
        run_id=run_id,
        task_packet=packet,
        work_order=order,
        foreman_result=result,
        output_dir=output_dir,
    )
    print_plan(console, plan)
    return plan
