from __future__ import annotations

from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict, Field, ValidationError


class WorkspaceSection(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    root: str = "."


class ModesSection(BaseModel):
    model_config = ConfigDict(extra="forbid")

    default_write_mode: str = "patch_review"
    default_output_level: str = "structure"


class PathsSection(BaseModel):
    model_config = ConfigDict(extra="forbid")

    inbox: str = ".canonforge/inbox"
    logs: str = ".canonforge/logs"
    patches: str = ".canonforge/patches"
    cache: str = ".canonforge/cache"
    runs_db: str = ".canonforge/runs.sqlite"


class WorkspaceConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    workspace: WorkspaceSection = Field(default_factory=WorkspaceSection)
    modes: ModesSection = Field(default_factory=ModesSection)
    paths: PathsSection = Field(default_factory=PathsSection)


class ConfigError(ValueError):
    """Raised when workspace configuration cannot be loaded safely."""


class LoadedConfig(BaseModel):
    model_config = ConfigDict(arbitrary_types_allowed=True)

    root: Path
    config_path: Path
    values: WorkspaceConfig

    def resolve_path(self, configured_path: str) -> Path:
        candidate = Path(configured_path).expanduser()
        return candidate.resolve() if candidate.is_absolute() else (self.root / candidate).resolve()

    @property
    def database_path(self) -> Path:
        return self.resolve_path(self.values.paths.runs_db)


def load_config(workspace: Path) -> LoadedConfig:
    requested_root = workspace.expanduser().resolve()
    config_path = requested_root / ".canonforge" / "config.yaml"
    raw: dict = {}

    if config_path.exists():
        try:
            parsed = yaml.safe_load(config_path.read_text(encoding="utf-8"))
        except (OSError, UnicodeError, yaml.YAMLError) as exc:
            raise ConfigError(f"Could not read {config_path}: {exc}") from exc
        if parsed is not None and not isinstance(parsed, dict):
            raise ConfigError(f"Configuration root must be a mapping: {config_path}")
        raw = parsed or {}

    try:
        values = WorkspaceConfig.model_validate(raw)
    except ValidationError as exc:
        raise ConfigError(f"Invalid CanonForge configuration in {config_path}:\n{exc}") from exc

    configured_root = Path(values.workspace.root).expanduser()
    root = (
        configured_root.resolve()
        if configured_root.is_absolute()
        else (requested_root / configured_root).resolve()
    )
    if not root.exists() or not root.is_dir():
        raise ConfigError(f"Workspace root is not a directory: {root}")

    if values.workspace.name is None:
        values.workspace.name = root.name
    return LoadedConfig(root=root, config_path=config_path, values=values)


def ensure_runtime_dirs(config: LoadedConfig) -> None:
    config.database_path.parent.mkdir(parents=True, exist_ok=True)
    for configured in (
        config.values.paths.inbox,
        config.values.paths.logs,
        config.values.paths.patches,
        config.values.paths.cache,
    ):
        config.resolve_path(configured).mkdir(parents=True, exist_ok=True)
