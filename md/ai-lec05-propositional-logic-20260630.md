# AI Lec05 — Logical Agents (Propositional Logic) (2026)

> 📄 [View original PDF](documents/ai-lec05-propositional-logic-20260630.pdf) — source of truth

Artificial Intelligence
Instructor: Kietikul Jearanaitanakij
Department of Computer Engineering
King Mongkut's Institute of Technology Ladkrabang

---

### Lecture 5: Logical Agents (Propositional Logic)

- Knowledge-based agents
- Propositional logic
- Semantic of propositional logic
- Proof by inference
- Proof by resolution

---

### Knowledge-Based Agents

- A knowledge-based agent utilizes its knowledge base (KB) for its reasoning processes.
- Knowledge base (KB) is composed of a set of sentences.
- Sentence represents the fact about the world.

Example of KB:
- "X > Y" represents "X is greater than Y"
- "X != Y" represents "X is not equal to Y"

- A knowledge-based agent operates by 'TELL' and 'ASK' methods.
- TELL: add a new sentence to KB.
- ASK: query what is known in KB.

---

### KB (Knowledge Base) Diagram

```
Rule: If (> x y) and (> y z) then (> x z)
Fact: 9 is greater than 6
Sentence: (> 9 6)
```

**Tell:** Fact: 6 is greater than 3
Sentence: `(> 6 3)`

**Tell:** New sentence: `(> 9 3)` — Reasoning (Inference)

**Ask:** `(> 9 ?)` → ? = 3, 6

---

### Percept Sentences

Constructs a sentence asserting that the agent perceived the given percept at the given time.
Ex: `Percept(Bump, t)`

Constructs a sentence that asks what action should be done at the current time.
Ex: `Action(?, t)`

Constructs a sentence asserting that the chosen action was executed.
Ex: `AgentDid(TurnRight, t)`

---

### Case Study: The Wumpus World

- The Wumpus world is a cave consisting of 4×4 rooms.
- Wumpus is a beast that cannot move but eats anyone entering its room.
- The Wumpus can be shot by an agent, but the agent has only one arrow.
- Some rooms contain bottomless pits that will trap anyone who wanders into these rooms.
- The agent must find a path leading to a gold and safely return to the origin (1,1).
- Actions: { Forward, TurnLeft, TurnRight, Grab, Shoot, Climb }
- Percepts: { Stench, Breeze, Glitter, Bump, Scream }

> The agent will turn around, go back to [1,1], and then proceed to [1,2].

---

Assume that the agent turns and moves to [2,3].

### Reasoning

- Reasoning is the process of constructing new sentences from the old ones.
- A new sentence must entail the old sentences.
- Hence, the fact of a new sentence must follow the old facts.

```
(Old facts) → (New fact)
```

---

### Propositional Logic: A Very Simple Logic

**Syntax** (How a sentence is defined.)

- The atomic sentences consist of a single symbol.
- Symbol represents the fact that can be true or false. For example, `W1,3` stands for the proposition that the wumpus is in [1,3].
- Symbol also includes two logical constants: `True` and `False`.

---

### Syntax (continued)

- Complex sentences are constructed from simpler sentences, using parentheses and logical connectives.

There are five logical connectives in common use:

| Connective | Symbol | Example |
|---|---|---|
| Negation | ¬ (not) | `¬W1,3` |
| Conjunction | ∧ (and) | `W1,3 ∧ P3,1` |
| Disjunction | ∨ (or) | `(W1,3 ∧ P3,1) ∨ W2,2` |
| Implication | ⇒ (implies) | `(W1,3 ∧ P3,1) ⇒ ¬W2,2` |
| Biconditional | ⇔ (iff) | `W1,3 ⇔ ¬W2,2` |

---

> 📄 See [PDF page 12](documents/ai-lec05-propositional-logic-20260630.pdf#page=12)

---

### Semantics

- The semantics explain the truth of a sentence.
- A truth table can be used as the semantics tool.

For example, the sentence `¬P1,2 ∧ (P2,2 ∨ P3,1)` when P1,2 = false, P2,2 = false, P3,1 = true, gives:
`true ∧ (false ∨ true) = true ∧ true = true`

---

### Seven Inference Rules for Propositional Logic

| Rule | Premise | Conclusion |
|---|---|---|
| Modus Ponens | α → β, α | β |
| And-Elimination | α₁ ∧ α₂ ∧ … ∧ αₙ | αᵢ (1 ≤ i ≤ n) |
| And-Introduction | α₁, α₂, …, αₙ | α₁ ∧ α₂ ∧ … ∧ αₙ |
| Or-Introduction | αᵢ | α₁ ∨ α₂ ∨ … ∨ αₙ (1 ≤ i ≤ n) |
| Double-negation Elimination | ¬¬α | α |
| Unit Resolution | α ∨ β, ¬β | α |
| Resolution | α ∨ β, ¬β ∨ γ | α ∨ γ |

---

### Inference in Wumpus World

- The agent must start with some knowledge of the environment. For example, the agent's position is [1,1], and Wumpus is alive.
- Knowledge base is told new percept sentences or inferred sentences at each time step.

```
Make percept sentence ← percept ← Environment
percept_sentence → Knowledge base
```

KB contains:
- `At(Agent, [1,1])`
- `Alive(Wumpus)`
- Examples: `¬B1,1`, `B2,1`, `¬S1,1`, `¬S2,1`

---

### Proof by Inference: ¬P1,2 (There is no pit in [1,2])

We start with the knowledge base containing R1 through R5.

1. Apply biconditional elimination to R2 to obtain R6.
2. Apply And-Elimination to R6 to obtain R7.
3. Logical equivalence for contrapositives gives R8.
4. Apply Modus Ponens with R4 and R8.

```
Modus Ponens: α → β, α
              --------
                  β
```

5. Apply De Morgan's rule and And-Elimination.

**Result:** `¬P1,2` ✓ Proved.

```
KB → ¬P1,2, ¬P2,1
```

---

### Proof by Resolution: P3,1 (There is a pit at [3,1])

Let us consider the steps in which the agent returns from [2,1] to [1,1] and then goes to [1,2], where it perceives no breeze. We add the following sentences to the KB:

Apply Biconditional elimination to R12 to obtain:

```
(B1,2 → P1,1 ∨ P2,2 ∨ P1,3) ∧ (P1,1 ∨ P2,2 ∨ P1,3 → B1,2)
```

Apply And-Elimination:

```
P1,1 ∨ P2,2 ∨ P1,3 → B1,2
```

Contrapositive:

```
¬B1,2 → ¬P1,1 ∧ ¬P2,2 ∧ ¬P1,3
```

---

Apply Biconditional elimination to R3, followed by Modus Ponens with R5, to obtain R15.

Now using the unit resolution: the literal `¬P2,2` in R13 resolves with the literal `P2,2` in R15 to give the resolvent.

```
α ∨ β, ¬β
----------
    α
```

Similarly, the literal `¬P1,1` in R1 resolves with the literal `P1,1` in R16 to give:

**Result:** `P3,1` ✓ Proved.

---

### Proof by Resolution: W1,3 (There is the Wumpus at [1,3])

Finding the Wumpus:

**Step 1.** Agent starts out at [1,1] and gets the percept `¬S1,1`. By using R1 and Modus Ponens, we obtain:

```
R1: ¬S1,1 ⇒ ¬W1,1 ∧ ¬W1,2 ∧ ¬W2,1
R2: ¬S2,1 ⇒ ¬W1,1 ∧ ¬W2,1 ∧ ¬W2,2 ∧ ¬W3,1
R3: ¬S1,2 ⇒ ¬W1,1 ∧ ¬W1,2 ∧ ¬W2,2 ∧ ¬W1,3
R4: S1,2 ⇒ W1,3 ∨ W1,2 ∨ W2,2 ∨ W1,1
```

```
¬W1,1 ∧ ¬W1,2 ∧ ¬W2,1
```

**Step 2.** Applying And-Elimination: `¬W1,1`, `¬W1,2`, `¬W2,1`

**Step 3.** Agent moves to [2,1] and gets percept `¬S2,1`. By using R2, Modus Ponens, And-Elimination, we obtain: `¬W2,2`, `¬W2,1`, `¬W3,1`, `¬W1,1`

**Step 4.** Agent moves to [1,1] then [1,2] and gets `S1,2`. By using R4 and Modus Ponens, we obtain:

```
W1,3 ∨ W1,2 ∨ W2,2 ∨ W1,1
```

**Step 5.** Applying the unit resolution, where α is `W1,3 ∨ W1,2 ∨ W2,2` and β is `W1,1`:

```
W1,3 ∨ W1,2 ∨ W2,2
```

**Step 6.** Applying the unit resolution again, where α is `W1,3 ∨ W1,2` and β is `W2,2`:

```
W1,3 ∨ W1,2
```

**Step 7.** One more unit resolution where α is `W1,3` and β is `W1,2`:

```
W1,3
```

**Result:** `W1,3` ✓ Proved.

---

### Exercise

Find a set of positions where agent visits — Walk pattern.

---

### Translating Knowledge into Action

We need additional rules that relate the current state of the world to the actions the agent should take.

For example:

```
A1,1 ∧ EastA ∧ ¬W2,1 ⇒ Forward
A1,2 ∧ NorthA ∧ W1,3 ⇒ TurnRight
A1,2 ∧ NorthA ∧ W1,3 ∧ Alive(W) ⇒ Shoot
```

---

### Problems of the Propositional Agent

1. There are too many propositions to handle.
   For example, the simple rule "Don't go forward if the Wumpus is in front of the agent" can be stated in propositional logic by 64 rules.

2. Since the world can change configuration at each time step, we must specify time in the inference rules.

```
A1,1⁰ ∧ EastA⁰ ∧ ¬W2,1 ⇒ Forward⁰
A1,1⁶ ∧ EastA⁶ ∧ ¬W2,1 ⇒ TurnLeft⁶
```

(Suppose that, when agent wants to turn, it always turns left.)
