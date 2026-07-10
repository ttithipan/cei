# AI Lec10 — Genetic Algorithm (2026)

> 📄 [View original PDF](documents/ai-lec10-genetic-algorithm-20260630.pdf) — source of truth

Artificial Intelligence
Instructor: Kietikul Jearanaitanakij
Department of Computer Engineering
King Mongkut's Institute of Technology Ladkrabang

---

**Lecture 10 — Genetic Algorithm**

- Evolution
- Steps of Genetic Algorithm
- Roulette wheel selection
- Crossover operator
- Mutation operator
- GA case studies

---

### Genetic Algorithm (GA)

- In the early 1970s, John Holland introduced the concept of genetic algorithms.
- GA combines three concepts of evolution, natural selection, and genetics to search for the optimal solution.
- Optimization iteratively improves the quality of solutions until the optimal solution is found.
- We use the **fitness function** to measure the quality of a solution.

---

### GA Representation and Steps

- GA represents a solution as a **chromosome** consisting of some "genes".
- Each gene is represented by 0 or 1:

```
1 1 0 1 0 1 0 0 0 0 1 0 1
```

**Steps in GA:**

1. Create a population of chromosomes.
2. Evaluate their fitness.
3. Create a new population through genetic operations.
4. Repeat this process many times.

**Genetic operations:**

1. **Crossover** — exchanges parts of two single chromosomes.
2. **Cloning** — copies chromosomes.
3. **Mutation** — changes the gene value in some random locations of a chromosome.

---

### Full Steps of Genetic Algorithm

**Step 1:**
- Encode a solution as a chromosome of a fixed length.
- Define population size N, crossover probability pc, and mutation probability pm.

**Step 2:**
Define a fitness function to measure the performance, or fitness, of an individual chromosome in the problem domain.

**Step 3:**
Randomly generate an initial population of chromosomes of size N: {x₁, x₂, …, xₙ}

---

**Step 4:**
Calculate the fitness of each chromosome:

```
f(x₁), f(x₂), …, f(xₙ)
```

**Step 5:**
Select a pair of chromosomes for mating from the current population.

**Step 6:**
Create a pair of offspring chromosomes by applying the genetic operators — crossover/cloning and mutation.

**Step 7:**
Place the created offspring chromosomes in the new population.

**Step 8:**
Repeat Step 5 until the size of the new chromosome population becomes equal to the size of the initial population, N.

---

**Step 9:**
Replace the initial (parent) chromosome population with the new (offspring) population.

**Step 10:**
Go to Step 4, and repeat the process until the termination criterion is satisfied.

- Each iteration is called a **generation**. A typical number of generations for a simple GA can range from 50 to over 500.
- The entire set of generations is called a **run**.
- GA returns the best chromosomes in the population as a final solution.

---

> 📄 See [PDF page 8](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=8) — The genetic algorithm cycle diagram

---

### How to Select Chromosomes? — Roulette Wheel Selection

The most commonly used chromosome selection technique is the **roulette wheel selection**.

Example: 36 · 100 / (36 + 44 + 14 + 14 + 56 + 54) = 16.5%

| Chromosome | Fitness | Ratio |
|------------|---------|-------|
| X1 | 36 | 16.5% |
| X2 | 44 | 20.2% |
| X3 | 14 | 6.4% |
| X4 | 14 | 6.4% |
| X5 | 56 | 25.3% |
| X6 | 54 | 24.8% |

> 📄 See [PDF page 9](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=9) — Roulette wheel diagram

---

### Crossover / Cloning Operator

- IF random ≤ crossover probability pc, then do the **crossover**.
- The crossover operator randomly chooses a crossover point where two parent chromosomes "break".
- Exchanges the chromosome parts.
- As a result, two new offspring are created.
- Else do the chromosome **cloning**. The offspring are created as exact copies of their parents.

> 📄 See [PDF page 11](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=11) — Crossover and cloning diagram

---

### Mutation Operator

- Mutation represents a change in the gene.
- The mutation operator randomly flips a gene in a chromosome.
- Mutation can avoid a trap on a local optima.
- The mutation probability is quite small in nature and is kept low for GAs, typically in the range between 0.001 and 0.01.

IF random ≤ pm → flip the gene. IF random > pm → keep the gene.

> 📄 See [PDF page 13](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=13) — Mutation operator diagram

---

### Genetic Algorithms: Case Study 1

Find the maximum value of the function **f(x) = 15x − x²** where x varies between 0 and 15.

For simplicity, we assume that x takes only integer values and a chromosome is represented as four genes:

| Integer | Binary | Integer | Binary | Integer | Binary |
|---------|--------|---------|--------|---------|--------|
| 0 | 0000 | 6 | 0110 | 11 | 1011 |
| 1 | 0001 | 7 | 0111 | 12 | 1100 |
| 2 | 0010 | 8 | 1000 | 13 | 1101 |
| 3 | 0011 | 9 | 1001 | 14 | 1110 |
| 4 | 0100 | 10 | 1010 | 15 | 1111 |
| 5 | 0101 | | | | |

---

**Parameters:**

- The size of the chromosome population N is 6.
- The crossover probability pc equals 0.7.
- The mutation probability pm equals 0.001.
- The fitness function: **f(x) = 15x − x²**

---

### Initial Population (N = 6)

| Chromosome Label | Chromosome String | Decoded Integer | Fitness | Fitness Ratio |
|-----------------|-------------------|-----------------|---------|---------------|
| X1 | 1 1 0 0 | 12 | 36 | 16.5% |
| X2 | 0 1 0 0 | 4 | 44 | 20.2% |
| X3 | 0 0 0 1 | 1 | 14 | 6.4% |
| X4 | 1 1 1 0 | 14 | 14 | 6.4% |
| X5 | 0 1 1 1 | 7 | 56 | 25.7% |
| X6 | 1 0 0 1 | 9 | 54 | 24.8% |

> 📄 See [PDF page 16](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=16) for chromosome initial and final location graphs

---

### Genetic Algorithms: Case Study 2

Find the maximum of the function of two variables:

```
f(x, y) = (1 − x)² · e^(−x² − (y+1)²) − (x − x³ − y³) · e^(−x² − y²)
```

where parameters x and y vary between -3 and 3.

The first step is to represent the problem variables as a chromosome — parameters x and y as a concatenated binary string:

```
    x                 y
1 0 0 0 1 0 1 0  0 0 1 1 1 0 1 1
```

---

**Encoding/Decoding:**

Extract two 8-bit strings from the chromosome:

- X = `10001010`(binary) = 138(decimal)
- Y = `00111011`(binary) = 59(decimal)

Now the range of integers that can be handled by 8-bits (0 to 2⁸ − 1) is mapped to the actual range of parameters x and y (-3 to 3):

```
Scale factor = 6 / (256 − 1) = 0.0235294

x = 0.0235294 · 138 − 3 = 0.2470588
y = 0.0235294 · 59 − 3  = −1.6117647
```

---

> 📄 See [PDF page 20](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=20) — Chromosome locations on the "peak" function surface

> 📄 See [PDF page 21](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=21) — Chromosome locations: first generation

> 📄 See [PDF page 22](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=22) — Chromosome locations: mid generations

> 📄 See [PDF page 23](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=23) — Chromosome locations: final generation

---

### Performance Graphs

**100 generations of 6 chromosomes — local maximum (pc = 0.7, pm = 0.001):**

> 📄 See [PDF page 24](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=24) — Performance graph: local maximum

**100 generations of 6 chromosomes — global maximum (pc = 0.7, pm = 0.01):**

> 📄 See [PDF page 25](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=25) — Performance graph: global maximum

**20 generations of 60 chromosomes (pc = 0.7, pm = 0.001):**

> 📄 See [PDF page 26](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=26) — Performance graph: 60 chromosomes

---

### Case Study 3: Scheduling of 7 Power Units in 4 Quarters

**Problem constraints:**

- The maximum loads expected during four quarters are 80, 90, 65, and 70 MW.
- Maintenance of any unit starts at the beginning of an interval and finishes at the end of the same or adjacent interval.
- The net reserve of the power system must be greater or equal to zero at any interval.
- The optimum criterion is the maximum of the net reserve at any maintenance period.

---

### Power Units and Maintenance Requirements

| Unit Number | Unit Capacity (MW) | Quarters Required for Maintenance |
|-------------|-------------------|-----------------------------------|
| 1 | 20 | 2 |
| 2 | 15 | 2 |
| 3 | 35 | 1 |
| 4 | 40 | 1 |
| 5 | 15 | 1 |
| 6 | 15 | 1 |
| 7 | 10 | 1 |

**Total capacity:** 20 + 15 + 35 + 40 + 15 + 15 + 10 = **150 MW**

---

### Chromosome Encoding for Scheduling

Each unit has a gene pool representing legal maintenance start intervals. The chromosome is a concatenation of all unit schedules.

> 📄 See [PDF page 29](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=29) — Legal unit gene pools and chromosome encoding

---

### Crossover and Mutation Operators

> 📄 See [PDF page 30](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=30) — Crossover operator for scheduling problem

> 📄 See [PDF page 31](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=31) — Mutation operator for scheduling problem

---

### Performance Results

**Population of N = 20 chromosomes, pc = 0.7, pm = 0.001:**

**(a) 50 generations — Best schedule net reserves: 15, 35, 35, 25 MW**

> 📄 See [PDF page 32](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=32) — Performance graph and schedule: N=20, 50 generations

**(b) 100 generations — Best schedule net reserves: 40, 25, 20, 25 MW**

> 📄 See [PDF page 33](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=33) — Performance graph and schedule: N=20, 100 generations

---

**Population of N = 100 chromosomes, pc = 0.7:**

**(a) Mutation rate pm = 0.001 — Best schedule net reserves: 35, 25, 25, 25 MW**

> 📄 See [PDF page 34](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=34) — Performance graph and schedule: N=100, pm=0.001

**(b) Mutation rate pm = 0.01 — Best schedule net reserves: 25, 25, 30, 30 MW**

> 📄 See [PDF page 35](documents/ai-lec10-genetic-algorithm-20260630.pdf#page=35) — Performance graph and schedule: N=100, pm=0.01
