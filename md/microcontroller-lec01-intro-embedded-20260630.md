# Microcontroller Lec01 — Introduction to Embedded Systems (2026)

> 📄 [View original PDF](documents/microcontroller-lec01-intro-embedded-20260630.pdf) — source of truth

---

**Introduction to Embedded Systems**  
Sorayut Glomglome

---

## Content

1. Embedded Systems
2. Microprocessor
3. Microcontroller
4. Development Process
5. A Little History of ARM
6. Microcontroller Boards

---

## Learning Outcomes

1. Explain the difference between microprocessor, microcontroller, and embedded systems.
2. Understand development process for embedded systems.

---

## How Do They Differ?

### Normal Rice Cooker

- Spring-loaded mechanism
- Simple on/off operation
- Cooks rice only

### Smart Rice Cooker

- Microcontroller programmed
- Multiple modes: stew, porridge, etc.
- Precise temperature and timing control

---

## Embedded Systems

- Embedded system is the equipment that has computer inside — focus on controlling, not computing.
- e.g. electric consumer products
- Ubiquitous, invisible
- Hidden (computer inside)
- Dedicated purpose

---

## History of Embedded Systems

### 1960s — Early Milestones

- **1961** — Charles Stark Draper developed an integrated circuit to reduce the size and weight of the Apollo Guidance Computer at MIT. The first computer to use ICs, it helped astronauts collect real-time flight data.
- **1965** — Autonetics (now part of Boeing) developed the D-17B, the computer used in missile guidance systems. Widely recognized as the first mass-produced embedded system.
- **1968** — The first embedded system for a vehicle was released; the Volkswagen 1600 used a microprocessor to control its electronic fuel injection system.

> 📷 DSKEY input module alongside the Apollo Guidance Computer main casing.  
> 📷 Autonetics D-17 guidance computer from a Minuteman I missile.

### 1970s — First Microcontrollers & Microprocessors

- **1971** — Texas Instruments developed the TMS1000, the first microcontroller
  - Commercial in 1974
  - 4-bit, ROM, RAM, $2 in bulk order
- **1971** — Intel released commercially the 4004, 4-bit microprocessor used in calculators and small electronics
- **1972** — Intel released the 8080, 8-bit microprocessor
- **1978** — Intel released the 8086, 16-bit microprocessor — started the x86 series

### 1980s–1990s — Embedded Operating Systems

- **1987** — First embedded operating system, the real-time VxWorks, released by Wind River
- **1996** — Microsoft released Windows Embedded CE
- **Late 1990s** — First embedded Linux products began to appear

---

## Simple Block Diagram for Embedded System

> 📄 See [PDF page 9](documents/microcontroller-lec01-intro-embedded-20260630.pdf#page=9) — block diagram showing a microcontroller with its I/O processing over time.

---

## Examples of Embedded Systems

### Vending Machine

- One of the good examples of embedded systems
- Single microcontroller as the main component
- **Input devices:** keypad and coin counter module
- **Output devices:** LCD display and gate actuator
- **Communication:** 3G/4G

### Segway

- Personal transporter device
- Uses gyroscopes to maintain horizontal balance
- When gyroscopes detect imbalance, motor rotates to move Segway forward proportional to the measured data — preventing the fall
- When balance is restored, motor stops rotating
- Composed of microcontroller, sensors, and actuators
- [Gyroscope operation (GIF)](https://en.wikipedia.org/wiki/File:Gyroscope_operation.gif)

---

## Control Systems

### Closed Loop Control Systems
- Use sensor data to achieve accurate control
- Compare the setpoint and the actual point
- e.g. heater element in the oven
- More accurate
- Need fast microcontroller

### Open Loop Control Systems
- Don't use sensor data
- Use calibrated actuator
- e.g. motor speed control with input voltage
- Uncomplicated

---

## Microprocessor

> 📄 See [PDF page 13](documents/microcontroller-lec01-intro-embedded-20260630.pdf#page=13) — Harvard architecture diagram: separate data memory and program memory, I/O block receiving input and passing to the processor/CPU.

- **Intel:** 4004, 8080, x86
- **Freescale:** 6800, PowerPC
- **Arm, DEC, SPARC, MIPS** …

### RC2014 Mini — Single Board Z80 Computer Kit

- Z80
- 62256 Static RAM
- 27C512 EPROM
- MC68B50 UART

- [Tindie product page](https://www.tindie.com/products/semachthemonkey/rc2014-mini-single-board-z80-computer-kit/)
- [RC2014 Mini module page](http://rc2014.co.uk/modules/rc2014-mini/)
- [RC2014 Mini PDF schematic](http://rc2014.co.uk/wp-content/uploads/2016/10/RC2014-Mini.pdf)

### Intel Core2 + Q45 Chipset

> 📄 See [PDF page 16](documents/microcontroller-lec01-intro-embedded-20260630.pdf#page=16)

### Cortex-A57 Block Diagram

> 📄 See [PDF page 17](documents/microcontroller-lec01-intro-embedded-20260630.pdf#page=17)

---

## Microcontroller

- A single chip that composes of 3 essential components:
  - **Processor core**
  - **Memory**
  - **Input/Output (Peripheral)**
- Main application is to control
- Examples: PIC, 8051, ARM7TDMI, Cortex
- Arduino

### Intel MCS-51 (8051 Microcontroller)

> 📄 See [PDF page 19](documents/microcontroller-lec01-intro-embedded-20260630.pdf#page=19) — technical specifications of the Intel MCS-51 (8051) microcontroller.

[Nuvoton W78E058DDG product page](https://direct.nuvoton.com/en/w78e058ddg)

---

## Development

- Machine Code
- Assembly
- High Level Language (Bare Metal)
  - C, C++
- Hardware Abstraction Layer (HAL)
- Real-time Operating System
  - FreeRTOS, ThreadX, mbedOS, Apache Mynewt, MicroC/OS-III, Contiki
- Linux (Embedded Linux)

### Development Process

- Write the source code
- Compile the source code into binary machine code
- Download the binary image into microcontroller

---

## A Little History of ARM

### The Acorn Era (1980s)

- **1981** — Computers produced by Acorn Computer became popular in schools and universities in the UK
- Acorn used the 6502, an 8-bit microprocessor made by MOS Technology
- Same year, IBM produced its first PCs using a more powerful Intel 16-bit microprocessor, the 8088
- Around the 1980s, the influence of IBM PC grew, and its smaller competitors began to fade
- Despite Acorn's UK success, it did not export well

### The Pivot to IP Licensing

Acorn designers' realization:

- They had the capability to design the microprocessor
- Their future might not lie in selling the completed computer itself
- They didn't need to manufacture silicon — sell IP (Intellectual Property) instead
- So they established **Advanced RISC Machines** (later called ARM Holdings) to accomplish this

### Acquisitions

- **2016** — SoftBank acquired ARM for $31 Billion USD
  - [The Verge article](http://www.theverge.com/2016/9/5/12798302/softbank-arm-acquisition-complete)
- **2020** — Nvidia proposed to buy ARM for $40 Billion
  - **Deal terminated in Feb 2022**
  - [NYTimes: Nvidia Deal to Buy Arm Is Off](https://www.nytimes.com) — *Nvidia Deal to Buy Arm From SoftBank Is Off After Setbacks*
  - [Bloomberg: Nvidia Prepares to Abandon $40 Billion Arm Bid](https://www.bloomberg.com)

---

## Microcontroller Boards

### Nucleo-F767ZI

- ARM 32-bit Cortex-M7 + DPFPU
- 2 MB Flash / 512 KB SRAM
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

### Microcontroller Specification (STM32F767ZI)

| Feature | Spec |
|---------|------|
| CPU | ARM 32-bit Cortex-M7 with FPU @ 216 MHz |
| Flash | Up to 2 MB |
| SRAM | Up to 512 KB |
| I/O Ports | Up to 168 (166 are 5V-tolerant) with interrupt capability |
| ADC | 3 × 12-bit |
| DAC | 2 × 12-bit |
| Timers | Up to 18 |
| Communication Interfaces | Up to 28 |
| I²C | Up to 4 (SMBus/PMBus) |
| USART | Up to 4 |
| SPI | 6 |
| USB | 2.0 full-speed device/host/OTG with on-chip PHY |

- [STM32F767ZI product page](https://www.st.com/en/microcontrollers/stm32f767zi.html)

### Pinout

> 📄 See [ST User Manual DM00244518](https://www.st.com/content/ccc/resource/technical/document/user_manual/group0/26/49/90/2e/33/0d/4a/da/DM00244518/files/DM00244518.pdf/jcr:content/translations/en.DM00244518.pdf#page=34) page 34/88 for the Nucleo-F767ZI pinout.

### Arduino Uno R3 Pinout and Shield

> 📄 See [PDF page 45](documents/microcontroller-lec01-intro-embedded-20260630.pdf#page=45) — Arduino Uno R3 overview and pinout.

### Other ST Discovery Boards

| Board | Links |
|-------|-------|
| **32F746G Discovery** | [ST page](https://www.st.com/en/evaluation-tools/32f746gdiscovery.html) · [Mbed](https://os.mbed.com/platforms/ST-Discovery-F746NG/) |
| **B-L475E-IOT01A** | [ST page](https://www.st.com/en/evaluation-tools/b-l475e-iot01a.html) · [Mbed](https://os.mbed.com/platforms/ST-Discovery-L475E-IOT01A/) |

### Nucleo-F411RE

- ARM 32-bit Cortex-M4 CPU with FPU @ 100 MHz
- 512 KB Flash / 128 KB SRAM
- 1 user LED shared with Arduino
- 1 user and 1 reset push-buttons
- Board expansion connectors:
  - Arduino Uno V3
  - ST morpho extension pin headers
- Flexible power-supply options: ST-LINK USB VBUS or external sources
- On-board ST-LINK/V2-1 debugger/programmer with USB re-enumeration capability
  - Three interfaces on USB: mass storage, virtual COM port, and debug port

- [ST product page](http://www.st.com/en/evaluation-tools/nucleo-f411re.html)
- [Mbed platform page](https://os.mbed.com/platforms/ST-Nucleo-F411RE/)

### Nucleo-L432KC

- ARM 32-bit Cortex-M4 CPU @ 80 MHz
- 256 KB Flash / 64 KB SRAM
- 1 user LED
- 1 reset push-button
- Board expansion connectors: Arduino Nano V3
- Flexible power-supply options: ST-LINK, USB VBUS, or external sources
- On-board ST-LINK/V2-1 debugger/programmer with USB re-enumeration capability
  - Three interfaces on USB: mass storage, virtual COM port, and debug port

- [ST product page](https://www.st.com/en/evaluation-tools/nucleo-l432kc.html)
- [Mbed platform page](https://os.mbed.com/platforms/ST-Nucleo-L432KC/)

---

## Development with STM32CubeMX

- Intuitive STM32 microcontroller selection
- Microcontroller graphical configuration:
  - Pinout with automatic conflict resolution
  - Clock tree with dynamic validation of configuration
  - Peripherals and middleware functional modes and initialization with dynamic validation of parameter constraints
  - Power sequence with estimate of consumption results
- C code project generation covering STM32 microcontroller initialization compliant with IAR, Keil, and GCC compilers
- Available as a standalone software running on Windows, Linux, and macOS

---

## Toolchains

- Cross platform toolchain
- Editor / Compiler / Linker / Debugger

- [Keil MDK](http://www.keil.com/)
- [STM32CubeIDE](https://www.st.com/en/development-tools/stm32cubeide.html)

---

## Conclusion

- An embedded system contains tiny computers to control and decide.
- The embedded computer usually takes the form of a microcontroller:
  - Microprocessor core
  - Memory
  - Peripherals
- Embedded system design combines both hardware and software design.
- The microcontroller has an instruction set used for programming.
- Most programming is done in high level language, then compiled into binary recognized by the microcontroller.
- ARM has developed a range of effective microprocessor and microcontroller designs, widely applied in embedded systems.
