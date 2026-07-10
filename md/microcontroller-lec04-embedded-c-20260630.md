# Microcontroller Lec04 — Embedded C (2026)

> Extracted from PDF — `microcontroller-lec04-embedded-c-20260630.pdf`

---

**Embedded C**  
Microcontroller Interfacing  
Sorayut Glomglome

> Based on: ELEC 3040/3050 Embedded Systems Lab (V. P. Nelson) — Fall 2014 ARM Version

---

## Outline

- Program organization and microcontroller memory
- Data types, constants, variables
- Microcontroller register/port addresses
- Operators: arithmetic, logical, shift
- Control structures: if, while, for
- Functions
- Interrupt routines

---

## Basic C Program Structure

```c
#include "stm32f767xx.h"
/* I/O port/register names/addresses for the STM32F767xx microcontrollers */

/* Global variables – accessible by all functions */
int count, bob;   // global (static) variables – placed in RAM

/* Function definitions */
int function1(char x) {
    // parameter x passed to the function, function returns an integer value
    int i, j;     // local (automatic) variables – allocated to stack or registers
    // -- instructions to implement the function
}

/* Main program */
void main(void) {
    unsigned char sw1;   // local (automatic) variable (stack or registers)
    int k;               // local (automatic) variable (stack or registers)

    /* Initialization section */
    // -- instructions to initialize variables, I/O ports, devices, function registers

    /* Infinite loop */
    while (1) {   // Can also use: for(;;) {
        // -- instructions to be repeated
    }
}
```

---

## STM32L100RC Memory Map

```
0xE00F FFFF ┌─────────────────────────┐
0xE000 0000 │ Cortex-M3 CPU registers  │  NVIC, SysTick Timer, etc.
            ├─────────────────────────┤
0x4002 67FF │ Peripheral registers     │  Timers, ADCs, UARTs, etc.
0x4000 0000 ├─────────────────────────┤
0x0803 FFFF │ 256 KB Flash memory      │  Program code & constant data
0x0800 0000 │ ← Reset & interrupt vectors in 1st words
            ├─────────────────────────┤
0x2000 3FFF │ 16 KB RAM                │  Variable & stack storage
0x2000 0000 └─────────────────────────┘
```

---

## Microcontroller Header File

Keil MDK-ARM provides a derivative-specific header file for each microcontroller, defining memory addresses and symbolic labels for CPU and peripheral function register addresses.

```c
#include "stm32f767xx.h"   /* target µC information */

// GPIOA configuration/data register addresses are defined in stm32f767xx.h
void main(void) {
    uint16_t PAval;               // 16-bit unsigned variable
    GPIOA->MODER &= ~(0x00000003); // Set GPIOA pin PA0 as input
    PAval = GPIOA->IDR;           // Set PAval to 16-bits from GPIOA
    for(;;) {}                    // execute forever
}
```

---

## C Compiler Data Types

Always match data type to data characteristics:
- `#bits` determines range of numeric values
- `signed/unsigned` determines which arithmetic/relational operators are used
- Non-numeric data should be **unsigned**
- Header file `stdint.h` defines alternate type names — eliminates ambiguity

| Declaration | Bits | Range |
|-------------|------|-------|
| `char k;` / `unsigned char k;` / `uint8_t k;` | 8 | 0 … 255 |
| `signed char k;` / `int8_t k;` | 8 | −128 … +127 |
| `short k;` / `signed short k;` / `int16_t k;` | 16 | −32,768 … +32,767 |
| `unsigned short k;` / `uint16_t k;` | 16 | 0 … 65,535 |
| `int k;` / `signed int k;` / `int32_t k;` | 32 | −2,147,483,648 … +2,147,483,647 |
| `unsigned int k;` / `uint32_t k;` | 32 | 0 … 4,294,967,295 |

> `intx_t` and `uintx_t` defined in `stdint.h`

### Data Type Examples

```c
uint16_t n;   n = GPIOA->IDR;    // Read bits from GPIOA (16 bits, non-numeric)
uint16_t t;   TIM2->PSC = t;     // Write TIM2 prescale value (16-bit unsigned)
uint32_t a;   a = ADC;           // Read 32-bit value from ADC (unsigned)
int32_t ctrl; ctrl = (x + y)*z;  // System control value range [-1000…+1000]
uint8_t cnt;                     // Loop counter for 100 program loops (unsigned)
for (cnt = 0; cnt < 20; cnt++) { … }
```

---

## Constant / Literal Values

- **Decimal** is the default format: `m = 453; n = -25;`
- **Hexadecimal:** preface with `0x` or `0X`: `m = 0xF312; n = -0x12E4;`
- **Octal:** preface with zero: `m = 0453; n = -023;`
  - ⚠️ Don't use leading zeros on decimal values — they'll be interpreted as octal!
- **Character:** single quotes or ASCII escape: `m = 'a';` (0x61), `n = '\13';` (return)
- **String (array):** `strcpy(m, "hello\n");`

---

## Program Variables

A variable is an addressable storage location. Each must be declared with size, type, and name.

```c
int x, y, z;    // declares 3 variables of type "int"
char a, b;      // declares 2 variables of type "char"
```

- Space may be allocated in registers, RAM, or ROM/Flash (for constants)
- Variables can be **automatic** or **static**

### Variable Arrays

An array is a set of data stored in consecutive memory locations.

```c
int n[5];       // declare array of 5 "int" values
n[3] = 5;       // set value of 4th array element
```

```
Address:  n      n+4    n+8    n+12   n+16
          n[0]   n[1]   n[2]   n[3]   n[4]
```

> Note: Index of first element is always 0.

---

## Static Variables

- Retained throughout the program in RAM — not reallocated during execution
- Declared **outside** a function → **global** scope (known to all functions)
- Declared **inside** a function with `static` keyword → **local** scope (known only within that function)

```c
unsigned char count;              // global — static, fixed RAM location

void math_op() {
    int i;                        // automatic — allocated on stack
    static int j;                 // static — fixed RAM location, value kept
    if (count == 0) j = 0;       // initialize j first time
    i = count;                    // init auto variable each time
    j = j + i;                    // change static — value kept for next call
}

void main(void) {
    count = 0;
    while (1) {
        math_op();
        count++;
    }
}
```

---

## C Statement Types

- Simple variable assignments (includes input/output data transfers)
- Arithmetic operations
- Logical/shift operations
- Control structures: `if`, `while`, `for`, `switch`
- Function calls (user-defined and/or library functions)

---

## Arithmetic Operations

```c
int i, j, k;       // 32-bit signed integers
uint8_t m, n, p;   // 8-bit unsigned numbers

i = j + k;          // add 32-bit integers
m = n - 5;          // subtract 8-bit numbers
j = i * k;          // multiply 32-bit integers
m = n / p;          // quotient of 8-bit divide
m = n % p;          // remainder of 8-bit divide
i = (j + k) * (i - 2);  // arithmetic expression
```

> `*`, `/`, `%` have higher precedence than `+`, `-`.  
> Example: `j * k + m / n` = `(j * k) + (m / n)`  
> ⚠️ Floating-point formats are **not directly supported** by Cortex-M3 CPUs.

---

## Bit-Parallel Logical Operators

| Operator | Name | Example |
|----------|------|---------|
| `&` | AND | `C = A & B;` |
| `\|` | OR | `C = A \| B;` |
| `^` | XOR | `C = A ^ B;` |
| `~` | Complement (NOT) | `B = ~A;` |

### Bitwise AND Example

```
A:  0 1 1 0 0 1 1 0
B:  1 0 1 1 0 0 1 1
C:  0 0 1 0 0 0 1 0   (C = A & B)
```

### Bitwise OR Example

```
A:  0 1 1 0 0 1 0 0
B:  0 0 0 1 0 0 0 0
C:  0 1 1 1 0 1 0 0   (C = A | B)
```

### Bitwise XOR Example

```
A:  0 1 1 0 0 1 0 0
B:  1 0 1 1 0 0 1 1
C:  1 1 0 1 0 1 1 1   (C = A ^ B)
```

### Complement Example

```
A:  0 1 1 0 0 1 0 0
B:  1 0 0 1 1 0 1 1   (B = ~A)
```

---

## Bit Set / Reset / Complement / Test

Use a **mask** to select bit(s) to be altered:

| Operation | Expression | Effect |
|-----------|-----------|--------|
| Clear bit 0 | `C = A & 0xFE;` | Clears LSB: `abcdefg0` |
| Isolate bit 0 | `C = A & 0x01;` | Mask all but LSB: `0000000h` |
| Set bit 0 | `C = A \| 0x01;` | Sets LSB: `abcdefg1` |
| Toggle bit 0 | `C = A ^ 0x01;` | Complements LSB: `abcdefgh'` |

---

## Bit Examples for I/O

### Create a Pulse on Bit 0 of PORTA

```c
// Assume bit is initially 0
PORTA = PORTA | 0x01;     // Force bit 0 to 1
PORTA = PORTA & 0xFE;     // Force bit 0 to 0
```

### Test and Set Bits

```c
if ((PORTA & 0x80) != 0)    // call bob() if bit 7 of PORTA is 1
    bob();
c = PORTB & 0x04;            // mask all but bit 2 of PORTB value
if ((PORTA & 0x01) == 0)    // test bit 0 of PORTA
    PORTA = c | 0x01;        // write c to PORTA with bit 0 set to 1
```

### Using GPIO Register Pointers (STM32)

```c
#define GPIO_PIN_0   ((uint16_t) 0x0001U)

GPIOA->ODR = GPIOA->ODR | 0x01UL;        // Force bit 0 to 1
GPIOA->ODR = GPIOA->ODR & 0xFEUL;        // Force bit 0 to 0
GPIOA->ODR = GPIOA->ODR & ~(0x01UL);     // Force bit 0 to 0 (alternate)

if ((GPIOA->IDR & 0x80) != 0UL)          // call bob() if bit 7 of GPIOA is 1
    bob();
c = GPIOB->IDR & 0x04UL;                 // mask all but bit 2 of GPIOB
if ((GPIOA->IDR & 0x01UL) == 0UL)
    GPIOA->ODR = c | 0x01;               // write c to PORTA with bit 0 set to 1
```

> MISRA C is a set of software development guidelines for the C programming language developed by MISRA (Motor Industry Software Reliability Association).

---

## Register Address Definitions (stm32f767xx.h)

```c
#define PERIPH_BASE        ((uint32_t) 0x40000000UL)
#define AHB1PERIPH_BASE    (PERIPH_BASE + 0x00020000UL)

/* Base addresses of GPIO control/data register blocks */
#define GPIOA_BASE   (AHB1PERIPH_BASE + 0x0000UL)
#define GPIOB_BASE   (AHB1PERIPH_BASE + 0x0400UL)
#define GPIOA        ((GPIO_TypeDef *) GPIOA_BASE)
#define GPIOB        ((GPIO_TypeDef *) GPIOB_BASE)

/* GPIO register block defined as a structure */
typedef struct {
    __IO uint32_t MODER;     // 0x00 — Port mode register
    __IO uint16_t OTYPER;    // 0x04 — Port output type register
    __IO uint32_t OSPEEDR;   // 0x08 — Port output speed register
    __IO uint32_t PUPDR;     // 0x0C — Port pull-up/pull-down register
    __IO uint32_t IDR;       // 0x10 — Port input data register
    __IO uint32_t ODR;       // 0x14 — Port output data register
    __IO uint32_t BSRR;      // 0x18 — Port bit set/reset register
    __IO uint32_t LCKR;      // 0x1C — Port configuration lock register
    __IO uint32_t AFR[2];    // 0x20-0x24 — Alternate function registers
} GPIO_TypeDef;
```

---

## Example: I/O Port Bit Operations

```c
uint32_t sw;
sw = GPIOB->IDR;               // sw = xxxxxxxxhgfedcba (upper 8 bits from PB15-PB8)

sw = GPIOB->IDR & 0x0010;      // sw = 000e0000 (mask all but bit 4)

// Common errors and correct forms:
if (sw == 0x01)   {}           // NEVER TRUE — sw is 000e0000, not 00000001
if (sw == 0x10)   {}           // TRUE if e=1 (bit 4 in result of PORTB & 0x10)
if (sw == 0)      {}           // TRUE if e=0 (switch not pressed)
if (sw != 0)      {}           // TRUE if e=1 (switch pressed)

GPIOB->ODR = 0x005a;           // Write to 16 bits of GPIOB: 01011010
GPIOB->ODR |= 0x10;            // Set only bit 4 to 1
GPIOB->ODR &= ~0x10;           // Reset only bit 4 to 0
```

```
GPIOB bits:  h g f e d c b a
             │ │ │ │ │ │ │ │
Switch ──────┘ │ │ │ │ │ │ │   (connected to PB4)
```

---

## Shift Operators

| Operator | Operation |
|----------|-----------|
| `x << y` | Left shift operand x by y bit positions |
| `x >> y` | Right shift operand x by y bit positions |

Vacated bits are filled with 0's. Shift is a fast way to multiply/divide by powers of 2.

### Left Shift Example

```
B = A << 3;
A:  1 0 1 0 1 1 0 1
B:  0 1 1 0 1 0 0 0   (left shift 3 bits)
```

### Right Shift Example

```
B = A >> 2;
A:  1 0 1 1 0 1 0 1
B:  0 0 1 0 1 1 0 1   (right shift 2 bits)
```

### Packed BCD Example

```c
B = '1';    // B = 0 0 1 1 0 0 0 1  (ASCII 0x31)
C = '5';    // C = 0 0 1 1 0 1 0 1  (ASCII 0x35)

D = (B << 4) | (C & 0x0F);
//   (B << 4)  = 0 0 0 1 0 0 0 0
//   (C & 0x0F)= 0 0 0 0 0 1 0 1
//   D         = 0 0 0 1 0 1 0 1  (Packed BCD 0x15)
```

---

## Control Structures

Control the order in which instructions are executed (program flow):

- **Conditional execution** — execute statements if condition met; select from options
- **Iterative execution** — repeat statements a specified number of times, until condition met, or while condition is true

---

## IF-THEN Structure

Execute statements if and only if a condition is met.

```c
if (a < b) {
    statement s1;
    statement s2;
    …
}
```

---

## Relational Operators

| Test | TRUE condition | Notes |
|------|---------------|-------|
| `(m == b)` | m equal to b | Double `=` |
| `(m != b)` | m not equal to b | |
| `(m < b)` | m less than b | signed/unsigned per data type |
| `(m <= b)` | m less than or equal to b | |
| `(m > b)` | m greater than b | |
| `(m >= b)` | m greater than or equal to b | |
| `(m)` | m non-zero | |
| `(1)` | always TRUE | |
| `(0)` | always FALSE | |

---

## Boolean Operators

Boolean operators `&&` (AND) and `||` (OR) produce TRUE/FALSE results for multiple conditions.

```c
if ((n > 1) && (n < 5))          // test for n between 1 and 5
if ((c == 'q') || (c == 'Q'))    // test c = lower or upper case Q
```

> ⚠️ Boolean `&&`, `||` vs bitwise `&`, `|`:  
> `if (k && m)` — test if k and m both TRUE (non-zero)  
> `if (k & m)` — compute bitwise AND, then test if result is non-zero

### Common Error

`==` is a relational operator; `=` is an assignment operator.

```c
if (m == n)   // tests equality of m and n  ← CORRECT
if (m = n)    // assigns n to m, then tests if result is TRUE ← ERROR
```

---

## IF-THEN-ELSE Structure

```c
if (a == 0) {
    statement s1;
    statement s2;
} else {
    statement s3;
    statement s4;
}
```

## Multiple ELSE-IF Structure

```c
if (n == 1)       statement1;
else if (n == 2)  statement2;
else if (n == 3)  statement3;
else              statement4;   // any other value of n
```

Any statement can be replaced with `{ s1; s2; s3; … }`.

---

## SWITCH Statement

Compact alternative to ELSE-IF for multi-way decisions testing one variable against constant values.

```c
switch (n) {
    case 0:  statement1; break;   // do if n == 0
    case 1:  statement2; break;   // do if n == 1
    case 2:  statement3; break;   // do if n == 2
    default: statement4; break;    // any other value
}
```

---

## WHILE Loop Structure

Repeat statements as long as a condition is met.

```c
while (a < b) {
    statement s1;
    statement s2;
    …
}
```

> Something must eventually cause `a >= b` to exit the loop!

### WHILE Examples

```c
/* Add two 200-element arrays — DO-WHILE */
int M[200], N[200], P[200];
int k;
k = 0;
do {
    M[k] = N[k] + P[k];
    k = k + 1;
} while (k < 200);

/* Same — using WHILE */
k = 0;
while (k < 200) {
    M[k] = N[k] + P[k];
    k = k + 1;
}
```

### Wait for Input Pin

```c
while ((GPIOA->IDR & 0x0001) == 0) {
    // do nothing — wait for bit 0 of GPIOA to become 1
}
c = GPIOB->IDR;   // read GPIOB after bit becomes 1
```

---

## FOR Loop Structure

```c
for (m = 0; m < 200; m++) {
    statement s1;
    statement s2;
}
```

Equivalent WHILE form:

```c
m = 0;                // initialization
while (m < 200) {     // condition test
    statement s1;
    statement s2;
    m = m + 1;        // end-of-loop action
}
```

### FOR Loop Example — Read 100 Values

```c
/* Read 100 16-bit values from GPIOB into array C */
/* Bit 0 of GPIOA (PA0) is 1 if data is ready, 0 otherwise */
uint16_t c[100];
uint16_t k;

for (k = 0; k < 200; k++) {
    while ((GPIOA->IDR & 0x01) == 0) {   // wait until PA0 = 1
        // do nothing
    }
    c[k] = GPIOB->IDR;   // read data from PB[15:0]
}
```

### Nested FOR — Time Delay

```c
for (i = 0; i < 100; i++) {        // outer loop: 100 times
    for (j = 0; j < 1000; j++) {   // inner loop: 1000 times
        // do "nothing"
    }
}
```

---

## C Functions

Functions partition large programs into smaller tasks:
- Helps manage program complexity
- Smaller tasks are easier to design and debug
- Functions can be reused
- Can use "libraries" of functions developed by 3rd parties

A function is **called** by another program to perform a task:
- May return a result to the caller
- One or more arguments may be passed to the function

### Function Definition

```c
int math_func(int k, int n) {   // parameters passed by caller
    int j;                       // local variable
    j = n + k - 5;              // function body
    return(j);                   // return the result
}
// Type of value returned to caller — if none, specify "void"
```

### Function Arguments

- **By value:** pass a constant or variable value — function can use but not modify
- **By reference:** pass the address of the variable — function can read and update
- Values/addresses are typically passed by pushing them onto the system stack

### Example — Pass by Value

```c
int square(int x) {    // passed value is type int, return an int
    int y;              // local variable
    y = x * x;          // use the passed value
    return(x);          // return the result
}

void main() {
    int k, n;
    n = 5;
    k = square(n);      // pass value of n, assign n-squared to k
    n = square(5);      // pass value 5, assign 5-squared to n
}
```

### Example — Pass by Reference

```c
void square(int x, int *y) {   // value of x, address of y
    *y = x * x;                 // write result to location at address y
}

void main() {
    int k, n;
    n = 5;
    square(n, &k);    // calculate n-squared, put result in k
    square(5, &n);    // calculate 5-squared, put result in n
}
// main tells square the location of its local variable
```

### Example — Receive Serial Data

```c
int rcv_data[10];    // global variable array for received data
int rcv_count;       // global variable for #received bytes

void SCI_receive() {
    while ((SCISR1 & 0x20) == 0) {}   // wait for new data (RDRF = 1)
    rcv_data[rcv_count] = SCIDRL;     // byte to array from SCI data reg.
    rcv_count++;                       // update index for next byte
}
// Other functions can access received data from the global array rcv_data[]
```

---

## Finite State Machine

> 📄 See [PDF final pages](documents/microcontroller-lec04-embedded-c-20260630.pdf) — Mealy and Moore FSM model diagrams.
