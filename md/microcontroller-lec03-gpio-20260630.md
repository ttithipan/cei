# Microcontroller Lec03 — General Purpose Input/Output (GPIO) (2026)

> Extracted from PDF — `microcontroller-lec03-gpio-20260630.pdf`

---

**General Purpose Input/Output (GPIO)**  
Microcontroller Interfacing  
Sorayut Glomglome

---

## Digital Output

- LED
- Writing digital signal to external IC

[Stratify Labs: Using LEDs in Embedded Designs](https://blog.stratifylabs.co/device/2013-10-24-Using-LEDs-in-Embedded-Designs/)

---

## Digital Input

- **Bounce → DeBounce**
- Push Button
- Switch
- Reading signal from external IC

[Pull-up / Pull-down explanation (Thai)](https://www.itbakery.net/2018/03/21/pull-up-pull-down-%E0%B8%84%E0%B8%B7%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3/)

---

## Nucleo-F767ZI

บอร์ดสำหรับการทดลอง Nucleo-F767ZI

- 3 user LEDs shared with Arduino
- 1 user and 1 reset push-buttons
- Board expansion connectors:
  - Arduino Uno V3
  - ST morpho extension pin headers
- Flexible power-supply options: ST-LINK USB VBUS or external sources
- On-board ST-LINK/V2-1 debugger/programmer with USB re-enumeration capability
  - Three interfaces on USB: mass storage, virtual COM port, and debug port

- [ST product page](https://www.st.com/en/evaluation-tools/nucleo-f767zi.html)
- [Mbed platform page](https://os.mbed.com/platforms/ST-Nucleo-F767ZI/)

---

## STM32F767ZI & GPIO

- GPIO Ports: **A, B, C, D, E, F, H, I, J, K**
- Each port is 16 pins:
  - PA[0] – PA[15]
  - PB[0] – PB[15]
  - …
  - PJ[0] – PJ[15]
  - PK[0] – PK[7]

### LQFP144 Package

> 📄 See [PDF page 6](documents/microcontroller-lec03-gpio-20260630.pdf#page=6)

LQFP: Low Profile Quad Flat Package

### Board Pin Out

> 📄 See [PDF page 7–8](documents/microcontroller-lec03-gpio-20260630.pdf#page=7) — board pin out and bottom layout.

### Pinout

> 📄 See [PDF page 9–10](documents/microcontroller-lec03-gpio-20260630.pdf#page=9) — pinout diagrams. Also available at [os.mbed.com](https://os.mbed.com/platforms/ST-Nucleo-F767ZI/).

### Pin Mapping Table

> 📄 See [PDF page 11](documents/microcontroller-lec03-gpio-20260630.pdf#page=11)

---

## General Purpose Input/Output

- Basic interfacing between MCU and real world
- Digital signal

### Absolute Maximum Rating

> 📄 See [PDF page 13](documents/microcontroller-lec03-gpio-20260630.pdf#page=13)

### Related Documents

> 📄 See [PDF page 14](documents/microcontroller-lec03-gpio-20260630.pdf#page=14)

---

## Working with Larger DC Loads

- MCU can drive simple DC loads directly with its digital I/O pins (±25 mA)
- MCU can't drive a load (e.g. motor) which needs more current than the MCU port pin can supply
- Need an interfacing circuit to draw current from a higher voltage

- A good switching transistor for small DC loads is the **ZVN4206A**
- The maximum VGS threshold value is 3 V
- MOSFET will respond to the 3.3V Logic 1 output level of the MCU

### DC Motor with Flying Diode

> 📄 See [PDF page 16](documents/microcontroller-lec03-gpio-20260630.pdf#page=16)

---

## Memory Organization

- Program memory, data memory, registers, and I/O ports are organized within the same linear **4-Gbyte address space**
- Bytes are coded in memory in **little endian** format
  - The lowest numbered byte in a word is the word's least significant byte; the highest numbered byte is the most significant
- Addressable memory space is divided into **8 main blocks**, each of 512 MB

### Big-Endian and Little-Endian Format

> 📄 See [PDF page 18](documents/microcontroller-lec03-gpio-20260630.pdf#page=18)

### Memory Map

> 📄 See [PDF page 19–21](documents/microcontroller-lec03-gpio-20260630.pdf#page=19) — STM32F767ZI memory map diagrams.

---

## GPIO Registers

Each general-purpose I/O port has:

- Four 32-bit configuration registers: `GPIOx_MODER`, `GPIOx_OTYPER`, `GPIOx_OSPEEDR`, `GPIOx_PUPDR`
- Two 32-bit data registers: `GPIOx_IDR`, `GPIOx_ODR`
- 32-bit set/reset register: `GPIOx_BSRR`
- 32-bit locking register: `GPIOx_LCKR`
- Two 32-bit alternate function registers: `GPIOx_AFRH`, `GPIOx_AFRL`

### GPIO Pin Modes

Each port bit can be individually configured in software:

| Mode | Description |
|------|-------------|
| Input floating | No pull-up/pull-down |
| Input pull-up | Weak pull-up enabled |
| Input pull-down | Weak pull-down enabled |
| Analog | ADC/DAC connection |
| Output open-drain | With pull-up/pull-down capability |
| Output push-pull | With pull-up/pull-down capability |
| Alternate function push-pull | Peripheral-driven, push-pull |
| Alternate function open-drain | Peripheral-driven, open-drain |

### Basic Structure of a GPIO Bit (5V Tolerant)

> 📄 See [PDF page 23](documents/microcontroller-lec03-gpio-20260630.pdf#page=23)

---

## GPIO Operation

- During and just after reset, alternate functions are **not active** and I/O ports are configured in **Input Floating mode** (`MODERx[1:0]=00b`, `PUPDRx[1:0]=00b`)
- When configured as output, the value written to `GPIOx_ODR` is output on the I/O pin
  - Push-Pull mode or Open-Drain mode (only N-MOS activated when outputting 0)
- `GPIOx_IDR` captures the data present on the I/O pin at every AHB1 clock cycle
- All GPIO pins have internal weak pull-up and weak pull-down which can be activated when configured as input

---

## GPIO Atomic Bit Set or Reset

- **Atomic Read/Modify access** — no interruption in the middle to cause errors
- Atomic operations ensure the desired change is not interrupted (no partial set/reset)
- No need to disable interrupts when programming `GPIOx_ODR` at bit level
- Modify only one or several bits in a single atomic AHB1 write access
- Program `1` to the Bit Set/Reset Register (`GPIOx_BSRR`, or `GPIOx_BRR` for reset only) to select bits to modify
  - Unselected bits are not modified

---

## Input Configuration

When the I/O Port is programmed as **Input**:

- The Output Buffer is **disabled**
- The Schmitt Trigger Input is **activated**
- Weak pull-up and pull-down resistors are activated or not depending on configuration (pull-up, pull-down, or floating)
- Data present on the I/O pin is sampled into the Input Data Register every AHB1 clock cycle
- A read access to the Input Data Register obtains the I/O state

> 📄 See [PDF page 27](documents/microcontroller-lec03-gpio-20260630.pdf#page=27) — input configuration diagram.

### Schmitt Trigger

> 📄 See [PDF page 28–29](documents/microcontroller-lec03-gpio-20260630.pdf#page=28) — Schmitt trigger circuit and output waveform.

---

## Output Configuration

When the I/O Port is programmed as **Output**:

- The Output Buffer is **enabled**:
  - **Open Drain Mode:** A `0` in the Output register activates the N-MOS; a `1` leaves the port in Hi-Z (P-MOS never activated)
  - **Push-Pull Mode:** A `0` activates the N-MOS; a `1` activates the P-MOS
- The Schmitt Trigger Input is **activated**
- Weak pull-up and pull-down resistors are **disabled**
- Data present on the I/O pin is sampled into `GPIOx_IDR` every AHB1 clock cycle
- Read `GPIOx_IDR` gets the I/O state; read `GPIOx_ODR` gets the last written value

> 📄 See [PDF page 31–33](documents/microcontroller-lec03-gpio-20260630.pdf#page=31) — output configuration, data register, and push-pull diagrams.

---

## Alternate Function Configuration

When the I/O Port is programmed as **Alternate Function**:

- The Output Buffer is turned on in Open Drain or Push-Pull configuration
- The Output Buffer is driven by the signal from the peripheral (alternate function out)
- The Schmitt Trigger Input is **activated**
- Weak pull-up and pull-down resistors are **disabled**
- Data present on the I/O pin is sampled into `GPIOx_IDR` every AHB1 clock cycle
- Read `GPIOx_IDR` gets the I/O state (open drain mode)
- Read `GPIOx_ODR` gets the last written value (push-pull mode)

> 📄 See [PDF page 35–36](documents/microcontroller-lec03-gpio-20260630.pdf#page=35) — alternate function configuration diagrams.

---

## Analog Configuration

When the I/O Port is programmed as **Analog**:

- The Output Buffer is **disabled**
- The Schmitt Trigger Input is **de-activated** — zero consumption for every analog value
- The output of the Schmitt Trigger is forced to a constant value (0)
- Weak pull-up and pull-down resistors are **disabled**
- Read access to the Input Data Register gets the value `0`

> 📄 See [PDF page 38](documents/microcontroller-lec03-gpio-20260630.pdf#page=38) — analog I/O configuration diagram.

---

## GPIO Register Reference

> 📄 Register bit layouts — see [PDF pages 39–50](documents/microcontroller-lec03-gpio-20260630.pdf#page=39)

| Register | Description |
|----------|-------------|
| `GPIOx_MODER` | Port mode register |
| `GPIOx_OTYPER` | Port output type register |
| `GPIOx_OSPEEDR` | Port output speed register |
| `GPIOx_PUPDR` | Port pull-up/pull-down register |
| `GPIOx_IDR` | Port input data register |
| `GPIOx_ODR` | Port output data register |
| `GPIOx_BSRR` | Port bit set/reset register |
| `GPIOx_LCKR` | Port configuration lock register |
| `GPIOx_AFRL` | Alternate function low register |
| `GPIOx_AFRH` | Alternate function high register |

> 📄 GPIO Bit Configuration Table — see [PDF page 50–51](documents/microcontroller-lec03-gpio-20260630.pdf#page=50)

---

## Accessing GPIO Registers in C

```c
#define PERIPH_BASE        ((uint32_t)0x40000000U)
#define AHB1PERIPH_BASE    (PERIPH_BASE + 0x00020000U)
#define GPIOA_BASE         (AHB1PERIPH_BASE + 0x0000U)
#define GPIOA              ((GPIO_TypeDef *) GPIOA_BASE)
```

### stm32f767xx.h

> 📄 See [PDF page 53](documents/microcontroller-lec03-gpio-20260630.pdf#page=53) — header file reference.

### GPIO Initialization

> 📄 See [PDF page 54](documents/microcontroller-lec03-gpio-20260630.pdf#page=54)

### GPIO Operations

> 📄 See [PDF page 55–57](documents/microcontroller-lec03-gpio-20260630.pdf#page=55)
