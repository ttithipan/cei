# OS Lec01 — Introduction (2026)

> 📄 [View original PDF](documents/os-lec01-introduction-20260630.pdf) — source of truth  
> ⚠️ The original lecture slides are intentionally sparse — the professor expects students to take notes during class. The content below has been supplemented with explanations to make this summary self-contained.

---

## Introduction

An operating system (OS) is the fundamental software layer that sits between applications and hardware. It manages the computer's resources — CPU, memory, storage, I/O devices — and provides a stable, consistent interface for programs to run on. Without an OS, every application would need its own hardware drivers, memory manager, and scheduler.

---

### First Era

- No OS (before 1956)
  - Programs were run directly on bare metal — programmers wrote machine code and had complete control of the hardware
  - Computers like the Colossus (1943, Bletchley Park) were single-purpose, hardwired machines used for code-breaking during WWII
  - No abstraction layer existed between the program and the hardware

> 📄 See [PDF page 2](documents/os-lec01-introduction-20260630.pdf#page=2) — Frontal view of the reconstructed Colossus at The National Museum of Computing, Bletchley Park (image from Wikipedia)

---

### Next Era

[The concepts of OS started in 1956 at GM research lab.]

[Christie's — Gen One: Paul Allen History of Technology](https://www.christies.com/stories/gen-one-paul-allen-history-of-technology-ef080682a70e4a97a53864b475333b12)

In this picture:

- DEC PDP-10
- 1966–1983
- OS: TOPS-10
- Timesharing/Total Operating System-10

---

### A Brief History of OS

**Early Operating Systems: Computers were very expensive (1956 – 1960s)**

- One application at a time
- Had complete control of hardware
- OS was runtime library
- Users would stand in line to use the computer
- Batch systems
  - Keep CPU busy by having a queue of jobs
  - OS would load next job while current one runs
  - Users would submit jobs, and wait, and wait, and…

**Time-Sharing Operating Systems: Computers and People were Expensive (1960s – 1970s)**

- ~1959 Integrated circuit was introduced
- Computing power was increased
- Multiple users on computer at same time
- Multiprogramming: run multiple programs at same time
- Interactive performance: try to complete everyone's tasks quickly
- As computers became cheaper, more important to optimize for user time, not computer time

**Today's Operating Systems: Computers are cheap (1980 – today)**

- Smartphones
- Embedded systems
- Laptops
- Tablets
- Virtual machines
- Data center servers

**Tomorrow's Operating Systems**

- Giant-scale data centers
- Increasing numbers of processors per computer
- Increasing numbers of computers per user
- Very large scale storage

---

### Activity #1 (10 minutes)

In the opinion of students, what are the main roles of an operating system?

---

### Roles of the Operating System

- **Referee:**
  - Resource allocation among users, applications
  - Isolation of different users, applications from each other
  - Communication between users, applications
- **Illusionist**
  - Each application appears to have the entire machine to itself
  - Infinite number of processors, (near) infinite amount of memory, reliable storage, reliable network transport
- **Glue**
  - Libraries, user interface widgets, …

---

### Activity #2 (10 minutes)

What is an Operating System?

---

### What is an Operating System?

A set of software that manages computer's resources for its users and their applications.

- May be visible or invisible to the user
- 2 major kinds
  - General purpose OS
  - Specific purpose OS

---

### Activity #3 (10 minutes)

If you were to evaluate any operating system, what aspects should you assess, and how should each aspect be measured?

---

### Operating System Evaluation

- Reliability and Availability
- Security
- Portability
  - **AVM** (Abstract Virtual Machine): provides a consistent execution environment regardless of the underlying hardware
  - **API** (Application Programming Interface): the set of functions and protocols that applications use to request OS services
  - **HAL** (Hardware Abstraction Layer): isolates the OS kernel from hardware-specific details, making the OS portable across different hardware platforms
- Performance
  - Overhead, efficiency
  - Fairness, response time, throughput
  - Performance predictability
- Adoption

---

## Design Tradeoffs

OS design involves balancing the **five evaluation criteria** listed above: Reliability, Security, Portability, Performance, and Adoption. Improving one often hurts others.

| Tradeoff | Effect | Why |
|----------|--------|-----|
| Preserve legacy API | Security ↓, Portability ↑, Reliability ↓| Old interfaces keep software running but increase attack surface and bug potential |
| Break an abstraction | Performance ↑, Portability ↓, Reliability ↓ | Direct hardware access speeds things up but ties code to specific hardware and risks crashes |
