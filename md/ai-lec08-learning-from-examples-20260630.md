# AI Lec08 — Learning From Examples (2026)

> 📄 [View original PDF](documents/ai-lec08-learning-from-examples-20260630.pdf) — source of truth

Artificial Intelligence
Instructor: Kietikul Jearanaitanakij
Department of Computer Engineering
King Mongkut's Institute of Technology Ladkrabang

---

## Learning From Examples (Decision Tree Learning)

- Forms of Learning
- Supervised Learning
- Learning Decision Trees
- Evaluating the Hypothesis

---

## Forms of Learning

### 1. Supervised Learning

- The agent observes some example input-output pairs and learns a function that maps from input to output.

Example:
A taxi agent learns to predict "Good traffic" and "Bad traffic" from the "input-output" examples.

- X1: Rain, BigEvent, WorkDay, MonthEnd, "Bad traffic"
- X2: NonRain, NonBigEvent, NonWorkDay, NonMonthEnd, "Good traffic"
- X3: Rain, NonBigEvent, WorkDay, NonMonthEnd, "Good traffic"
- X4: NonRain, BigEvent, NonWorkDay, MonthEnd, "Bad traffic"

Features / Attributes → Target Class / Label / Ground truth

Clusters: X1, X4 → Bad traffic | X2, X3 → Good traffic

---

### 2. Unsupervised Learning

- The agent learns patterns in the input without any label.
- The most common unsupervised learning task is clustering.

Example (Online shopping):
- X1: Shirt, Suit, Necktie
- X2: Running Shoe, Shorts, Sock
- X3: Running Shoe, Sport watch, Sock
- X4: Shirt, Trousers, Necktie

Customers X1 and X4 share the same cluster whereas X2 and X3 are in another cluster.

---

### 3. Reinforcement Learning

- There is no training data available.
- The agent must gradually learn from the real situation (a series of reinforcements).
- At the end of each run, the agent is given either reward or punishment.

Example:
The lack of a tip at the end of the journey gives the taxi agent an indication that it did something wrong. It is up to the agent to decide which of the actions before the reinforcement was most responsible for it.

---

## Supervised Learning

### Problem Statement

Given a training set of N example input-output pairs:

(x₁, y₁), (x₂, y₂), …, (xₙ, yₙ)

Find the hypothesis function h that approximates the true function of the training set.

- If y is one of a finite set of values, e.g., {C1, C2, C3}, the learning problem is called **classification**.
- If y is a real number (such as tomorrow's temperature), the learning problem is called **regression**.
- To evaluate a hypothesis function, we test it on an unseen dataset (test set).
- We say a hypothesis **generalizes well** if it correctly predicts the unseen data.

### Overfitting and Generalization

- Overfitting occurs when a learning model learns noises instead of just the actual data.
- An overfitted model generally has a poor prediction.
- A good learning model should be generalized to both unseen and training data.

Tends to Generalize ← → Tends to Overfit

---

## Learning Decision Trees

(ID3 algorithm, Iterative Dichotomiser 3)

For example, we will build a decision tree to decide whether to wait for a table at a restaurant.

- The objective is to learn a goal predicate WillWait.
- The following attributes may influence the customer's decision:

1. **Alternate**: whether there is a suitable alternative restaurant nearby.
2. **Bar**: whether the restaurant has a comfortable bar area to wait in.
3. **Fri/Sat**: true on Fridays and Saturdays.
4. **Hungry**: whether we are hungry.
5. **Patrons**: how many people are in the restaurant (None, Some, and Full).
6. **Price**: the restaurant's price range.
7. **Raining**: whether it is raining outside.
8. **Reservation**: whether there is a reservation.
9. **Type**: the kind of restaurant (French, Italian, Thai, or burger).
10. **WaitEstimate**: the wait estimated by the host (0–10 minutes, 10–30, 30–60, or >60).

---

> 📄 See [PDF page 9](documents/ai-lec08-learning-from-examples-20260630.pdf#page=9) — Examples for the restaurant domain (training data table).

---

> 📄 See [PDF page 10](documents/ai-lec08-learning-from-examples-20260630.pdf#page=10) — A decision tree for deciding whether to wait for a table. However, this decision tree is not optimal (we will see later).

---

### Creating the Optimal Decision Tree

- The optimal decision tree is the shallowest. It will save the runtime.
- Strategy: Test the most important attribute first.
- The most important attribute:
  The attribute with the lowest impurity, i.e., the smallest number of examples has not been decided yet.

---

> 📄 See [PDF page 12](documents/ai-lec08-learning-from-examples-20260630.pdf#page=12) — Which attribute is more important (Type or Patrons)? Impurity visualization.

---

> 📄 See [PDF page 13](documents/ai-lec08-learning-from-examples-20260630.pdf#page=13) — The optimal decision tree induced from the 12-example training set.

---

### Evaluating with a Learning Curve

- We can evaluate the accuracy of a learning algorithm with a learning curve. We have 100 examples at our disposal, which we split into a training set and a test set.

- We learn a hypothesis h with the training set and measure its accuracy with the test set.
- We do this starting with a training set of size 1 and increasing one at a time up to size 99. For each size we actually repeat the process of randomly splitting 20 times, and average the results of the 20 trials.
- The curve shows that as the training set size grows, the accuracy increases.

In this graph, we reach 95% accuracy, and it looks like the curve might continue to increase with more data.

---

### Information Gain and Entropy

- Counting the impurity of each attribute just tells us a rough importance.
- To have a more precise measure, we should employ an **Information gain**.
- Information gain is defined in terms of **Entropy** (Shannon and Weaver, 1949), to define a precise measure of an attribute's importance.
- Entropy is an uncertainty of a random variable.

#### Intuition

- If a coin is fair, its uncertainty is very high (entropy = 1)
- If a coin always comes up heads, it has no uncertainty (entropy = 0)

#### Entropy Formula

If a training set contains p positive examples and n negative examples:

```
Entropy: I(p/(p+n), n/(p+n)) = -(p/(p+n))·log₂(p/(p+n)) - (n/(p+n))·log₂(n/(p+n))
```

- We can check that the entropy of a fair coin flip is indeed 1:

```
I(1/2, 1/2) = -½·log₂(½) - ½·log₂(½) = 1
```

- If the coin gives 99% heads, we get:

```
I(99/100, 1/100) = -(99/100)·log₂(99/100) - (1/100)·log₂(1/100) = 0.08
```

---

#### Remainder and Information Gain

- We can measure how much the entropy (uncertainty) remaining after testing the attribute A by:

```
Remainder(A) = Σᵥᵢ₌₁ ((pᵢ + nᵢ)/(p + n)) · I(pᵢ/(pᵢ + nᵢ), nᵢ/(pᵢ + nᵢ))
```

- The information gain from the attribute A is defined as:

```
Gain(A) = I(p/(p+n), n/(p+n)) - Remainder(A)
```

- The more value of the information gain of the attribute A, the more important it is.

Splitting on Attribute A:

| Branch | Positives | Negatives |
|--------|-----------|-----------|
| 1      | +++       |           |
| 2      |           | ----      |
| 3      | ++++      |           |

The less the remainder, the more important the attribute A.

---

#### Example Calculation: Patrons vs. Type

- Now, let us calculate the information gain of both Patrons and Type.

```
Gain(Type) = I(6/12, 6/12) - [2/12 · I(1/2, 1/2) + 2/12 · I(1/2, 1/2) + 4/12 · I(2/4, 2/4) + 4/12 · I(2/4, 2/4)]
           = 0
```

```
Gain(Patrons) = I(6/12, 6/12) - [2/12 · I(0, 1) + 4/12 · I(1, 0) + 6/12 · I(2/6, 4/6)]
              = 1 - [0 + 0 + 0.4594]
              = 0.5406
```

Therefore, Patrons is more important than Type.

---

### Applying ID3 to a Regression Problem (Regression Tree)

- Regression is a problem of using the input values to predict continuous valued output (instead of a discrete output like a classification problem).

Example decision rule:
- Attribute A < 5.5 → Average = 1.3
- Attribute A > 11 → Average = 5.8
- Otherwise → Average = 3.1

---

#### Finding the Root Split

- Just like for Classification Trees, the first thing we do for a Regression Tree is decide what goes in the Root.

First, find the average of the first 2 points and use it to split all data points.

---

#### Step-by-Step Threshold Search

**Threshold 1.5 (A < 1.5):**
- Left (1 point): Average = 1.0
- Right (14 points): Average = 3.9
- The dashed lines represent errors between individual points on the right and the average 3.9.
- Calculate the sum-squared error of all data points. Let's call it E1.

**Threshold 2.5 (A < 2.5):**
- Shift the threshold to the right (avg. of 2nd and 3rd points)
- Left (2 points): Average = 1.1
- Right (13 points): Average = 4.1
- Calculate the sum-squared error. Let's call it E2.

**Threshold 3.5 (A < 3.5):**
- Left (3 points): Average = 1.3
- Right (12 points): Average = 4.5
- Calculate the sum-squared error. Let's call it E3.

**…continue shifting until the last pair…**

**Threshold 14.5 (A < 14.5):**
- Left: Average = 3.0
- Right: Average = 4.2
- Calculate the sum-squared error. Let's call it E14.

---

#### Selecting the Best Threshold

Plot of Sum-squared error (SSE) across thresholds E1 … E14:

The best threshold is the one with the lowest SSE (e.g., threshold 5.5 → A < 5.5, Avg = 1.3).

- Discard all points on the left of the threshold.
- Repeat the process to find the next threshold.

---

## Random Forest Algorithm

Two major problems of ID3 (Decision tree algorithm):
1. It is easily overfitted to the training data.
2. It is sensitive to the small change in the training data.

Solution: **Multiple decision trees.**

---

> 📄 See [PDF page 27](documents/ai-lec08-learning-from-examples-20260630.pdf#page=27) — Question: Why are there many different decision trees for the same training set?

---

> 📄 See [PDF page 28](documents/ai-lec08-learning-from-examples-20260630.pdf#page=28) — Answer: Each Decision Tree model in a Random Forest algorithm receives a different subset of training data (bootstrap or sampling).

Training data → Bootstrap/Sampling data

---

> 📄 See [PDF page 29](documents/ai-lec08-learning-from-examples-20260630.pdf#page=29) — Prediction on an unseen data point. Three decision trees vote: Yes, Yes, No → Majority vote = Yes.

---

### Advantages of the Random Forest Algorithm

- Robust and less sensitive to small changes to our data. Since it aggregates the predictions of all decision tree models.
- Similar to the decision tree algorithm, Random Forest can be applied to classification and regression problems.

---

## K Nearest Neighbors Algorithm (KNN)

- K nearest neighbors is a nonparametric algorithm that classifies unseen data based on a distance function.
- An example is classified by a majority vote of its K neighbors.

Applicable to both continuous and discrete features across multiple dimensions.

---

### Example: Credit Default

- Consider the following data concerning credit default. Age and Loan are two numerical attributes and Default is the target class.
- Given an unseen example (Age=48 and Loan=$142,000):

The shortest Euclidean distance (K=1):

```
Distance = √((48 - 33)² + (142000 - 150000)²) = 8,000 → Default = Y
```

- With K=3, there are two Default=Y and one Default=N closest neighbors. The prediction for the unknown case is again Default=Y.

---

### Standardized Distance

- One major drawback in calculating distance measures directly from the training set is in the case where variables have different measurement scales or there is a mixture of numerical and categorical variables.
- For example, if one variable is based on annual income in dollars, and the other is based on age in years then income will have a much higher influence on the distance calculated.
- One solution is to standardize the training set.
- Using the standardized distance on the same training set, the unknown example returned a different neighbor.

---

## Evaluating the Hypothesis

- We can simply use the error rate to measure the hypothesis.
  - Error rate = Number of examples which are wrong predicted / Total number of examples
- However, a hypothesis h has a low error rate on the training set does not mean that it will generalize well.
- To get a more accurate evaluation, we need to test the hypothesis on an unseen set (test set) of examples.

### Holdout Cross-Validation

(If we have a large amount of dataset)

Randomly split the available data into a training set (e.g. 75%) and a test set (e.g. 25%).

### K-Fold Cross-Validation

(If we have a limited amount of dataset)

- Split the training data into k equal subsets.
- Then perform k rounds of learning. On each round, 1/k of the data is held out as a validation set and the remaining examples are used as training data.
- The average error rate of the k rounds is finally calculated. Popular values for k are 5 and 10. The extreme is k=n (the total number of examples), also known as leave-one-out cross-validation or LOOCV.

---

> 📄 See [PDF pages 36–49](documents/ai-lec08-learning-from-examples-20260630.pdf#page=36) — K-Fold Cross Validation process visualized step by step. Training + Validation sets (75%) are partitioned into K folds. Each fold is used once as a validation set while the remaining K-1 folds form the training set. After K rounds, the final metrics are aggregated:

```
Training Accuracy = (Σᵢ₌₁ᴷ Train_Acc_i) / K
Validation Accuracy = (Σᵢ₌₁ᴷ Valid_Acc_i) / K
```

The model is then evaluated on the held-out Test Set (25%) to obtain Test Accuracy.

Note: Percentage of test set can be varied, depends on how many total instances we have.
