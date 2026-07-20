# Data Analytics — Lec09: Classification & Evaluation (2026)

> 📄 [View original PDF](documents/da-lec09-classification-evaluation-20260718.pdf) — source of truth
> ⚠️ The original lecture slides contain many images and diagrams — refer to the PDF for visual content.

Instructor: Rathachai Chawuthai

---

## Agenda

- Introduction — TP, TN, FP, FN
- Accuracy
- Precision, Recall, F1
- TPR, FPR, ROC, AUC
- Confusion Matrix for Multi-Class

---

## Introduction

### AI Techniques Recap

- **Rule-Driven**: Expert System, …
- **Data-Driven**:
  - **Supervised**:
    - **Regression**: Linear Regression, Polynomial Regression, …
    - **Classification**: Logistic Regression, Naïve Bayes, Decision Tree, Neural Network, …
  - **Unsupervised**: K-Means, DBSCAN, …

### Train-Test Split

Dataset → X_train / y_train + X_test / y_test → Learning (Model) → Compare y_pred (ŷ) with y_test → Performance.

### K-Fold Cross-Validation

Divide dataset into K folds (e.g., 3 folds: C1, C2, C3). In each round, one fold is the test set and the rest are training. Average result = (e1 + e2 + e3) / 3.

> 📄 See [PDF pages 5–6](documents/da-lec09-classification-evaluation-20260718.pdf#page=5) — Train-Test Split and K-Fold Cross-Validation diagrams.

### Example Classification

A classifier for birds given features `has_wing` and `can_fly`:

| has_wing | can_fly | actual_class | predicted | Correct? |
|---|---|---|---|---|
| yes | yes | bird | bird | ✓ |
| yes | yes | bird | bird | ✓ |
| yes | no | bird | not-bird | ✗ |
| yes | yes | not-bird | bird | ✗ |
| no | no | not-bird | not-bird | ✓ |
| no | yes | not-bird | not-bird | ✓ |
| no | no | bird | not-bird | ✗ |
| no | yes | not-bird | not-bird | ✓ |

---

## TP | TN | FP | FN

> 📄 See [PDF pages 10–11](documents/da-lec09-classification-evaluation-20260718.pdf#page=10) — Evaluation methods overview diagram.

### Definitions

In binary classification, the classes are: **positive** (the class of interest) and **negative**.

| Term | Definition |
|---|---|
| **TP** (True Positive) | Sample correctly classified as positive |
| **TN** (True Negative) | Sample correctly classified as negative |
| **FP** (False Positive) | Sample incorrectly classified as positive |
| **FN** (False Negative) | Sample incorrectly classified as negative |

Ref: http://nlpforhackers.io/classification-performance-metrics/

### Positive vs. Negative

- **Positive** — does not mean "good." It means **the class you want** to detect.
- **Negative** — does not mean "bad." It means **the class you don't want** to detect.
- Don't be emotional about the labels!

### Simplified Meanings

| Term | Meaning |
|---|---|
| **True Positive** | Model selects the class you want — and it's correct |
| **True Negative** | Model doesn't select the class you don't want — and it's correct |
| **False Positive** | Model selects a class you don't want — it's wrong |
| **False Negative** | Model doesn't select a class you want — it's wrong |

### The Confusion Matrix Layout

```
                Predicted: YES    Predicted: no
Actual: YES     TP (true-positive)    FN (false-negative)
Actual: no      FP (false-positive)   TN (true-negative)
```

### Scenario Practice

| Scenario | Result |
|---|---|
| To detect cars, the model selects a car | TP |
| To detect cars, the model selects a bicycle | FP |
| To detect cars, the model does not select a car | FN |
| To detect cars, the model does not select a bicycle | TN |
| To detect fire, the fire alarm alerts without fire | FP |
| To detect thieves, the device does not alert when a thief enters | FN |
| To detect fire, the fire alarm does not alert under normal situation | TN |
| To detect thieves, the device alerts when a family member enters | FP |

> 📄 See [PDF pages 18–26](documents/da-lec09-classification-evaluation-20260718.pdf#page=18) — Step-by-step scenario practice (each slide reveals one more answer).

---

## Accuracy

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

### Accuracy Exercises

The following exercises count TP, TN, FP, FN in a confusion matrix and compute accuracy. Refer to the PDF for the actual filled-in matrix cells.

> 📄 See [PDF pages 45–57](documents/da-lec09-classification-evaluation-20260718.pdf#page=45) — Accuracy exercises 1–5 with confusion matrices.

| Exercise | Calculation | Accuracy |
|---|---|---|
| Ex 1 | (3 + 4) / 10 | 0.7 |
| Ex 2 | (1 + 8) / 10 | 0.9 |
| Ex 3 | (0 + 8) / 10 | 0.8 |
| Ex 4 | (0 + 96) / 100 | 0.96 |
| Ex 5 | (1 + 96) / 100 | 0.97 |

Note: Exercises 4 and 5 illustrate how **accuracy can be misleading** with imbalanced classes — 96 true negatives out of 100 samples.

---

## Precision, Recall, F1

> 📄 See [PDF page 60](documents/da-lec09-classification-evaluation-20260718.pdf#page=60) — Precision and Recall Venn diagram.

```
Precision = TP / (TP + FP)        ← Of all predicted positives, how many are correct?

Recall    = TP / (TP + FN)        ← Of all actual positives, how many did we find?

F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

### When Precision ≈ 1.00 — Is It Good?

Not necessarily! If the model only predicts a few positives but gets them all right, recall could be very low.

> 📄 See [PDF pages 64–67](documents/da-lec09-classification-evaluation-20260718.pdf#page=64) — Precision ≈ 1.00 discussion examples.

### When Recall ≈ 1.00 — Is It Good?

Not necessarily! If the model predicts everything as positive, recall could be 1.00 but precision would be terrible.

> 📄 See [PDF pages 68–71](documents/da-lec09-classification-evaluation-20260718.pdf#page=68) — Recall ≈ 1.00 discussion examples.

### F1 Examples

> 📄 See [PDF pages 72–75](documents/da-lec09-classification-evaluation-20260718.pdf#page=72) — F1 calculation examples.

**Example 3.1:**
- Recall = 4 / (4 + 1) = 0.80
- Precision = 4 / (4 + 2) = 0.67
- F1 = 2 × (0.67 × 0.80) / (0.67 + 0.80) = **0.73**

**Example 3.2 (Imbalanced):**
- Recall = 1 / (1 + 2) ≈ 0.33
- Precision = 1 / (1 + 1) = 0.50
- F1 = 2 × (0.50 × 0.33) / (0.50 + 0.33) ≈ **0.40**
- Accuracy = (0 + 96) / 100 = 0.96 — misleadingly high!

### Recommendation

- **Balanced Class Distribution** → use **Accuracy**
- **Imbalanced Class Distribution** → use **Precision, Recall, F1**

### Multi-Class: Balanced or Imbalanced?

Even with equal samples per class (e.g., Class A: 10, B: 10, C: 10, D: 10), binary classification splits are **imbalanced**:
- Class A (10) vs. Not-Class A (30) → imbalanced!
- Same for B, C, D

**Recommendation for multi-class**: Use Precision, Recall, F1.

---

## TPR | FPR | ROC | AUC

### True Positive Rate & False Positive Rate

```
TPR (True Positive Rate) = TP / (TP + FN)      ← Same as Recall
FPR (False Positive Rate) = FP / (FP + TN)
```

### Building the ROC Curve — Step by Step

The classifier ranks samples by confidence. At each threshold (round 0 to round 10), more samples are classified as positive, changing the TPR and FPR.

> 📄 See [PDF pages 81–93](documents/da-lec09-classification-evaluation-20260718.pdf#page=81) — ROC curve building: Rounds 0–10 with confusion matrices.

| Round | TP | FN | FP | TN | TPR | FPR | Point (FPR, TPR) |
|---|---|---|---|---|---|---|---|
| 0 | 0 | 5 | 0 | 5 | 0.0 | 0.0 | (0.0, 0.0) |
| 1 | 1 | 4 | 0 | 5 | 0.2 | 0.0 | (0.0, 0.2) |
| 2 | 2 | 3 | 0 | 5 | 0.4 | 0.0 | (0.0, 0.4) |
| 3 | 3 | 2 | 0 | 5 | 0.6 | 0.0 | (0.0, 0.6) |
| 4 | 4 | 1 | 0 | 5 | 0.8 | 0.0 | (0.0, 0.8) |
| 5 | 4 | 1 | 1 | 4 | 0.8 | 0.2 | (0.2, 0.8) |
| 6 | 5 | 0 | 1 | 4 | 1.0 | 0.2 | (0.2, 1.0) |
| 7 | 5 | 0 | 2 | 3 | 1.0 | 0.4 | (0.4, 1.0) |
| 8 | 5 | 0 | 3 | 2 | 1.0 | 0.6 | (0.6, 1.0) |
| 9 | 5 | 0 | 4 | 1 | 1.0 | 0.8 | (0.8, 1.0) |
| 10 | 5 | 0 | 5 | 0 | 1.0 | 1.0 | (1.0, 1.0) |

### ROC Curve

ROC (Receiver Operating Characteristic) curve plots **TPR (y-axis)** vs. **FPR (x-axis)**.

> 📄 See [PDF page 96](documents/da-lec09-classification-evaluation-20260718.pdf#page=96) — ROC Curve diagram with TPR vs FPR axes.

Refs:
- https://www.projectrhea.org/rhea/index.php/NeymanPearson_Lemma_and_Receiver_Operating_Characteristic_Curve
- http://mlwiki.org/index.php/ROC_Analysis

### AUC: Area Under the ROC Curve

AUC summarizes the ROC curve into a single number. An area of **1** represents a perfect test; **0.5** represents a worthless test.

| AUC Range | Grade |
|---|---|
| 0.9 – 1.0 | Excellent (A) |
| 0.8 – 0.9 | Good (B) |
| 0.7 – 0.8 | Fair (C) |
| 0.6 – 0.7 | Poor (D) |
| 0.5 – 0.6 | Fail (F) |

> 📄 See [PDF page 100](documents/da-lec09-classification-evaluation-20260718.pdf#page=100) — ROC curves with three AUC levels (excellent, good, worthless) plotted on the same graph.

Example shown: AUC = 0.7 (Fair / C grade).

Refs:
- http://gim.unmc.edu/dxtests/roc3.htm
- http://molevol.altervista.org/blog/roc-curve-area-roc-curve-auc/

---

## Confusion Matrix for Multi-Class

For multi-class problems, the confusion matrix is an N×N grid showing predicted class vs. actual class.

> 📄 See [PDF page 102](documents/da-lec09-classification-evaluation-20260718.pdf#page=102) — Multi-class confusion matrix layout.

### Heatmap Visualization

Confusion matrices are often displayed as heatmaps for quick interpretation.

> 📄 See [PDF page 103](documents/da-lec09-classification-evaluation-20260718.pdf#page=103) — Heatmap confusion matrix for multi-label classification.

Ref: https://www.researchgate.net/figure/Figure-3-Heat-map-confusion-matrix-for-multi-label-exact-deviation-classification-results-using_316316283_fig3

### Comparison

Which classifier is better? Compare confusion matrices, ROC curves, and AUC.

> 📄 See [PDF page 104](documents/da-lec09-classification-evaluation-20260718.pdf#page=104) — Classifier comparison diagram.

Ref: http://ieeexplore.ieee.org/document/7279167/

---

## Summary

### Evaluation Methods

- **TP / TN / FP / FN** — Confusion matrix cells
- **Accuracy** — (TP + TN) / (TP + TN + FP + FN)
- **Precision** — TP / (TP + FP)
- **Recall** — TP / (TP + FN)
- **F1-Score** — Harmonic mean of Precision and Recall
- **TP Rate (TPR)** — Same as Recall
- **FP Rate (FPR)** — FP / (FP + TN)
- **ROC Curve** — TPR vs. FPR
- **AUC** — Area Under ROC Curve
- **Confusion Matrix for Multi-Class**

### Recommendations

| Scenario | Recommended Metric |
|---|---|
| Balanced Binary-Class | Accuracy |
| Imbalanced Binary-Class | Precision, Recall, F1 |
| Multi-Class | Precision, Recall, F1 |
| Overall Algorithm Performance | ROC Curve, AUC |
| Transparency | Show the Confusion Matrix |
