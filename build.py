#!/usr/bin/env python3
"""
Empacota a skill advogado-pt num ficheiro .skill (arquivo ZIP) pronto para upload no Claude.

Uso:
    python build.py                 # gera advogado-pt.skill na raiz da skill
    python build.py --out dist      # gera em dist/advogado-pt.skill

O ZIP contém o SKILL.md na raiz, mais as pastas references/, assets/ e scripts/.
Exclui artefactos: __pycache__, *.pyc, .git, .DS_Store e o próprio ficheiro .skill.
"""
import argparse
import os
import sys
import zipfile
from pathlib import Path

# A consola do Windows pode ser cp1252; força UTF-8 no stdout quando possível.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

SKILL_NAME = "advogado-pt"
EXCLUDE_DIRS = {"__pycache__", ".git", ".idea", ".vscode", "dist", "node_modules",
                "mcp-server", "integrations"}
EXCLUDE_FILES_SUFFIX = (".pyc", ".skill", ".zip")
EXCLUDE_FILES_NAME = {".DS_Store", "Thumbs.db"}


def should_include(path: Path, root: Path, out_path: Path) -> bool:
    if path.resolve() == out_path.resolve():
        return False
    if any(part in EXCLUDE_DIRS for part in path.relative_to(root).parts):
        return False
    if path.name in EXCLUDE_FILES_NAME:
        return False
    if path.suffix in EXCLUDE_FILES_SUFFIX:
        return False
    return True


def main() -> None:
    parser = argparse.ArgumentParser(description="Empacota a skill advogado-pt num .skill")
    parser.add_argument("--out", default=None, help="Pasta de destino (default: raiz da skill)")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    skill_src = root / "skills" / SKILL_NAME
    out_dir = Path(args.out).resolve() if args.out else root
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{SKILL_NAME}.skill"

    if not (skill_src / "SKILL.md").exists():
        raise SystemExit(f"ERRO: {skill_src}/SKILL.md não encontrado.")

    if out_path.exists():
        out_path.unlink()

    count = 0
    with zipfile.ZipFile(out_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for dirpath, dirnames, filenames in os.walk(skill_src):
            dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
            for name in filenames:
                fpath = Path(dirpath) / name
                if not should_include(fpath, skill_src, out_path):
                    continue
                arcname = fpath.relative_to(skill_src).as_posix()
                zf.write(fpath, arcname)
                count += 1

    size_kb = out_path.stat().st_size / 1024
    print(f"OK: {out_path}")
    print(f"   {count} ficheiros, {size_kb:.1f} KB")
    print("   Faz upload em Claude -> Settings -> Skills.")


if __name__ == "__main__":
    main()
