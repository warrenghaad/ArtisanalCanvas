from pathlib import Path

import pytest

from canonforge.config import ConfigError, load_config


def test_load_config_uses_documented_defaults(tmp_path: Path) -> None:
    config = load_config(tmp_path)

    assert config.root == tmp_path
    assert config.values.workspace.name == tmp_path.name
    assert config.database_path == tmp_path / ".canonforge" / "runs.sqlite"


def test_load_config_rejects_unknown_fields(tmp_path: Path) -> None:
    config_dir = tmp_path / ".canonforge"
    config_dir.mkdir()
    (config_dir / "config.yaml").write_text("surprise: true\n", encoding="utf-8")

    with pytest.raises(ConfigError, match="Invalid CanonForge configuration"):
        load_config(tmp_path)
