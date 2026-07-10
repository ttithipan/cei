# AI Lec07 — Quantifying Uncertainty (2026)

> 📄 [View original PDF](documents/ai-lec07-uncertainty-20260630.pdf) — source of truth

Artificial Intelligence
Instructor: Kietikul Jearanaitanakij
Department of Computer Engineering
King Mongkut's Institute of Technology Ladkrabang

---

## Lecture 7: Quantifying Uncertainty

- Prior probability
- Conditional probability
- Joint probability distribution
- Bayes' rule and its use
- Probabilistic reasoning (Bayesian network)
- Useful techniques for manipulating probability
- Naive Bayes Classifier

---

## Uncertainty

In uncertain problems, the agent's knowledge can provide only a "degree of belief" in the sentences. Therefore, we need the probability theory to solve them.

Example: What is the probability that tomorrow it will rain in the morning and be sunny in the afternoon?

---

### Prior Probability

- Let P(A) be the unconditional or prior probability that the proposition A is true.

Example: P(Cavity) = 0.1; for any patient.

- P(A) can only be used when there is no other information.
- If some new information B is known, we have to reason with the conditional probability of A given B, P(A|B), instead of P(A).

---

### Example of Prior Probability

- Weather = { Hot, Rainy, Cold, Warm }
- P(Weather) = < 0.7, 0.2, 0.08, 0.02 >
- P(Weather) defines a probability distribution for the random variable Weather.

| Weather | P(Weather) |
|---------|------------|
| Hot     | 0.7        |
| Rainy   | 0.2        |
| Cold    | 0.08       |
| Warm    | 0.02       |

---

### Conditional Probability

- Once the agent has obtained more information, prior probabilities are no longer applicable.
- Instead, we use conditional or posterior probability, P(A|B).

Example: P(Cavity | Toothache) = 0.8

- P(A|B) can only be used when all we know is B.
- If we also know C, we must compute P(A|B∧C) instead of P(A|B).

---

### Conditional Probability Distribution

(One event occurs before another event)

P(A|B)

- Conditional probability can be calculated by:

```
P(A|B) = P(A∧B) / P(B) ; P(B) > 0
```

- By moving a denominator to another side, we derive a product rule of two variables:

```
P(A∧B) = P(A|B) · P(B)
```

- Note that P(A∧B) ≡ P(A, B).

|       | True | False |
|-------|------|-------|
| Hot   | 0.4  | 0.6   |
| Cold  | 0.1  | 0.9   |

Note: P(A|B) + P(not A|B) = 1

---

### Joint Probability Distribution

(Two events occur at the same time)

P(Toothache ∧ Cavity)

- Warning: when you see a probability distribution table, it could be the conditional probability or the joint probability distribution. Read its description before using it.
- Atomic events are mutually exclusive.

P(Cavity) = 0.10

P(Cavity ∨ Toothache) = 0.04 + 0.01 + 0.06 = 0.11

P(Cavity | Toothache) = P(Cavity ∧ Toothache) / P(Toothache) = 0.04 / (0.04 + 0.01) = 0.80

|            | Toothache | ¬Toothache |
|------------|-----------|------------|
| Cavity     | 0.04      | 0.06       |
| ¬Cavity    | 0.01      | 0.89       |

Sum to 1.0

---

### Bayes' Rule and Its Use

From the product rule:

```
P(A∧B) = P(A|B) · P(B)   …………(1)
P(A∧B) = P(B|A) · P(A)   …………(2)
```

Equating (1) and (2):

```
P(B|A) = P(A|B) · P(B) / P(A)   ; Bayes' rule
```

Similarly:

```
P(Y|X, E) = P(X|Y, E) · P(Y|E) / P(X|E)
```

Proof:

```
P(Y|X, E) = P(Y, X, E) / P(X, E)
          = P(X, Y, E) / (P(X|E) · P(E))
          = P(X|Y, E) · P(Y, E) / (P(X|E) · P(E))
          = P(X|Y, E) · P(Y|E) · P(E) / (P(X|E) · P(E))
          = P(X|Y, E) · P(Y|E) / P(X|E)
```

---

### Example of Bayes' Rule

- In medical studies, the doctor learns the symptoms of a given disease, P(symptoms | disease).
- In medical diagnosis, the doctor predicts a disease from the given symptoms, P(disease | symptoms).

For example, a doctor knows that the disease meningitis causes the patient to have a stiff neck 70% of the time.

The doctor also knows the prior probability that a patient has meningitis is 1/50,000, and the prior probability that any patient has a stiff neck is 1%.

We expect a patient with a stiff neck to have meningitis with probability:

```
P(M | S) = P(S | M) · P(M) / P(S)
         = 0.70 × 1/50000 / 0.01
         = 0.0014
```

---

## Probabilistic Reasoning Systems

We are asked to calculate the full joint probability distribution. If the number of variables grows, the matrices for keeping the probabilities become intractably large.

```
P(A∧B∧C∧D) = P(A|B∧C∧D) · P(B∧C∧D)
```

### Bayesian Network

- A Bayesian network can reduce the joints of these variables.
- Graph represents the dependencies among variables.
- There is the joint or prior probability distribution for each variable.

Not easy to calculate → No directed cycles (Directed acyclic graph, or DAG)

#### Conditional Probability Tables

| A   | B   | P(C\|A,B) |
|-----|-----|-----------|
| T   | T   | 0.95      |
| T   | F   | 0.94      |
| F   | T   | 0.29      |
| F   | F   | 0.001     |

P(A) = 0.05, P(B) = 0.03

---

### Example: Burglary Alarm

- A new burglar alarm was installed at home. It is fairly reliable at detecting a burglary but also responds on occasion to minor earthquakes.
- You also have two neighbors, John and Mary, who have promised to call you at work when they hear the alarm.
- John sometimes confuses the telephone ringing with the alarm.
- Mary, on the other hand, likes loud music and often misses the alarm.
- Query: What is the probability that the alarm has sounded, but neither a burglary nor an earthquake has occurred, and both John and Mary call?

---

> 📄 See [PDF page 12](documents/ai-lec07-uncertainty-20260630.pdf#page=12) — Drawing a directed acyclic graph (DAG) to represent the Bayesian network.

---

We can calculate the probability that the alarm has sounded, but neither a burglary nor an earthquake has occurred, and both John and Mary call.

The joint probability distribution can be represented by:

```
P(j, m, a, ¬b, ¬e) = P(j|a) · P(m|a) · P(a|¬b, ¬e) · P(¬b) · P(¬e)
                    = 0.90 × 0.70 × 0.001 × 0.999 × 0.998
                    = 0.000628
```

Note: Probability tables are filled by the experts.

We multiply entries from the joint distribution (using single-letter names for the variables):
b, e, a, j, and m stand for Burglary, Earthquake, Alarm, JohnCalls, and MaryCalls, respectively.

The joints of variables are significantly reduced.

---

## Useful Techniques for Manipulating Probability

### Marginalization

A domain consisting of 3 Boolean variables Toothache, Cavity, and Catch (whether the dentist's steel probe catches something wrong in my tooth).

P(Toothache, Cavity, Catch) is shown in a 2×2×2 table as follows:

- Notice that the probabilities in the joint distribution sum to 1.
- P(cavity) = 0.108 + 0.012 + 0.072 + 0.008 = 0.20

Marginal probability of cavity (or summing out).

- Marginalization: P(Y) = Σ_{z∈Z} P(Y, z)

Here we sum over all the possible values of the set of variables Z.

P(Cavity) = Σ_{z∈{Catch, Toothache}} P(Cavity, z)

- Marginalization of Conditional Probability:

Instead of using joint probabilities, we can apply the conditional probability to calculate the marginalization, P(Y).

```
P(Y) = Σ_z P(Y|z) · P(z)
```

- In most cases, we are more interested in computing the conditional probabilities rather than the full joint distribution since the size of probability table is smaller.

---

### Normalization

(Adjust the values measured on different scales to a common scale)

Idea:
- 1st trial: Toss a coin 17 times, heads 10 times, tails 7 times.
- 2nd trial: Toss a coin 29 times, heads 15 times, tails 14 times.

P₁(head) = 10/17 = 0.58, P₁(tail) = 7/17 = 0.42
P₂(head) = 15/29 = 0.52, P₂(tail) = 14/29 = 0.48

- Let 1/P(toothache) be a **normalization constant**, α.
- α can ensure that the distribution P(Cavity | toothache) adds up to 1.

We can calculate P(Cavity | toothache) without knowing P(toothache)!

P(Cavity | toothache) = α · P(Cavity, toothache)

Without normalization:
P(cavity | toothache) = 0.12, P(¬cavity | toothache) = 0.08

This is hard to interpret.

With normalization (multiply each term by α = 1/(0.12+0.08) = 5):
P(cavity | toothache) = 0.60, P(¬cavity | toothache) = 0.40

Easier since their sum = 1.0

We can calculate P(Cavity | toothache) without P(toothache)!

Marginalization terms:
P(cavity, toothache, catch)
P(¬cavity, toothache, catch)
P(cavity, toothache, ¬catch)
P(¬cavity, toothache, ¬catch)

The Capital symbol Cavity means {cavity, ¬cavity}.

---

## Independence

### Independence Between Evidences in Bayes' Rule

Bayes' rule can be viewed as the relationship between cause and effect.

Causal → Diagnostic

What happens when we have two or more pieces of evidence?
The joint of pieces of evidence makes it hard to compute.

Solution: The independence between variables can simplify the expression.

### Using Independence of Variables to Simplify Bayes' Rule

In fact, Toothache and Catch are independent.
- Toothache depends on the nerves in the tooth
- Catch depends on the dentist's skill.

```
Cavity → Toothache
Cavity → Catch
```

This is good because the joint probability disappears:

```
P(Toothache, Catch | Cavity) = P(Toothache | Cavity) · P(Catch | Cavity)
```

### Independence of Evidence in Joint Probability Distribution

General form:

```
P(Cause, Effect₁, Effect₂, …, Effectₙ) = P(Cause) · Πᵢ P(Effectᵢ | Cause)
```

- Such a probability distribution is called a **naive Bayes model**.
- The naive Bayes model is sometimes called a **Bayesian classifier**.

```
Cause (Hypothesis) → Effect₁
Cause (Hypothesis) → Effect₂
…
Cause (Hypothesis) → Effectₙ
```

---

## Naive Bayes Classifier

- Naive Bayes is a classifier that predicts the class based on the probability of the data points.
- The class with the highest probability is considered the most likely class, i.e., Maximum A Posteriori (MAP).
- The MAP for a hypothesis is:

```
MAP(H) = max P(H|E)
       = max P(E|H) · P(H) / P(E)
       = max P(E|H) · P(H)
```

Normalization constant (removing it won't affect).

- "Naïve" Bayes classifier assumes that all the evidences are unrelated to each other.

---

### Simple Example of Naive Bayes Classifier (Single Feature)

- Suppose we have a training data set of 'Weather' and the target variable 'Play' (tennis).
- We need to classify whether a player will play or not based on the weather.

Convert a raw data into the frequency table.
Calculate the likelihood table.
14 instances

- Will players play tennis if weather is sunny?

P(Yes | Sunny) = P(Sunny | Yes) × P(Yes) / P(Sunny)
= (3/9) × 0.64 / 0.36 = 0.60

P(No | Sunny) = P(Sunny | No) × P(No) / P(Sunny)
= (2/5) × 0.36 / 0.36 = 0.40

MAP(H) = max(0.60, 0.40) = 0.60. Therefore, H = Yes.

---

### Another Example of Naive Bayes Classifier (Multiple Features)

- We have 3 classes (500 instances each) associated with Animal Types: Parrot, Dog, and Fish.
- There are 4 features (evidences) associated with each class: Swim, Wings, GreenColor, and Teeth. → Categorical features T(True) or F(False)

**Frequency Table:**

| Animal Type | Swim    | Wings   | Green Color | Teeth   |
|-------------|---------|---------|-------------|---------|
| Parrot      | 50/500  | 500/500 | 400/500     | 0       |
| Dog         | 450/500 | 0       | 0           | 500/500 |
| Fish        | 500/500 | 0       | 100/500     | 50/500  |

- Predict whether the animal with the following features is a Dog, a Parrot, or a Fish.
- We will use the Naive Bayes approach:

```
P(H|E1, E2, …, En) = P(E1|H) × P(E2|H) × … × P(En|H) × P(H) / P(E1, E2, …, En)
```

- The Evidence here is Swim & Green. We ignore Teeth since it is False.

P(Dog | Swim, Green) = P(Swim|Dog) × P(Green|Dog) × P(Dog) / P(Swim, Green)
= 0.9 × 0 × 0.333 / P(Swim, Green) = 0

P(Parrot | Swim, Green) = P(Swim|Parrot) × P(Green|Parrot) × P(Parrot) / P(Swim, Green)
= 0.1 × 0.80 × 0.333 / P(Swim, Green) = 0.0264 / P(Swim, Green)

P(Fish | Swim, Green) = P(Swim|Fish) × P(Green|Fish) × P(Fish) / P(Swim, Green)
= 1 × 0.2 × 0.333 / P(Swim, Green) = 0.0666 / P(Swim, Green)

Therefore, the Naïve Bayes classifier predicts that this record is a **fish**.

**Feature vector for prediction:**

| Swim | Wings | Green Color | Teeth |
|------|-------|-------------|-------|
| True | False | True        | False |

---

### Advantages and Disadvantages

**Advantages:**
- Naive Bayes Algorithm is a simple, fast, scalable algorithm.
- It can be used for Binary and Multiclass classification.
- Great choice for text classification problems. It's a popular choice for spam email classification.

**Disadvantages:**
- All of the evidences are assumed to be unrelated.
- It cannot learn if there is a relationship between evidences.
- Ex: Remo likes to wear a white shirt. He likes to wear brown jeans. But Remo doesn't wear a white shirt with brown jeans.
