# Sysadmin — Lec04: Text Editing with nano (2026)

> 📄 [View original PDF](documents/sysadmin-lec04-nano-text-editing-20260722.pdf) — source of truth
> ⚠️ The original lecture slides contain images and diagrams — refer to the PDF for visual content.

Module 04 (a) — Text Editing with nano

---

## Why nano? Text Editing in Shell

- **Pre-installed Everywhere:** Available out of the box across almost all Linux distributions (Ubuntu, Debian, CentOS).
- **Beginner Friendly:** Unlike modal editors (Vim/Emacs), nano provides immediate modeless text insertion.
- **On-Screen Shortcuts:** Key combinations are constantly displayed at the bottom of the buffer for quick reference.
- **Essential for SSH Work:** Perfect for editing remote configuration files, C/Python scripts, and system logs.

---

## Opening & Creating Files

### Basic Usage

Open or create a file directly from terminal:

```bash
nano main.c
```

Jump to a specific line number directly on launch:

```bash
nano +25 script.py
```

Useful for jumping straight to compiler syntax errors!

### Essential Flags

Show line numbers automatically:
```bash
nano -l config.txt
```

Open in read-only / view mode:
```bash
nano -v /etc/hosts
```

Create backup copies before saving changes:
```bash
nano -B file.txt
```

---

## Key Notations & Basics

### The Shell Session — Terminal Efficiency

`nano` operates completely inside your terminal session, eliminating any dependency on a graphical desktop environment (GUI). Mastering keyboard-driven workflows allows seamless control over remote servers and embedded devices like Raspberry Pi.

### The `^` Notation

The caret symbol `^` denotes the **Ctrl** key. For instance, `^X` means press **Ctrl + X** together.

### The `M-` Notation

The letter `M-` represents the **Alt** (Meta) key (or **Esc** on macOS). E.g., `M-U` means **Alt + U**.

### Direct Editing

There are no separate mode switches. Just start typing directly into the active terminal cursor position.

---

## Core Commands at a Glance

### `^O` — Write Out (Save)

Press **Ctrl + O** to save ("Write Out") modifications to disk. Press **Enter** to confirm the existing file name or type a new name to "Save As".

Press **Ctrl + X** to exit nano. If you have unsaved changes, nano will prompt you with **Y** (Yes) or **N** (No) before quitting.

---

## Clipboard & Selection Operations

| Shortcut | Action |
|---|---|
| **Ctrl + K** | Cut current line into the cutbuffer (press repeatedly to cut multiple consecutive lines) |
| **Ctrl + U** | Uncut / Paste the contents of the cutbuffer at the current cursor location |
| **Alt + 6** | Copy current line (or selected block of text) without deleting it |
| **Alt + A** | Set / Unset selection mark; use arrow keys to highlight precise text regions |

---

## Search & Navigation Reference

| Shortcut | Function | Engineering Use Case |
|---|---|---|
| **Ctrl + W** | Where Is (Search) | Find specific variable or function definition |
| **Alt + W** | Search Next | Iterate through next matching log/code occurrences |
| **Ctrl + \\** | Search & Replace | Refactor variable names across an entire script |
| **Ctrl + _** | Go to Line Number | Jump directly to line flagged by GCC compiler error |
| **Ctrl + A / E** | Start / End of line | Navigate quickly across long code commands |

---

## CLI Text Editors Benchmark

Comparison of beginner accessibility & onboarding speed across Linux editors. Nano leads in zero-setup speed for server edits.

---

## Customizing nano via `.nanorc`

**Config file location:** `~/.nanorc`

Configure persistent defaults so you don't need to pass command-line flags every time you launch nano:

```bash
nano ~/.nanorc
```

**Recommended configuration** — add these lines to your `~/.nanorc`:

```
set linenumbers
set tabsize 4
set autoindent
set softwrap
```

---

## Questions & Lab Session

Ready to practice? Launch your terminal and open your first file!
