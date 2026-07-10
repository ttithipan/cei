# AI Lec06 — First-Order Logic (2026)

> 📄 [View original PDF](documents/ai-lec06-first-order-logic-20260630.pdf) — source of truth

Artificial Intelligence
Instructor: Kietikul Jearanaitanakij
Department of Computer Engineering
King Mongkut's Institute of Technology Ladkrabang

---

### Lecture 6: First-Order Logic

- First-order logic
- FOL Syntax and Semantics
- Quantifiers
- Connections between ∀ and ∃
- First-order logic for reflex agent

---

### Recall: Problems of the Propositional Agent

1. There are too many propositions to handle.
   For example, the simple rule "Don't go forward if the Wumpus is in front of the agent" can be stated in propositional logic by 64 rules, i.e., 16 squares × 4 directions = 64.

2. Since the world can change configuration at each time step, we must specify time in the inference rules.

```
A1,1⁰ ∧ EastA⁰ ∧ ¬W2,1 ⇒ Forward⁰
A1,1⁶ ∧ EastA⁶ ∧ ¬W2,1 ⇒ TurnLeft⁶
```

---

> 📄 See [PDF page 4](documents/ai-lec06-first-order-logic-20260630.pdf#page=4)

---

### First-Order Logic

- First-order logic can express the properties of entire collections of objects rather than having to enumerate the objects by name.
- Similar to other logics, First-order logic comprises syntax and semantics.

```
First-order Logic
├── Syntax (sentence)
└── Semantic (meaning)
```

---

### Syntax: Symbols, Atomic Sentences, Complex Sentences

**Symbol** consists of constant, predicate, and function.

- **Constant symbol:** object. Ex: `Richard`, `John`, etc.
- **Predicate symbol:** relation. Ex: `Brother`, `Friend`, etc.
- **Function symbol:** a function that returns an object. Ex: `LeftLeg`, etc.

---

### Syntax (continued)

- **Atomic sentence** represents a relationship between objects — formed from a predicate symbol followed by a parenthesized list of objects.

For example:
- `Brother(Richard, John)`
- `Married(FatherOf(Richard), MotherOf(John))`

- **Complex sentence** — logical connectives of atomic sentences.

For example:
- `Brother(Richard, John) ∧ Brother(John, Richard)`
- `¬King(Richard) ⇒ King(John)`

---

> 📄 See [PDF page 8](documents/ai-lec06-first-order-logic-20260630.pdf#page=8)

---

### Quantifiers

Quantifiers express the properties of entire collections of objects, rather than having to enumerate the objects by name. These 2 quantifiers significantly reduce the number of rules in FOL.

---

### 1. Universal Quantification (∀, "For All")

For all object x, if x is a cat then x is a mammal.

```
∀x Cat(x) ⇒ Mammal(x)
```

**Problem:** If we represent "All cats are mammals" by `∀x Cat(x) ∧ Mammal(x)`, we will not capture what we need. The sentence means:

```
Cat(Spot) ∧ Mammal(Spot) ∧
Cat(Meow) ∧ Mammal(Meow) ∧
Cat(John) ∧ Mammal(John) ∧
Cat(Richard) ∧ Mammal(Richard) ∧
...        ...        ...
```

**Too strong sentence (Always false).**

If there is no cat in our domain, `∀x Cat(x) ⇒ Mammal(x)` is still true. ✓

---

### 2. Existential Quantification (∃, "For Some")

There is a sister of Spot who is a cat.

```
∃x Sister(x, Spot) ∧ Cat(x)
```

**Problem:** If we represent "There is a sister of Spot who is a cat" by `∃x Sister(x, Spot) ⇒ Cat(x)`, we will not capture what we need. The sentence means:

```
Sister(Spot, Spot) ⇒ Cat(Spot) ∨
Sister(Meow, Spot) ⇒ Cat(Meow) ∨
Sister(John, Spot) ⇒ Cat(John) ∨
Sister(Richard, Spot) ⇒ Cat(Richard) ∨
...        ...        ...
```

**Too weak sentence (Always true).**

If there is no sister of Spot who is a cat, `∃x Sister(x, Spot) ∧ Cat(x)` must be false. ✓

---

### Example: "Some cats are intelligent"

```
∃x Cat(x) ⇒ Intel(x)
```

**What's wrong with the above FOL sentence?**

This FOL sentence is always true even though there is no cat that is intelligent.

| Name | Cat / Dog? | Intelligent | Cat(aᵢ) ⇒ Intel(aᵢ) |
|---|---|---|---|
| a₁ | Cat | No | False ⇒ False = **True** |
| a₂ | Cat | No | False ⇒ False = **True** |
| a₃ | Dog | Yes | True ⇒ True = **True** |

`[Cat(a₁) ⇒ Intel(a₁)] ∨ [Cat(a₂) ⇒ Intel(a₂)] ∨ [Cat(a₃) ⇒ Intel(a₃)]` = True

<https://www.youtube.com/watch?v=2juspgYR7as>

---

### Example: "Every student in this class has visited Africa or America"

Let:
- `student(x)`: x is student in this class
- `vaf(x)`: x has visited Africa
- `vam(x)`: x has visited America

```
∀x student(x) ⇒ vaf(x) ∨ vam(x)
```

<https://www.youtube.com/watch?v=2juspgYR7as>

---

### Example: "Some prime number is even number"

Let:
- `prime(x)`: x is prime number
- `even(x)`: x is even number

```
∃x prime(x) ∧ even(x)
```

<https://www.youtube.com/watch?v=2juspgYR7as>

---

### 3. Nested Quantification

| English | FOL |
|---|---|
| "For all x and all y, if x is the parent of y then y is a child of x" | `∀x,y Parent(x, y) ⇒ Child(y, x)` |
| "Everybody loves somebody" | `∀x ∃y Loves(x, y)` |
| "There is someone who is loved by everybody" | `∃y ∀x Loves(x, y)` |
| "Everybody is loved by somebody" | `∀x ∃y Loves(y, x)` |
| "Somebody loves everybody" | `∃y ∀x Loves(y, x)` |
| "Nobody loves everyone" | `∀x ∃y ¬Loves(x, y)` |

The order of quantification can change the meaning of the sentence.

"Nobody loves everyone" is equivalent to "Everybody does not love somebody."

---

### Exercise 1

Give FOL sentence for: **"Gold and silver ornaments are precious"**

Let:
- `G(x)`: x is a gold ornament
- `S(x)`: x is a silver ornament
- `P(x)`: x is precious

A) `∀x (P(x) ⇒ G(x) ∧ S(x))`
B) `∀x (G(x) ∧ S(x) ⇒ P(x))`
C) `∃x (G(x) ∧ S(x) ⇒ P(x))`
D) `∀x (G(x) ∨ S(x) ⇒ P(x))`

---

### Exercise 2

Find FOL for: **"Every teacher is liked by some students"**

A) `∀x teacher(x) ⇒ ∃y (student(y) ⇒ Likes(y, x))`
B) `∀x teacher(x) ⇒ ∃y (student(y) ∧ Likes(y, x))`
C) `∃y ∀x teacher(x) ⇒ (student(y) ∧ Likes(y, x))`

> "Some students like every teacher." — This is not what we want.

D) `∀x (teacher(x) ∧ ∃y student(y) ⇒ Likes(y, x))`

---

### Exercise 3

Find FOL for: **"Some boys are taller than all girls"**

A) `∃x boy(x) ⇒ ∀y (girl(y) ∧ taller(x, y))`
B) `∃x boy(x) ∧ ∀y girl(y) ⇒ taller(x, y)`
C) `∃x boy(x) ∧ ∀y (girl(y) ∧ taller(x, y))`
D) `∃x boy(x) ⇒ ∀y (girl(y) ⇒ taller(x, y))`

---

### Exercise 4

Let `F(x, y, t)`: person x can fool person y at time t.

A) Everyone can fool some person at some time.
B) No one can fool everyone all the time.
C) Everyone cannot fool some person all the time.
D) No person can fool some person at some time.

```
∀x ∃y ∃t (¬F(x, y, t))
¬∃x ∀y ∀t F(x, y, t)
```

---

### Exercise 5

Find FOL sentence for: **"Everyone who loves all animals is loved by someone."**

A) `∀x,y Animal(y) ⇒ Loves(x, y) ⇒ ∃z Loves(z, x)`
B) `∀x,y Animal(y) ⇒ Loves(x, y) ∧ ∃z Loves(z, x)` — Wrong meaning! Everyone loves all animals AND is loved by someone.
C) `∀x,y Animal(y) ∧ Loves(x, y) ⇒ ∃z Loves(z, x)` — Wrong meaning! Everyone who loves all animals (in fact, someone may not love animals).

---

### Connections between ∀ and ∃

Two quantifiers are connected through negation.

The De Morgan rules for quantified and unquantified sentences:

| Quantified | Unquantified |
|---|---|
| `¬∀x P(x)` ≡ `∃x ¬P(x)` | `¬(P ∧ Q)` ≡ `¬P ∨ ¬Q` |
| `¬∃x P(x)` ≡ `∀x ¬P(x)` | `¬(P ∨ Q)` ≡ `¬P ∧ ¬Q` |
| `∀x P(x)` ≡ `¬∃x ¬P(x)` | `P ∧ Q` ≡ `¬(¬P ∨ ¬Q)` |
| `∃x P(x)` ≡ `¬∀x ¬P(x)` | `P ∨ Q` ≡ `¬(¬P ∧ ¬Q)` |

---

### Equality

We can use the equality symbol to signify that two terms refer to the same object.

Example: `Father(John) = Henry`

We can also use equality for counting in first-order logic:
- "Spot has at least two sisters"

```
∃x,y Sister(Spot, x) ∧ Sister(Spot, y) ∧ ¬(x = y)
```

---

### Kinship Domain

Kinship domain represents the relationship between objects.

- Domain: mother

```
∀m,c Mother(c) = m ⇔ Female(m) ∧ Parent(m, c)
```

---

### First-Order Logic for Wumpus World

We will take a look at how first-order logic reduces the rules in a Wumpus world.

**Rules:**

```
Percept ⇒ Action
```

**Example:** "If the agent senses a glitter, it should do a grab in order to pick up the gold" can be represented in first-order logic as:

```
∀s,b,u,c,t Percept([s, b, Glitter, u, c], t) ⇒ Action(Grab, t)
```

We can reduce some facts into a shorter representation and then use it in the following rules:

```
∀s,b,u,c,t Percept([s, b, Glitter, u, c], t) ⇒ AtGold(t)    (Causal Rules)
∀t AtGold(t) ⇒ Action(Grab, t)                                (Diagnostic Rules)
```
