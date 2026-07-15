# Sysadmin Lec02 — System Installation & System Software (2026)

> 📄 [View original PDF](documents/sysadmin-lec02-system-software-20260630.pdf) — source of truth

Module 02
System Installation and System Software

---

## System Installation

The process of setting up, configuring, and preparing hardware or software to operate within a specific environment:

- Copying necessary files
- Establishing system connections
- Adjusting settings

---

## System Software

Software that provides a platform for other software. Examples include:

| Type | Description |
|---|---|
| **Firmware** | Low-level software embedded in hardware (e.g., BIOS, UEFI) |
| **Utility Programs** | Tools for system maintenance (e.g., disk partitioning, memory testing) |
| **Operating Systems** | Core platform software (e.g., Linux, Windows, macOS) |
| **Device Drivers** | Software that controls hardware peripherals |
| **Hypervisors** | Virtualization layer for running multiple VMs |

---

## Basic Input/Output System (BIOS)

- A type of **firmware** used to provide runtime services for OSes and programs.
- BIOS comes pre-installed on the computer's motherboard.
- BIOS performs hardware initialization during the booting process (power-on startup).

> 📄 See [PDF page 5](documents/sysadmin-lec02-system-software-20260630.pdf#page=5) — BIOS screen.  
> 📄 See [PDF page 6](documents/sysadmin-lec02-system-software-20260630.pdf#page=6) — Legacy BIOS boot process diagram.
> 📄 See also: [Wikipedia: Booting](https://en.wikipedia.org/wiki/Booting) for a picture illustrating the boot sequence.

---

### Master Boot Record (MBR)

- The MBR holds the information on how the disc's sectors are divided into **partitions**, each partition notionally containing a file system.
- The MBR also contains executable code to function as a **loader** for the installed OS.
- This MBR code is usually referred to as a **boot loader**, such as GNU GRUB, BOOTMGR.

---

### BIOS Limitations

| Limitation | Detail |
|---|---|
| **Storage cap** | MBR uses 32-bit values for sector counts → max addressable storage space of **2.2 TB**. |
| **Partition limit** | MBR only supports a maximum of **4 primary partitions**. |
| **Memory limit** | BIOS runs in 16-bit real mode → only addresses **1 MB** of system memory. Cannot easily initialize multiple hardware peripherals simultaneously → slower boot times. |
| **No verification** | BIOS executes any code found in the boot sector without verification → highly vulnerable to **rootkits** and **bootkits** (malware that loads before the OS and antivirus). |

---

## Unified Extensible Firmware Interface (UEFI)

- BIOS limitations had become too restrictive for larger server platforms.
- UEFI is a specification for the firmware architecture to overcome BIOS limitations.
- UEFI works with the **GUID Partition Table (GPT)** partitioning scheme, which is free from many of the limitations of MBR.
- UEFI supports 32-bit or higher processor architectures.
- Only processors with a little-endian mode are supported.

### UEFI Secure Boot

- A feature in UEFI firmware that verifies the **digital signature** of the bootloader against a trusted list of keys embedded in the firmware.
- If the code has been tampered with or is from an unverified source, Secure Boot stops the process.
- UEFI is supported by Microsoft Windows and most modern Linux distros.

---

## Power-On Self-Test (POST)

- Both BIOS and UEFI perform power-on self-test before a boot loader loads an OS.
- BIOSes commonly use a sequence of **beeps** from the motherboard-attached PC speaker (if present and working) to signal error codes.
- POST beep codes vary from manufacturer to manufacturer.

---

## Good-to-Know Utility Programs

| Tool | Purpose |
|---|---|
| **GParted** | Disk partition management |
| **Clonezilla** | Disk cloning and imaging |
| **Memtest86+** | Memory test |
| **TestDisk** | Disk test |

> How to use these tools is out of scope for this course.

---

### 10-Minute Discussion

**What are common hardware problems that you have encountered in the past?**

For example: disk failure, corrupted boot partition, etc.

- Could you identify the issues by yourself?
- How did you confirm your hypotheses?

---

## Operating Systems

| Category | Examples |
|---|---|
| **Personal Computers** (Desktop & Laptop) | Microsoft Windows, macOS, Chrome OS, Linux |
| **Mobile Phones & Tablets** | Android, Apple iOS |
| **Servers** | Unix, BSD, Linux, Windows Server |

---

### Server Operating Systems

| Family | Examples |
|---|---|
| **Unix** | IBM AIX, HP-UX, Oracle Solaris |
| **BSD** | FreeBSD, NetBSD, OpenBSD, etc. |
| **Linux** | Red Hat Enterprise Linux, Fedora, Debian, Ubuntu |
| **Microsoft Windows Server** | Windows Server 2025, 2022, 2016, 2012, 2008, … |

---

#### Unix

- Family of multitasking, multi-user computer operating systems.
- Derived from the original AT&T Unix.
- Original Unix was developed in **1969** at the Bell Labs research center.

#### Berkeley Software Distribution (BSD)

- First released in 1978, it began as an improved derivative of AT&T's original Unix developed at Bell Labs.
- Berkeley ended its Unix research in 1992.
- The term "BSD" came to refer primarily to its open-source descendants, including FreeBSD, OpenBSD, NetBSD, etc.

#### Linux

- Family of open-source software Unix-like OSes based on the Linux kernel.
- The Linux kernel was created by **Linus Torvalds**.
- Many thousands of Linux distributions (distros) exist.

#### Microsoft Windows Server

- Microsoft Windows but for servers.
- Great for managing multiple Windows desktops & laptops for enterprises.
- Main releases: Windows Server 2025, 2022, 2016, 2012, 2008, …

---

## Hypervisors

A specialized software layer that enables multiple isolated **virtual machines (VMs)** to share a single physical host computer. Also known as a **virtual machine monitor**. Ensures VMs cannot interfere with one another.

### Type 1 Hypervisor (Bare-Metal)

- These hypervisors run directly on the host's hardware to control the hardware and to manage guest operating systems.
- They are sometimes called **bare-metal hypervisors**.
- Examples: VMware ESXi, Xen.

### Type 2 Hypervisor (Hosted)

- These hypervisors run on a conventional operating system (OS) just as other computer programs do.
- Type-2 hypervisors abstract guest operating systems from the host operating system, effectively creating an isolated system that can be interacted with by the host.
- Examples: VirtualBox, VMware Workstation.

```
  Type 1 (Bare-Metal / Native)          Type 2 (Hosted)

  ┌──────┐ ┌──────┐ ┌──────┐           ┌──────┐ ┌──────┐ ┌──────┐
  │  OS  │ │  OS  │ │  OS  │           │  OS  │ │  OS  │ │  OS  │
  └──┬───┘ └──┬───┘ └──┬───┘           └──┬───┘ └──┬───┘ └──┬───┘
     └────────┼────────┘                  └────────┼────────┘
         ┌────┴─────┐                         ┌────┴─────┐
         │HYPERVISOR│                         │HYPERVISOR│
         └────┬─────┘                         └────┬─────┘
         ┌────┴─────┐                         ┌────┴─────┐
         │ HARDWARE │                         │ HOST OS  │
         └──────────┘                         └────┬─────┘
                                              ┌────┴─────┐
                                              │ HARDWARE │
                                              └──────────┘
```

> 📄 See [PDF page 30](documents/sysadmin-lec02-system-software-20260630.pdf#page=30) — Type 1 vs Type 2 hypervisor diagram.

---

## It's Time to Get Your Hands Dirty!

1. Install on your machine a type-2 hypervisor: either **VirtualBox** or **VMware Workstation**.
2. Create a virtual machine with **1 vCPU**, **1.5 GB** of memory, and **6 GB** of disk.
3. Install **Ubuntu Server 26.04 LTS** on your VM.

> You may try **Alpine Linux** if your machine doesn't have enough resources. 512 MB of memory is OK!
