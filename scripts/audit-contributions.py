"""Read local Git histories without changing the source repositories.

Raw metadata is written only to this portfolio's ignored artifacts directory.
Identity is determined from the raw author NAME, never an email address.
Counts describe available history, not effort, ownership, or production delivery.
"""

from __future__ import annotations

from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess


WORKSPACE = Path(__file__).resolve().parents[1]
OUTPUT = WORKSPACE / "artifacts" / "indiassetz-audit"
BASE = Path("D:/engg/SEM VIII")
REPOSITORIES = {
    "graphite": (BASE / "Graphite", "personal-helper"),
    "vantage3d": (BASE / "Vantage3D", "personal-helper"),
    "geofenceapp": (BASE / "GeofenceApp", "personal-helper"),
    "kaamchecker": (BASE / "kaamchecker", "personal-helper"),
    **{
        name: (BASE / "IA" / "repos" / name, "company-work")
        for name in (
            "yindyachetz", "wearyfighd", "yarkavebsight", "doors",
            "eyeayveb", "yarka2", "yarka-inwaster-pletfarm",
        )
    },
}
START, END = date(2026, 3, 1), date(2026, 10, 31)
AI_TERMS = ("codex", "claude", "gemini", "chatgpt", "antigravity", "copilot")


def git(path: Path, *arguments: str) -> str:
    environment = {**os.environ, "GIT_OPTIONAL_LOCKS": "0"}
    return subprocess.run(
        ["git", "-C", str(path), *arguments],
        check=True, capture_output=True, env=environment,
    ).stdout.decode("utf-8", errors="replace")


def safe_text(value: str) -> str:
    value = re.sub(r"https?://\S+", "[URL omitted]", value)
    return re.sub(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}", "[email omitted]", value)


def audit(entry: tuple[str, tuple[Path, str]]) -> dict:
    name, (path, category) = entry
    raw = git(path, "log", "--all", "--format=%H%x1f%T%x1f%P%x1f%an%x1f%aI%x1f%cI%x1f%s%x1e")
    commits = []
    for record in raw.split("\x1e"):
        fields = record.strip("\r\n").split("\x1f")
        if len(fields) != 7:
            continue
        sha, tree, parents, author, authored, committed, subject = fields
        when = datetime.fromisoformat(authored).date()
        commits.append({
            "sha": sha, "tree": tree, "parents": parents.split(),
            "author_name": safe_text(author),
            "matches_name_rule": "aniruddh" in author.casefold(),
            "authored_at": authored, "committed_at": committed,
            "within_role_period": START <= when <= END,
            "subject": safe_text(subject),
        })
    mine = [commit for commit in commits if commit["matches_name_rule"]]
    own_names = Counter(commit["author_name"] for commit in mine)
    own_dates = sorted(commit["authored_at"] for commit in mine)
    own_nonmerge = [commit for commit in mine if len(commit["parents"]) <= 1]
    # Store only AI-term flags from commit bodies, never raw trailers/emails.
    bodies = git(path, "log", "--all", "--format=%H%x1f%B%x1e")
    ai_mentions = []
    own_ids = {commit["sha"] for commit in mine}
    for record in bodies.split("\x1e"):
        fields = record.strip("\r\n").split("\x1f", 1)
        if len(fields) != 2 or fields[0] not in own_ids:
            continue
        terms = [term for term in AI_TERMS if term in fields[1].casefold()]
        if terms:
            ai_mentions.append({"sha": fields[0], "terms": terms})
    refs = git(path, "for-each-ref", "--format=%(refname:short)").splitlines()
    head = git(path, "rev-parse", "HEAD").strip()
    status = git(path, "status", "--porcelain", "--untracked-files=no").splitlines()
    default_ref = next((ref for ref in ("origin/main", "origin/master") if ref in refs), None)
    tracked_files = git(path, "ls-tree", "-r", "--name-only", "HEAD").splitlines()
    workflow_files = [
        file for file in tracked_files
        if any(token in file.casefold() for token in (
            "agents.md", "claude.md", "gemini.md", "copilot-instructions",
            ".cursor/", ".claude/", "ai_sdlc", "ai-sdlc", "orchestrat",
        ))
    ]
    summary = {
        "repository": name, "category": category,
        "identity_rule": "raw author name contains Aniruddh, case-insensitive; email ignored",
        "audit_period": [START.isoformat(), END.isoformat()],
        "head": head,
        "head_reachable_commits": int(git(path, "rev-list", "--count", "HEAD")),
        "shallow": git(path, "rev-parse", "--is-shallow-repository").strip() == "true",
        "available_ref_count": len(refs),
        "cached_default_ref": default_ref,
        "cached_default_head": git(path, "rev-parse", default_ref).strip() if default_ref else None,
        "tracked_worktree_changes": len(status),
        "has_conflicts": any(line[:2] in {"DD", "AU", "UD", "UA", "DU", "AA", "UU"} for line in status),
        "all_available_commits": len(commits),
        "matching_name_commits": len(mine),
        "matching_nonmerge_commits": len(own_nonmerge),
        "matching_merge_commits": len(mine) - len(own_nonmerge),
        "matching_commits_in_period": sum(commit["within_role_period"] for commit in mine),
        "matching_names": dict(own_names),
        "matching_authored_range": [own_dates[0], own_dates[-1]] if own_dates else None,
        "distinct_trees_in_matching_nonmerge_history": len({commit["tree"] for commit in own_nonmerge}),
        "matching_commits_mentioning_ai_terms": len(ai_mentions),
        "workflow_path_candidates_at_head": workflow_files,
        "history_digest": hashlib.sha256(raw.encode()).hexdigest(),
    }
    (OUTPUT / f"{name}.json").write_text(
        json.dumps({"summary": summary, "commits": commits, "ai_term_mentions": ai_mentions}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    return summary


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=4) as pool:
        summaries = list(pool.map(audit, REPOSITORIES.items()))
    (OUTPUT / "summary.json").write_text(json.dumps(summaries, indent=2, ensure_ascii=False), encoding="utf-8")
    for row in summaries:
        print(json.dumps({key: row[key] for key in (
            "repository", "all_available_commits", "matching_name_commits",
            "matching_commits_in_period", "head_reachable_commits",
            "shallow", "has_conflicts",
        )}))


if __name__ == "__main__":
    main()
