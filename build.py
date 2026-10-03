#!/usr/bin/env python3
"""
Empacota a skill advogado-pt num ficheiro .skill (arquivo ZIP) pronto para upload no Claude.

Uso:
    python build.py                 # gera advogado-pt.skill na raiz da skill
    python build.py --out dist      # gera em dist/advogado-pt.skill

O ZIP contém a pasta advogado-pt/ na raiz (advogado-pt/SKILL.md, references/, assets/,
playbooks/ e scripts/), como pede o formato de upload de Skills.
Exclui artefactos: __pycache__, *.pyc, .git, .DS_Store e o próprio ficheiro .skill.
Antes de empacotar valida o SKILL.md (name, description <= 1024 sem < nem >) e a
ausência de um diretório bin/ na raiz do plugin.
"""
import argparse
import os
import re
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


MAX_DESCRIPTION = 1024
NAME_RE = re.compile(r"^[a-z0-9-]{1,64}$")


def frontmatter(texto: str) -> dict:
    """Lê os campos de topo do frontmatter YAML (aceita os escalares dobrados > e |)."""
    m = re.match(r"^---\r?\n(.*?)\r?\n---", texto, re.S)
    if not m:
        raise SystemExit("ERRO: SKILL.md sem frontmatter (--- ... ---).")
    linhas = m.group(1).splitlines()
    campos = {}
    i = 0
    while i < len(linhas):
        c = re.match(r"^([a-z_-]+):\s*(.*)$", linhas[i])
        i += 1
        if not c:
            continue
        valor = c.group(2).strip()
        if valor in (">", "|", ">-", "|-"):
            partes = []
            while i < len(linhas) and re.match(r"^\s+\S", linhas[i]):
                partes.append(linhas[i].strip())
                i += 1
            valor = (" " if valor.startswith(">") else "\n").join(partes)
        campos[c.group(1)] = valor.strip("\"'")
    return campos


def validar_skill_md(texto: str) -> None:
    """Falha (SystemExit) se o SKILL.md não cumprir as regras de upload de Skills."""
    campos = frontmatter(texto)
    nome = campos.get("name", "")
    if not NAME_RE.match(nome):
        raise SystemExit(f"ERRO: name '{nome}' inválido (minúsculas, algarismos e hífens; até 64).")
    desc = campos.get("description", "")
    if not desc:
        raise SystemExit("ERRO: falta a description no SKILL.md.")
    if len(desc) > MAX_DESCRIPTION:
        raise SystemExit(
            f"ERRO: description com {len(desc)} caracteres (máximo {MAX_DESCRIPTION}).")
    if "<" in desc or ">" in desc:
        raise SystemExit("ERRO: a description não pode conter < nem >.")


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
    validar_skill_md((skill_src / "SKILL.md").read_text(encoding="utf-8"))
    if (root / "bin").exists():
        raise SystemExit("ERRO: existe um diretório bin/ na raiz — o Claude Desktop recusa o plugin.")

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
                # Pasta da skill na raiz do arquivo: advogado-pt/SKILL.md, advogado-pt/references/...
                arcname = f"{SKILL_NAME}/{fpath.relative_to(skill_src).as_posix()}"
                zf.write(fpath, arcname)
                count += 1

    size_kb = out_path.stat().st_size / 1024
    print(f"OK: {out_path}")
    print(f"   {count} ficheiros, {size_kb:.1f} KB")
    print("   Faz upload em Claude -> Settings -> Skills.")


if __name__ == "__main__":
    main()
