# Microcontroller Lec02 — Computer Organization & Cortex-M Architecture (2026)

> 📄 [View original PDF](documents/microcontroller-lec02-cortex-arch-20260630.pdf) — source of truth

---

**Computer Organization & Cortex-M Architecture**  
Microcontroller Interfacing  
Sorayut Glomglome

---

## Outline

1. Computer Organization
2. Cortex-M Architecture
3. Processor Registers
4. Memory Technology

---

## Learning Outcomes

- Understand Computer Organization
- Understand Cortex-M Architecture

---

## Computer Organization

### Building from High Level Language to Binary

> 📄 See [PDF page 4](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=4) — compilation flow from C/C++ source to binary.

### Program Build Tools

> 📄 See [PDF page 5](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=5) — toolchain overview (compiler, assembler, linker).

### Harvard Processor Program Loading

> 📄 See [PDF page 6](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=6) — separate instruction and data bus loading.

### 4-Bit Register from D Flip-Flop

> 📄 See [PDF page 7](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=7) — register built from D flip-flops storing 4 bits.

### ALU with Registers

> 📄 See [PDF page 8](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=8) — Arithmetic Logic Unit connected to register bank.

### Assembly Code Examples

> 📄 See [PDF page 9–11](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=9) — assembly code examples showing load, store, and arithmetic operations.

### How Software Orders the CPU to Run

> 📄 See [PDF page 12](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=12) — instruction execution flow in the processor.

### Memory System — Software and Data Storage

> 📄 See [PDF page 13](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=13) — memory hierarchy and how software/data are stored.

### Von Neumann vs Harvard Architecture

> 📄 See [PDF page 14](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=14) — comparison of the two fundamental computer architectures:
> - **Von Neumann:** single bus for instructions and data
> - **Harvard:** separate buses for instructions and data

---

## Microcontroller

- A complete computer on a single chip
- **Processor**
- **Memory**
- **I/O**

### A Photo of MCU Die

- 128K Flash EEPROM
  - 4 × 32K
- 8K RAM
  - 2 × 4K
- 2K EEPROM

[MCI Journal article](http://www.mcjournal.com/articles/arc105/arc105.htm)

> 📄 See [PDF page 16](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=16) for the die photo.

---

## ARM Cortex Architecture

- **Harvard architecture** — separate buses for instructions and data

### Cortex Family Comparison

| Feature | Cortex-A8 | Cortex-R4 | Cortex-M3 |
|---------|-----------|-----------|-----------|
| Architecture | ARMv7-A | ARMv7-R | ARMv7-M |
| MMU / MPU | MMU | MPU (optional) | MPU (optional) |
| Bus | AXI | AXI | AHB Lite & APB |
| Extras | VFP & NEON | Dual Issue | — |

### Embedded ARM Cortex Processors

#### Cortex-M0

- Ultra low gate count (less than 12K gates)
- Ultra low-power (3 μW/MHz)
- 32-bit processor
- Based on ARMv6-M architecture

#### Cortex-M3

- The mainstream ARM processor for microcontroller applications
- High performance and energy efficiency
- Easy migration path from FPGA to ASIC
- Advanced 3-stage pipeline
- Based on ARMv7-M architecture

#### Cortex-M4

- Embedded processor for DSP
- FPU (Floating Point Unit)
- Based on ARMv7E-M architecture

#### Cortex-M7

- Highest performance Cortex-M processor
- Superscalar 6-stage pipeline
- Optional double-precision FPU
- Based on ARMv7E-M architecture

---

## STM32F746NG Block Diagram

> 📄 See [PDF page 27](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=27) — STM32F746NG internal block diagram.

---

## Bus Matrix

> 📄 See [PDF page 28](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=28) — bus matrix interconnect diagram.

---

## Processor Core Registers

> 📄 See [PDF page 29](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=29) — Cortex-M register bank:
> - 13 general-purpose registers (R0–R12)
> - Stack Pointer (SP / R13)
> - Link Register (LR / R14)
> - Program Counter (PC / R15)

### Program Status Register (PSR)

> 📄 See [PDF page 30](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=30) — PSR flags:
> - **N** — Negative
> - **Z** — Zero
> - **C** — Carry
> - **V** — Overflow

---

## Memory Technology

### 1. RAM (Random Access Memory)

- **Volatile**
- Static RAM (MOS/MOSFET)
- Dynamic RAM (Capacitor)
- Used for: local variables, stack, heap

### 2. ROM (Read Only Memory)

- **Non-volatile**
- More complicated to write
- Used for: code + constants

---

## Types of ROM

| Type | Full Name | Description |
|------|-----------|-------------|
| Masked ROM | — | Programmed at manufacturing; cannot be changed |
| PROM | Programmable Read-Only Memory | One-time programmable by user |
| EPROM | Erasable Programmable Read-Only Memory | Erased by UV light, then reprogrammed |
| EEPROM | Electrically Erasable Programmable Read-Only Memory | Erased and programmed electrically, one byte at a time |
| Flash Memory | — | Erased and programmed in blocks; NOR / NAND variants |

---

## EEPROM vs Flash Memory

> 📄 See [PDF page 33](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=33) for comparison diagram.

| Characteristic | EEPROM | Flash Memory |
|---------------|--------|-------------|
| Erase granularity | One byte at a time | In blocks |
| Write speed | Slower (~10 s per byte) | Faster (~1 s per byte) |
| Erase/write cycles | ~10,000–100,000 | Unlimited |
| Cost | More expensive | Less expensive |
| Typical use | External memory for microcontroller | Store code inside microcontroller |

---

## Memory Comparison

> 📄 See [PDF page 34](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=34) for full comparison table.

| Characteristic | DRAM | Static RAM | Flash Memory |
|---------------|------|-----------|-------------|
| Static | No | Yes | Yes |
| Volatile | Yes | Yes | No |
| Typical size | 256 Mbits | 64 Mbits | 256 Mbits |
| Organization | 4 bits × 64 M | 8 bits × 8 M | 8 bits × 32 M |
| Access time | 10 ns | 2 ns | 40 ns |
| Application | Main store | Cache memory | BIOS, digital film, MP3 |

---

## SRAM (Static RAM)

### SRAM Cell

> 📄 See [PDF page 36–37](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=36) — 6-transistor SRAM cell diagram and structure.

### SRAM Read Cycle Timing

> 📄 See [PDF page 38](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=38)

### SRAM Write Cycle Timing

> 📄 See [PDF page 39](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=39)

---

## DRAM (Dynamic RAM)

### DRAM vs SRAM — Capacity & Access Time

> 📄 See [PDF page 41](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=41) — chart comparing DRAM, SRAM, and MRAM by capacity (256K to 256M) and access time (2 ns to 100 ns).

### DRAM Bit Cell

> 📄 See [PDF page 42](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=42) — 1-transistor 1-capacitor DRAM cell diagram.

### DRAM Cell Structure

> 📄 See [PDF page 43](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=43)

### DRAM Read Cycle Timing

> 📄 See [PDF page 44](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=44)

### DRAM Write Cycle Timing

> 📄 See [PDF page 45](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=45)

### DDR2 DIMM Example

> 📄 See [PDF page 46](documents/microcontroller-lec02-cortex-arch-20260630.pdf#page=46) — DDR2-PC2-5300U 2GB 667 MHz DIMM (Dual Inline Memory Module).

---

## Summary

- Simple register made from D Flip-Flops — stores digital bits
- Cortex-M is **Harvard architecture** (separate instruction and data buses)
- Cortex-M has **16 registers**:
  - 13 general-purpose registers
  - 3 special registers: SP (Stack Pointer), LR (Link Register), PC (Program Counter)
- **N, Z, C, V** flags of the Program Status Register
- **Memory types:**
  - RAM (volatile — SRAM, DRAM)
  - ROM (non-volatile — Masked ROM, PROM, EPROM, EEPROM, Flash)
