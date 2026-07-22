# Sysadmin — Lec05: Text Editing with vi (2026)

> 📄 [View original PDF](documents/sysadmin-lec05-vi-text-editing-20260722.pdf) — source of truth
> ⚠️ The original lecture slides contain images and diagrams — refer to the PDF for visual content.

Module 04 (b) — Text Editing with vi

---

## Why Learn vi in Engineering?

- **Universal Availability:** Pre-installed on virtually every Linux, Unix, and macOS terminal environment worldwide.
- **Remote Administration:** Essential when editing configuration files on headless remote servers over SSH.
- **Lightweight & Fast:** Zero GUI overhead; opens massive log files and codebase files instantaneously.
- **Keyboard Efficiency:** Designed to keep your hands on the home row without touching a mouse.

---

## The Three Essential Modes

### Normal Mode
Default mode upon opening. Keystrokes act as navigation and editing commands (e.g., delete, copy, jump) rather than inserting text.

### Insert Mode
Allows typing raw text into the document. Enter by typing `i`, `a`, or `o`. Leave using `Esc`.

### Command-Line Mode
Activated by typing `:` in Normal mode. Executes file operations, saving, quitting, search/replace, and settings.

---

## Mode Switching & Navigation

### Home Row Cursor Controls

Use `h` (left), `j` (down), `k` (up), and `l` (right) in Normal mode to navigate without arrow keys.

Jump quickly using `w` (next word), `b` (previous word), `0` (start of line), and `$` (end of line).

---

## Opening, Saving, and Exiting

### Saving & Standard Exit

Return to Normal Mode (`Esc`), then type:

| Command | Action |
|---|---|
| `:w` | Write/Save file changes |
| `:q` | Quit (fails if unsaved changes exist) |
| `:wq` or `:x` | Save and quit in one step |

### Force Quit & File Management

| Command | Action |
|---|---|
| `:q!` | Force quit discarding all changes |
| `:w filename.txt` | Save as a new file |
| `vi filename.c` | Open or create file from shell |

---

## Text Editing & Undo Commands

- **Insertion Modes:** Press `i` to insert before cursor, `a` to append after, and `o` to open a new line below.
- **Character & Line Deletion:** Press `x` to delete character under cursor; `dd` deletes current line; `dw` deletes word.
- **Undo & Redo Actions:** Press `u` in Normal mode to undo previous action; press `Ctrl + R` to redo.
- **Replace Character:** Press `r` followed by a letter to instantly replace single character without staying in insert mode.

---

## Copy, Paste & Search Tools

| Operation | Command | Action Description |
|---|---|---|
| Yank (Copy) Line | `yy` | Copies the current line into memory buffer |
| Yank Word | `yw` | Copies word from cursor to word ending |
| Put (Paste) Text | `p` / `P` | Pastes buffer after (`p`) or before (`P`) cursor position |
| Forward Search | `/term` | Searches forward for term; press `n` for next, `N` for previous |
| Global Substitution | `:%s/old/new/g` | Replaces all occurrences of *old* with *new* in entire file |

---

## Visual Mode & Multi-Buffers

- **Visual Selection (`v`):** Highlight character blocks with `v`, whole lines with `V`, or rectangular column blocks with `Ctrl + V`.
- **Window Splits (`:sp` / `:vs`):** Split screen horizontally with `:sp` or vertically with `:vs` to edit multiple files simultaneously.
- **Shell Commands (`:!`):** Run Linux shell commands directly from inside vi using `:!command` without terminating your edit session.

---

## CLI Productivity Metrics

**100% Keyboard-Driven Speed — Eliminating Mouse Latency**

Studies show moving a hand from keyboard to mouse takes approximately 0.5 to 1.5 seconds. Over thousands of line edits per day, keyboard-centric modal editing in vi/vim saves hours of accumulated context-switching time. Engineers using modal editing retain uninterrupted mental flow during complex software debugging.

---

## Questions & Practice

**Next Steps:** Run `vimtutor` in your terminal to complete today's lab assignment!
