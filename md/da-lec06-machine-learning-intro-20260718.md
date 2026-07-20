# Data Analytics — Lec06: Introduction to Machine Learning (2026)

> 📄 [View original PDF](documents/da-lec06-machine-learning-intro-20260718.pdf) — source of truth
> ⚠️ The original lecture slides contain many images and diagrams — refer to the PDF for visual content.

Instructor: Rathachai Chawuthai

---

## Agenda

- Introduction to Machine Learning
- Model
- Evaluation
- Learning Steps
- Regression
- Classification

---

## Introduction to Machine Learning

### AI Applications

- Google's AlphaGo beats Go master (2016)
  - Ref: https://www.bbc.com/news/technology-35785875
- Self-Driving Car
  - Ref: https://gcn.com/articles/2020/10/23/autonomous-vehicles-public-health.aspx
- Voice Recognition
  - Ref: https://www.cio.com/article/3239924/cios-listen-up-voice-recognition-meets-the-printer.html
- Object Detection
  - Ref: https://hackernoon.com/how-visual-object-detection-can-transform-manufacturing-industries-8b6698cc0a47
- Face Detection
  - Ref: https://rapidapi.com/blog/top-facial-recognition-apis/
- Recommender System
  - Ref: https://madasamy.medium.com/introduction-to-recommendation-systems-and-how-to-design-recommendation-system-that-resembling-the-9ac167e30e95
- Chatbot
  - Ref: https://700-apps.com/chatbot/
- Map Direction
  - Ref: https://akexorcist.dev/google-direction-library-for-android-th/

### Data Analytics Overview

Data Analytics spans from **Descriptive** (What happened?) through **Diagnostic** (Why did it happen?) to **Predictive** (Based on what we know, what will happen?) and **Prescriptive** (Now that I know, what should I do?) — moving from Decision Support to Decision Automation.

> 📄 See [PDF page 12](documents/da-lec06-machine-learning-intro-20260718.pdf#page=12) — Data Analytics pyramid diagram.

---

## CRISP-DM & Data Science Process

### CRISP-DM (Cross-Industry Standard Process for Data Mining)

The six phases: Business Understanding → Data Understanding → Data Preparation → Modeling → Evaluation → Deployment.

> 📄 See [PDF page 13](documents/da-lec06-machine-learning-intro-20260718.pdf#page=13) — CRISP-DM cycle diagram.

### Data Science Process

Data Collection → Data Processing → Clean Dataset → Data Exploration → Model & Algorithm → Communicating Result → Data Product / Decision Making.

> 📄 See [PDF page 14](documents/da-lec06-machine-learning-intro-20260718.pdf#page=14) — Data Science Process flow diagram.

---

## AI Techniques Overview

> 📄 See [PDF page 16](documents/da-lec06-machine-learning-intro-20260718.pdf#page=16) — History of AI timeline.

> 📄 See [PDF page 17](documents/da-lec06-machine-learning-intro-20260718.pdf#page=17) — AI, Machine Learning, and Deep Learning relationship diagram.

### AI, Machine Learning & Deep Learning

- **Artificial Intelligence** — Human Intelligence Exhibited by Machines
- **Machine Learning** — An Approach to Achieve Artificial Intelligence. Machine learning at its most basic is the practice of using algorithms to parse data, learn from it, and then make a determination or prediction about something in the world.
- **Deep Learning** — A Technique for Implementing Machine Learning, using the architecture of Artificial Neural Network.

Ref: https://blogs.nvidia.com/blog/2016/07/29/whats-difference-artificial-intelligence-machine-learning-deep-learning-ai/

> 📄 See [PDF page 19](documents/da-lec06-machine-learning-intro-20260718.pdf#page=19) — Machine Learning & Deep Learning comparison diagram.

### Types of Data

- **Quantitative Data** — Information that can be measured and written down with numbers (e.g., 27, 33, 41). Examples: number of things, temperature, height, age, time.
- **Ordinal Data** — Data type consisting of numerical scores that exist on an ordinal scale (e.g., small, medium, large, enormous). Examples: ranking, rating, ordering.
- **Categorical Data** — Types of data which may be divided into groups (e.g., A, B, C). Examples: gender, classification, educational level.

> 📄 See [PDF page 20](documents/da-lec06-machine-learning-intro-20260718.pdf#page=20) — Scale of data diagram.

### AI Techniques Tree

AI techniques are divided into:

- **Rule-Driven**: Expert System, …
- **Data-Driven**:
  - **Supervised**:
    - **Regression**: Linear Regression, Polynomial Regression, …
    - **Classification**: Logistic Regression, Naïve Bayes, Decision Tree, K-NN, Neural Network, …
  - **Unsupervised**: K-Means, DBSCAN, …

> 📄 See [PDF pages 22–23](documents/da-lec06-machine-learning-intro-20260718.pdf#page=22) — AI Techniques tree/flowchart diagram.

---

## What are Models?

A model is a function that maps inputs to outputs.

> 📄 See [PDF page 25](documents/da-lec06-machine-learning-intro-20260718.pdf#page=25) — Linear Regression model: y = mx + c, y = 5x − 7, Gradient Descent diagram.

### Model Types (Multiple Choice Examples)

The slides present multiple model families as a multiple-choice question — which one is a model?

- **A**: Linear Regression: **y = mx + c** → **f(x) = 5x − 7**
- **B**: y = 3*x
- **C**: (not explicitly defined)
- **D**: Decision Tree (a function that maps vehicle width/height to car/truck)

> 📄 See [PDF pages 25–27](documents/da-lec06-machine-learning-intro-20260718.pdf#page=25) — Model examples and function mapping diagrams.

### Function Mapping Examples

The slides show various function mapping problems (x → y):

- y = max(x − 2, 0)
- y = round(x)
- Step functions: y = 0 if x < 3, y = 1 if x = 3
- Conditional logic: if x ≤ 2 then y = 0 else y = 1
- Sigmoid: y = 1/(1 + e^(−(w₀ + w₁x)))
- Decision tree: x < 3 → y = 0 else y = 1

> 📄 See [PDF pages 29–37](documents/da-lec06-machine-learning-intro-20260718.pdf#page=29) — Function mapping diagrams and model examples.

### Dataset Structure

A dataset consists of:
- **Inputs** (features, attributes, variables, X): x₁, x₂, x₃, …, xₙ
- **Output** (label, actual y, y_true): y

Example columns: Facebook, X, Twitter, Medium, Instagram, LinkedIn → label.

---

## Supervised vs. Unsupervised Learning

### Supervised Learning

Dataset (input + output) → Model Algorithm → Model
Then: future input → Model → predicted output

> 📄 See [PDF pages 37–38](documents/da-lec06-machine-learning-intro-20260718.pdf#page=37) — Supervised Learning flow diagrams.

### Unsupervised Learning

Dataset (input only, no output labels) → Algorithm

> 📄 See [PDF page 39](documents/da-lec06-machine-learning-intro-20260718.pdf#page=39) — Unsupervised Learning flow diagram.

### Demo Links

- Dataset (Travel or Not? — Classification; Condominium Prices — Regression): https://docs.google.com/spreadsheets/d/1_xCC-V8FDW7bm1aRH7rem7FKq4-9Ly3-Daupv910B1w
- Colab: https://colab.research.google.com/drive/1H9f0Jdr81Ieov10np5AeGSPUd-RqRzX6

---

## Evaluation

### Overview

- **Regression Evaluation**: RMSE, MAE, MAPE
- **Classification Evaluation**: Accuracy, Precision, Recall, F1

### Model vs. Technique

- **Technique**: y = mx + c (the form)
- **Model**: y = 5x + 10, y = −3x + 12, y = 100x − 400 (fitted instances)

### Regression Evaluation

> 📄 See [PDF pages 46–49](documents/da-lec06-machine-learning-intro-20260718.pdf#page=46) — Regression evaluation diagrams showing actual vs. predicted values.

#### RMSE (Root Mean Square Error)

```
RMSE = √(1/n Σ (y − ŷ)²)
```

Steps: Error → Square → Mean → Root

**Example calculation:**

| Case # | y | ŷ |
|--------|---|---|
| 1 | 10 | 8 |
| 2 | 20 | 21 |
| 3 | 30 | 32 |

```
RMSE = √((10−8)² + (20−21)² + (30−32)² / 3)
     = √((2)² + (−1)² + (−2)² / 3)
     = √((4 + 1 + 4) / 3)
     = √(9/3)
     = √3
     = 1.732
```

#### Other Regression Metrics

- **RMSE** = √(1/n Σ (y − ŷ)²)
- **MAE** (Mean Absolute Error) = 1/n Σ |y − ŷ| → Example result: 1
- **MAPE** (Mean Absolute Percentage Error) = 100%/n Σ |(y − ŷ)/y| → Example result: 100%

### Classification Evaluation

> 📄 See [PDF pages 55–57](documents/da-lec06-machine-learning-intro-20260718.pdf#page=55) — Classifier diagram (Human vs. Not Human) and Confusion Matrix.

#### Confusion Matrix

| | | **Predicted** | |
|---|---|---|---|
| | | Yes | No |
| **Actual** | Yes | TP (True Positive) | FN (False Negative) |
| | No | FP (False Positive) | TN (True Negative) |

#### Metrics

| Metric | Formula |
|---|---|
| **Accuracy** | (TP + TN) / (TP + TN + FP + FN) |
| **Precision** | TP / (TP + FP) |
| **Recall** | TP / (TP + FN) |
| **F1** | 2 × (Precision × Recall) / (Precision + Recall) |

Example: 7 correct out of 10 → Accuracy = 0.7

---

## Learning Steps

### Overview

- Machine Learning Steps
- Train-Test Split
- K-Fold Cross-Validation

### Dataset

A dataset has inputs (X, features, independent variables, attributes) and output (y, label, dependent variable, actual y, y_true).

> 📄 See [PDF page 63](documents/da-lec06-machine-learning-intro-20260718.pdf#page=63) — Dataset structure diagram.

### Machine Learning Steps

1. **To Learning**: Dataset (X) + actual y → Model Learning
2. **To Predict**: Dataset (X) → Model → predicted y
3. **To Evaluate**: Dataset (X) → Model → predicted y → Compare with actual y

> 📄 See [PDF pages 65–69](documents/da-lec06-machine-learning-intro-20260718.pdf#page=65) — Learning, Predict, and Evaluate flow diagrams.

### Train-Test Split

> 📄 See [PDF pages 70–77](documents/da-lec06-machine-learning-intro-20260718.pdf#page=70) — Train-Test Split flow diagrams.

Steps:
1. Split dataset into X_train, y_train, X_test, y_test
2. Learning: Model ← fit(X_train, y_train)
3. Predict: y_pred ← Model.predict(X_test)
4. Compare: Performance ← compare(y_pred, y_test)

### K-Fold Cross-Validation

> 📄 See [PDF pages 78–79](documents/da-lec06-machine-learning-intro-20260718.pdf#page=78) — K-Fold Cross-Validation diagram.

In 3-Fold Cross-Validation, the whole dataset is divided into 3 folds (C1, C2, C3). In each round, one fold serves as the test set while the remaining folds form the training set. The final evaluation is the average of all rounds: (e1 + e2 + e3) / 3.

### Major Steps for Train-Test Split (Scikit-Learn)

1. **To Split Train-Test**: `train_test_split(X, y)` → X_train, X_test, y_train, y_test
2. **To Create a Model**: `{technique}.fit(X_train, y_train)` → Model
   - e.g., `LinearRegression()`, `LogisticRegression()`, `DecisionTreeClassifier()`, …
3. **To Predict**: `Model.predict(X_test)` → y_pred
4. **To Evaluate**: `{evaluation}(y_test, y_pred)` → value
   - e.g., `mean_squared_error`, `mean_absolute_percentage_error`, `accuracy_score`, `f1_score`, …

> 📄 See [PDF pages 85–89](documents/da-lec06-machine-learning-intro-20260718.pdf#page=85) — Scikit-Learn step-by-step diagrams.

---

## Scikit Learn

- Simple and efficient tools for predictive data analysis
- Accessible to everybody, and reusable in various contexts
- Built on NumPy, SciPy, and matplotlib
- Open source, commercially usable — BSD license

Ref: https://scikit-learn.org/

> 📄 See [PDF page 81](documents/da-lec06-machine-learning-intro-20260718.pdf#page=81) — Python Ecosystem for AI diagram (Database → Data Processing → Data Modelling → Presentation).

### Coding: Linear Regression

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

df = pd.read_csv('example.csv')
X = df[['x1', 'x2', 'x3']]
y = df['y']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

model = LinearRegression()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
```

### Coding: Decision Tree

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv('example.csv')
X = df[['x1', 'x2', 'x3']]
y = df['y']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

model = DecisionTreeClassifier()
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
```

### Coding: K-Fold Cross-Validation

```python
from sklearn.model_selection import KFold
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

kf = KFold(n_splits=4)
for train_index, test_index in kf.split(X):
    X_train, X_test = X.loc[train_index], X.loc[test_index]
    y_train, y_test = y.loc[train_index], y.loc[test_index]

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    mse_i = mean_squared_error(y_test, y_pred)
```

### To Deploy

After training and evaluation, deploy the final model:

```python
model.fit(X, y)  # Train on the entire dataset
```

---

## Regression

### Linear Regression

> 📄 See [PDF pages 95–98](documents/da-lec06-machine-learning-intro-20260718.pdf#page=95) — Linear Regression diagrams showing data points and fitted lines.

The goal is to find the line y = mx + c that best fits the data. Multiple candidate lines are compared (e.g., y = 0.5x + 1, y = 0.4x + 6, y = 0.2x + 12).

**Formula for multiple features:**

```
y = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ
```

Where β₀ is the **intercept**, β₁...βₙ are **coefficients**, and x₁...xₙ are the **features/attributes/variables**.

### Feature Selection

Use **Pearson Correlation** to select relevant features.

Ref: https://www.mathsisfun.com/data/correlation.html

> 📄 See [PDF page 100](documents/da-lec06-machine-learning-intro-20260718.pdf#page=100) — Correlation diagram.

### Colab: Linear Regression

https://colab.research.google.com/drive/1DdhhaIFbgNnJv98WgdBrF8J7nNKwpLHX#scrollTo=HoVU3NP1wCa7

---

## Classification

### Algorithms

- Decision Tree
- Logistic Regression
- Naïve Bayes
- K-Nearest Neighbors
- Artificial Neural Network

### Decision Tree

> 📄 See [PDF page 106](documents/da-lec06-machine-learning-intro-20260718.pdf#page=106) — Decision tree example: "Should I go to the cinema?" (Free Ticket? → Interesting Movie? → Close Friend? → Free Time?).

**Decision tree structure:** Root Node → Branches → Leaf Nodes.

> 📄 See [PDF page 108](documents/da-lec06-machine-learning-intro-20260718.pdf#page=108) — Decision tree table: Case, Temperature, Headache, Nausea → Flu prediction.

### Iris Dataset

150 rows × 5 columns. Used as a classic classification benchmark.

Ref: https://machinelearninghd.com/iris-dataset-uci-machine-learning-repository-project/

### Colab: Decision Tree

https://colab.research.google.com/drive/1DdhhaIFbgNnJv98WgdBrF8J7nNKwpLHX#scrollTo=APQ3LUiwwvjg

### Logistic Regression

> 📄 See [PDF page 112](documents/da-lec06-machine-learning-intro-20260718.pdf#page=112) — Logistic Regression sigmoid curve diagram.

```
y = 1 / (1 + e^(−(β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ)))
```

### Colab: Logistic Regression

https://colab.research.google.com/drive/1DdhhaIFbgNnJv98WgdBrF8J7nNKwpLHX#scrollTo=8aZWNrjMxJoy

### Naïve Bayes

> 📄 See [PDF page 114](documents/da-lec06-machine-learning-intro-20260718.pdf#page=114) — Naïve Bayes classification diagram.

Ref: https://ichi.pro/pt/os-5-principais-algoritmos-de-classificacao-que-voce-realmente-usara-na-vida-204676738787569

### Colab: Naïve Bayes

https://colab.research.google.com/drive/1DdhhaIFbgNnJv98WgdBrF8J7nNKwpLHX#scrollTo=fyDdDgKXxaOv

### K-Nearest Neighbors (K-NN)

> 📄 See [PDF pages 117–122](documents/da-lec06-machine-learning-intro-20260718.pdf#page=117) — K-NN diagrams showing classification of a new point with K = 1, K = 2, K = 3.

- K = 1 → classifies as Triangle
- K = 2 → ambiguous (tie)
- K = 3 → classifies as Square

### Colab: K-NN

https://colab.research.google.com/drive/1DdhhaIFbgNnJv98WgdBrF8J7nNKwpLHX?authuser=0#scrollTo=xH7YNQBQoOvD

### Artificial Neural Network (ANN)

> 📄 See [PDF page 125](documents/da-lec06-machine-learning-intro-20260718.pdf#page=125) — Neuron system diagram.

**Perceptron / Activation Function:**

```
h(X) = w₀ + x₁w₁ + x₂w₂
g(x) = 1 / (1 + e^(−h(X)))    ← Sigmoid (Logistic) Function
```

> 📄 See [PDF page 128](documents/da-lec06-machine-learning-intro-20260718.pdf#page=128) — Neural network architecture: input layer → hidden layers → output layer.

#### Feed Forward

Data flows from input through hidden layers to output.

> 📄 See [PDF page 129](documents/da-lec06-machine-learning-intro-20260718.pdf#page=129) — Feed Forward diagram.

#### Backpropagation

Error flows backward to update weights.

> 📄 See [PDF page 130](documents/da-lec06-machine-learning-intro-20260718.pdf#page=130) — Backpropagation diagram.

#### Weight Update (Gradient Descent)

```
wⱼ = wⱼ − α ∂/∂wⱼ J(W)

where J(W) = (1/2m) Σ (ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)²
      ŷ⁽ⁱ⁾ = w₀ + w₁x₁⁽ⁱ⁾ + w₂x₂⁽ⁱ⁾
```

> 📄 See [PDF pages 131–132](documents/da-lec06-machine-learning-intro-20260718.pdf#page=131) — Chain rule with partial derivatives and weight update diagrams.

### Colab: Artificial Neural Network

https://colab.research.google.com/drive/1DdhhaIFbgNnJv98WgdBrF8J7nNKwpLHX?authuser=0#scrollTo=r0znhtVBpyDY

---

## Summary

### AI Techniques Recap

- **Rule-Driven**: Expert System, …
- **Data-Driven**:
  - **Supervised**:
    - **Regression**: Linear Regression, Polynomial Regression, …
    - **Classification**: Logistic Regression, Naïve Bayes, Decision Tree, K-NN, Neural Network, …
  - **Unsupervised**: K-Means, DBSCAN, …

### Train-Test Split

Dataset → Split into X_train/y_train/X_test/y_test → Learning → Model → Compare y_pred with y_test → Performance.

### K-Fold Cross-Validation

Divide dataset into K folds → Train on K−1 folds, test on 1 fold → Repeat K times → Average results.

### Python Ecosystem for AI

Database → Data Processing → Data Modelling → Presentation (NumPy, SciPy, matplotlib, scikit-learn, Pandas).
