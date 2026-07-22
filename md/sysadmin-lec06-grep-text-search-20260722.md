# Sysadmin — Lec06: Text Search with grep (2026)

> 📄 [View original PDF](documents/sysadmin-lec06-grep-text-search-20260722.pdf) — source of truth
> ⚠️ The original lecture slides contain images and diagrams — refer to the PDF for visual content.

Module 04 (c) — Text Search with grep

---

## What is grep?

**Origin & Acronym:** Derived from the early Unix text editor `ed` command `g/re/p`: **G**lobally search for a **R**egular **E**xpression and **P**rint matching lines.

**Primary Function:** Scans input files line-by-line, searching for lines that match a specified pattern, and writes matching lines directly to standard output (stdout).

---

## Basic Syntax & Usage

The standard syntax for invoking grep on a Linux terminal:

```bash
grep [options] "pattern" filename
```

- **pattern:** The text or regular expression to search for.
- **filename:** Target file or path to search within.
- **Quoting:** Always quote patterns to prevent shell expansion.

---

## Essential Command Line Flags

### Case Insensitive (`-i`)

Ignores letter case distinctions during pattern matching.

```bash
grep -i "error" log.txt
```

### Line Numbers (`-n`)

Prefixes each matching line with its 1-based line number in the source file.

```bash
grep -n "main" main.c
```

### Invert Match (`-v`)

Inverts the search to select and output all non-matching lines.

```bash
grep -v "DEBUG" app.log
```

---

## Recursive Directory Search

Use `grep -r "pattern" dir/` to search through all files in a directory hierarchy recursively.

**Practical Example:**

```bash
grep -rn "pthread_create" ./src/
```

Finds all C source threads initialization calls recursively with line numbers.

---

## Quick Reference: Common Flags

| Flag | Name | Description | Example Usage |
|---|---|---|---|
| `-c` | Count | Prints only the total count of matching lines per file | `grep -c "FAIL" test.log` |
| `-w` | Word Match | Matches whole words only (enforces word boundaries) | `grep -w "int" program.c` |
| `-l` | List Files | Displays only the names of files containing matches | `grep -rl "TODO" src/` |
| `-E` | Extended Regex | Enables Extended Regular Expressions (ERE) syntax | `grep -E "err\|warn" log.txt` |

---

## Regular Expression Anchors

Leveraging regular expressions for precise text filtration.

| Anchor | Description | Example |
|---|---|---|
| `^` | Start of Line — matches patterns starting at line origin | `grep "^#include" file.c` extracts header includes |
| `$` | End of Line — matches patterns ending a line | `grep "return 0;$" file.c` finds clean main terminations |
| `^$` | Empty Lines — combining both anchors matches empty lines | `grep -v "^$" file.txt` strips blank lines |
| `[ ]` | Character Classes — matches any single character listed | `grep "[0-9]" data.txt` finds lines containing digits |

---

## Context Flags: `-A`, `-B`, `-C`

- **`-A N`:** Shows N lines **After** the match.
- **`-B N`:** Shows N lines **Before** the match.
- **`-C N`:** Shows N lines of **Context** (both directions).

```bash
grep -C 2 "panic" kernel.log
```

> **Note:** `fgrep` bypasses regex parsing engines entirely, achieving maximum throughput when searching fixed text literals in large dataset logs.

---

## Questions & Lab Practice

Try running `man grep` on your Linux terminal!
