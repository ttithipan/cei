# Microcontroller Lec02–03 Supplement — STM32F7 Reference (2026)

> Extracted from PDF — `microcontroller-lec02-03-supplement-20260630.pdf`
> Source: STM32F765xx/767xx/768Ax/769xx datasheet (DS11532 Rev 7) and reference manual (RM0410 Rev 4)

---

## STM32F7 Block Diagram

> 📄 The block diagram is a visual diagram and cannot be fully represented in text. See [PDF page 1](documents/microcontroller-lec02-03-supplement-20260630.pdf#page=1) — Figure 2: STM32F765xx, STM32F767xx, STM32F768Ax and STM32F769xx block diagram.

**Key components visible in the diagram include:**

- **ARM Cortex-M7 CPU** with FPU, MPU, NVIC, ETM, I-Cache (16 KB) and D-Cache (16 KB)
- **AHB Bus-Matrix** (11S8M and 8S7M)
- **Memory:** Flash 1 MB, SRAM1 368 KB, SRAM2 16 KB, DTCM RAM 128 KB, ITCM RAM 16 KB, 4 KB Backup RAM
- **GPIO Ports:** A, B, C, D, E, F, G, H, I, J, K (PA[15:0] through PK[7:0])
- **Timers:** TIM1–TIM14, LPTIM1
- **Communication:** USART1/2/3/6, UART4/5/7/8, SPI1–6/I2S1–3, I2C1–4/SMBus, bxCAN1–3, SDMMC1/2, Ethernet MAC, USB OTG HS/FS, Quad-SPI, SAI1/2, SPDIFRX, HDMI-CEC
- **Analog:** 3× ADC (12-bit), 2× DAC (12-bit), temperature sensor
- **Display:** LCD-TFT controller, Chrom-ART (DMA2D), DSI Host with PHY
- **Other:** JPEG codec, DFSDM, RNG, CRC, RTC, WWDG, External Memory Controller (FMC), DMA1/2

> Note: The timers connected to APB2 are clocked from TIMxCLK up to 216 MHz, while timers connected to APB1 are clocked from TIMxCLK up to 108 MHz or 216 MHz depending on the TIMPRE bit in RCC_DCKCFGR.

---

## Memory Map

> 📄 See [PDF page 2](documents/microcontroller-lec02-03-supplement-20260630.pdf#page=2) — Figure 2: Memory map.

| Block | Address Range | Contents |
|-------|--------------|----------|
| **Block 0** | `0x0000 0000` – `0x1FFF FFFF` | Flash, ITCM RAM, System memory, Option bytes |
| — Flash (AXIM) | `0x0800 0000` – `0x081F FFFF` | 2 MB Flash memory on AXIM interface |
| — Flash (ITCM) | `0x0020 0000` – `0x003F FFFF` | Flash memory on ITCM interface |
| — ITCM RAM | `0x0000 0000` – `0x0000 3FFF` | 16 KB ITCM RAM |
| — System memory | `0x0010 0000` – `0x0010 EDBF` | Bootloader |
| — Option bytes | `0x1FFF 0000` – `0x1FFF 001F` | Configuration |
| **Block 1** | `0x2000 0000` – `0x3FFF FFFF` | SRAM |
| — SRAM1 | `0x2000 0000` – `0x2001 FFFF` | 368 KB |
| — SRAM2 | `0x2007 C000` – `0x2007 FFFF` | 16 KB |
| **Block 2** | `0x4000 0000` – `0x5FFF FFFF` | Peripherals |
| — APB1 | `0x4000 0000` – `0x4000 7FFF` | APB1 peripherals |
| — APB2 | `0x4001 0000` – `0x4001 6BFF` | APB2 peripherals |
| — AHB1 | `0x4002 0000` – `0x4007 FFFF` | AHB1 peripherals |
| — AHB2 | `0x5000 0000` – `0x5006 0BFF` | AHB2 peripherals |
| — AHB3 | `0x6000 0000` – `0xDFFF FFFF` | FMC (external memory) |
| **Block 3** | `0x6000 0000` – `0x7FFF FFFF` | FMC bank 1–2 |
| **Block 4** | `0x8000 0000` – `0x9FFF FFFF` | Quad-SPI and FMC bank 3 |
| **Block 5** | `0xC000 0000` – `0xCFFF FFFF` | FMC |
| **Block 6** | `0xD000 0000` – `0xDFFF FFFF` | FMC |
| **Block 7** | `0xE000 0000` – `0xFFFF FFFF` | Cortex-M7 internal peripherals (NVIC, SysTick, etc.) |
| — DTCM | `0x2000 0000` | DTCM RAM (128 KB) |
