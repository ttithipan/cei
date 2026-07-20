# Data Analytics — Lec04: Data Processing (2026)

> 📄 [View original PDF](documents/da-lec04-data-processing-20260718.pdf) — source of truth
> ⚠️ The original lecture slides contain many images and diagrams — refer to the PDF for visual content.

Data Processing

Asst. Prof. Dr. Rathachai Chawuthai
Department of Computer Engineering
Faculty of Engineering
King Mongkut's Institute of Technology Ladkrabang

---

## Agenda

- Data Processing
- Data Cleansing
- Data Integration
- Data Transformation
- Feature Engineering
- Pipeline

---

> 📄 See [PDF page 5](documents/da-lec04-data-processing-20260718.pdf#page=5) — the Data Science Process flowchart highlighting the "Data is Processed" stage.

---

## Data Processing

> 📄 See [PDF page 7](documents/da-lec04-data-processing-20260718.pdf#page=7) — "Is Data Beautiful?" — illustration of messy real-world data.

Ref:
- Brett Romero, "Doing Data Science: A Kaggle Walkthrough – Cleaning Data"

---

### Why Is Data Dirty?

- **Incomplete data** comes from:
  - n/a data value when collected
  - different consideration between the time when the data was collected and when it is analyzed
  - human/hardware/software problems
- **Noisy data** comes from the process of data:
  - collection
  - entry
  - transmission
- **Inconsistent data** comes from:
  - Different data sources
  - Functional dependency violation

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

> 📄 See [PDF page 9](documents/da-lec04-data-processing-20260718.pdf#page=9) — chart: "Spending the most time doing…" — data preparation dominates the data science workflow.

Ref:
- (image) https://www.forbes.com/sites/gilpress/2016/03/23/data-preparation-most-time-consuming-least-enjoyable-data-science-task-survey-says/

---

### Tasks

- **Data Cleaning**: Fill in missing values, smooth noisy data, identify or remove outliers, and resolve inconsistencies
- **Data Integration**: Integration of multiple databases, data cubes, or files
- **Data Transformation**: Normalization and aggregation

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

## Data Cleansing

### Data Cleaning

- **Importance**:
  - "Data cleaning is one of the three biggest problems in data warehousing" — Ralph Kimball
  - "Data cleaning is the number one problem in data warehousing" — DCI survey
- **Data cleaning tasks**:
  - Fill in missing values
  - Identify outliers and smooth out noisy data
  - Correct inconsistent data
  - Resolve redundancy caused by data integration

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

### Missing Data

- Data is not always available
  - E.g., many tuples have no recorded value for several attributes, such as customer income in sales data
- Missing data may be due to:
  - equipment malfunction
  - inconsistent with other recorded data and thus deleted
  - data not entered due to misunderstanding
  - certain data may not be considered important at the time of entry
  - not register history or changes of the data
- Missing data may need to be inferred.

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

### How to Handle Missing Data?

- **Ignore the tuple**: usually done when class label is missing (assuming classification tasks) — not effective when the percentage of missing values per attribute varies considerably.
- **Fill in the missing value manually**: tedious + infeasible?
- **Fill in automatically** with:
  - a global constant: e.g., "unknown", a new class?!
  - the attribute's mean
  - the attribute's mean for all samples belonging to the same class: smarter
  - the most probable value: inference-based such as Bayesian formula or decision tree

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

### Options for Dealing With Missing Data

Missing data in general is one of the trickier issues that is dealt with when cleaning data. Broadly there are two solutions:

**Deleting/Ignoring rows with missing values**
- Missing Value Handling: The simplest solution is to remove records with missing values, but only if the proportion is small (around 10%).
- Dataset Size Consideration: Deleting too many rows (more than 10%) can negatively impact the model's performance.

**Filling in the Values**
- Handling Missing Data: Filling missing values with a specific value.
- Value Selection: Depends on data type, such as using common value (rather than "unknown") for categorical data or the mode for numerical data.

Ref:
- Brett Romero, "Doing Data Science: A Kaggle Walkthrough – Cleaning Data"

---

### Educated Guessing

It sounds arbitrary and isn't your preferred course of action, but you can often infer a missing value. For related questions, for example, like those often presented in a matrix, if the participant responds with all "4s", assume that the missing value is a 4.

Ref:
- Jeff Sauro: "7 Ways to Handle Missing Data"

---

### Noisy Data

- **Noise**: random error or variance in a measured variable
- Incorrect attribute values may be due to:
  - faulty data collection instruments
  - data entry problems
  - data transmission problems
  - technology limitation
  - inconsistency in naming convention
- Other data problems which require data cleaning:
  - duplicate records
  - incomplete data
  - inconsistent data

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

### Use Interquartile Range to Remove Noisy Data

> 📄 See [PDF page 15](documents/da-lec04-data-processing-20260718.pdf#page=15) — box plot diagram showing interquartile range calculation.

**Steps:**

1. **IQR = Q3 − Q1**
2. **Lower Fence** = Q1 − 1.5 × IQR
3. **Upper Fence** = Q3 + 1.5 × IQR

**Example:** Data values: 11, 12, 14, 15, 16, 17, 18

- Q1 = 11, Q3 = 18
- IQR = 18 − 11 = 7
- Lower Fence = 11 − 1.5 × 7 = 0.5
- Upper Fence = 18 + 1.5 × 7 = 28.5

> 📄 See [PDF page 16](documents/da-lec04-data-processing-20260718.pdf#page=16) — annotated box plot with Q1, Q3, lower fence (0.5) and upper fence (28.5) marked.

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

## Data Integration

### Data Integration

- **Data integration**: combines data from multiple sources into a coherent store
- **Schema integration**: integrate metadata from different sources
- **Entity identification problem**: identify real world entities from multiple data sources, e.g., A.cust-id ≡ B.cust-#
- **Detecting and resolving data value conflicts**:
  - for the same real-world entity, attribute values from different sources are different
  - possible reasons: different representations, different scales, e.g., metric vs. British units

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

## Data Transformation

### Data Transformation

- **Smoothing**: remove noise from data
- **Aggregation**: summarization, data cube construction
- **Generalization**: concept hierarchy climbing
- **Normalization**: scaled to fall within a small, specified range
  - min-max normalization
  - z-score normalization
  - normalization by decimal scaling
- **Attribute/feature construction**: new attributes constructed from the given ones

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

### Reshape

> 📄 See [PDF page 19](documents/da-lec04-data-processing-20260718.pdf#page=19) — diagram illustrating data reshaping concepts.

Ref:
- (image) https://www.pinterest.com/pin/413838653229463002/

---

### Sparse Matrix

> 📄 See [PDF page 20](documents/da-lec04-data-processing-20260718.pdf#page=20) — transformation from a list of (User, Movie, Rating) triples into a sparse user-movie rating matrix.

---

### Document to Vector

> 📄 See [PDF page 21](documents/da-lec04-data-processing-20260718.pdf#page=21) — Doc2Vec transformation diagram.

Ref:
- (image) https://lmu-pms.github.io/irom-blog/posts/Doc2Vec.html

---

### Adjacency Matrix

> 📄 See [PDF page 22](documents/da-lec04-data-processing-20260718.pdf#page=22) — graph to adjacency matrix transformation.

Ref:
- (image) https://www.quora.com/How-can-I-find-the-correct-adjacency-matrix-given-a-particular-graph

---

## Feature Engineering

### Feature Engineering Techniques

- Imputation
- Handling Outliers
- Binning
- Log Transform
- One-Hot Encoding
- Grouping Operations
- Feature Split
- Scaling
- Extracting Date

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Imputation

Filling missing values:

- **Numerical Imputation**:
  - Replace with 0 is not a good solution
  - Mean may be better
  - Mean of the group
  - Same in cluster
  - Regression
- **Categorical Imputation**:
  - Replacing the missing values with the maximum occurred value.
  - If values are distributed uniformly and there is not a dominant value, imputing a category like "Other" might be more sensible, because in such a case, your imputation is likely to converge to a random selection.

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Handling Outliers

Detect outliers using standard deviation, and percentiles.

- **Outlier Detection with Standard Deviation**: If a value has a distance to the average higher than *x* × standard deviation, it can be assumed as an outlier. Then what *x* should be?
- **Outlier Detection with Percentiles**: Assume a certain percent of the value from the top or the bottom as an outlier. The key point is to set the percentage value, and this depends on the distribution of your data.
  - Detect data between 5th and 95th percentiles.
- **An Outlier Dilemma: Drop or Cap**

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Binning

The main motivation of binning is to make the model more robust and prevent overfitting, however, it has a cost to performance. Every time you bin something, you sacrifice information and make your data more regularized.

**Numerical Binning Example:**

| Value | Bin |
|---|---|
| 0–30 | Low |
| 31–70 | Mid |
| 71–100 | High |

**Categorical Binning Example:**

| Value | Bin |
|---|---|
| Spain | Europe |
| Italy | Europe |
| Chile | South America |
| Brazil | South America |

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Log Transform

Logarithm transformation (or log transform) is one of the most commonly used mathematical transformations in feature engineering. Benefits of log transform:

- It helps to handle skewed data and after transformation, the distribution becomes more approximate to normal.
- In most cases the magnitude order of the data changes within the range of the data. For instance, the difference between ages 15 and 20 is not equal to the ages 65 and 70. Log transform normalizes magnitude differences like that.
- It also decreases the effect of outliers, due to the normalization of magnitude differences and the model becomes more robust.

> 📄 See [PDF page 29](documents/da-lec04-data-processing-20260718.pdf#page=29) — chart comparing data distribution before and after log transform.

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114
- (image) https://www.pinterest.com/pin/413838653229463002/

---

### One-Hot Encoding

One-hot encoding is one of the most common encoding methods in machine learning. This method spreads the values in a column to multiple flag columns and assigns 0 or 1 to them. These binary values express the relationship between grouped and encoded column.

This method changes your categorical data, which is challenging to understand for algorithms, to a numerical format and enables you to group your categorical data without losing any information.

> 📄 See [PDF page 30](documents/da-lec04-data-processing-20260718.pdf#page=30) — one-hot encoding example showing users (A, B, C) and their social networks transformed into binary columns (Facebook, Instagram, Twitter).

```python
encoded_columns = pd.get_dummies(data['column'])
data = data.join(encoded_columns).drop('column', axis=1)
```

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Grouping Operations

- In most machine learning algorithms, every instance is represented by a row in the training dataset, where every column shows a different feature of the instance. This kind of data is called **"Tidy"**.
- Datasets such as transactions rarely fit the definition of tidy data above, because of the multiple rows of an instance. In such a case, we group the data by the instances and then every instance is represented by only one row.

**Grouping Types:**
- **Categorical Column Grouping**
- **Numerical Column Grouping**: Numerical columns are grouped using sum and mean functions in most cases. Both can be preferable according to the meaning of the feature.

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Feature Split

Splitting features is a good way to make them useful in terms of machine learning. Most of the time the dataset contains string columns that violate tidy data principles. By extracting the utilizable parts of a column into new features:

- We enable machine learning algorithms to comprehend them.
- Make possible to bin and group them.
- Improve model performance by uncovering potential information.

Split function is a good option, however, there is no one way of splitting features. It depends on the characteristics of the column.

**Example 1 — Splitting a name column:**

| user | name |
|---|---|
| 1 | John Doe |
| 2 | Peter Smith |
| 3 | Tony Brown |

→

| user | first_name | last_name |
|---|---|---|
| 1 | John | Doe |
| 2 | Peter | Smith |
| 3 | Tony | Brown |

**Example 2 — Extracting year from movie title:**

| Movie | Year |
|---|---|
| Toy Story (1995) | 1995 |
| Jumanji (1995) | 1995 |
| Grumpier Old Men (1995) | 1995 |

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Scaling

In most cases, the numerical features of the dataset do not have a certain range and they differ from each other. Scaling solves this problem — continuous features become identical in terms of range. This process is not mandatory for many algorithms, but algorithms based on distance calculations such as k-NN or k-Means **need** to have scaled continuous features as model input.

#### Normalization (Min-Max Normalization)

Scale all values in a fixed range between 0 and 1. This transformation does not change the distribution of the feature and due to the decreased standard deviations, the effects of outliers increases. Therefore, before normalization, it is recommended to handle the outliers.

| value | normalized |
|---|---|
| 23 | 0.63 |
| -23 | 0.00 |
| 100 | 1.00 |
| 45 | 0.47 |
| 54 | 0.23 |
| -12 | 0.10 |

#### Standardization (Z-Score Normalization)

Scales the values while taking into account standard deviation. If the standard deviation of features is different, their range also would differ from each other. This reduces the effect of outliers in the features.

Formula: z = (x − μ) / σ (where μ = mean, σ = standard deviation)

| value | standardized |
|---|---|
| 23 | 0.70 |
| -23 | -1.23 |
| 100 | 1.84 |
| 45 | 0.22 |
| 54 | -0.42 |
| -12 | -0.92 |

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

### Extracting Date

Dates can be present in numerous formats, which make it hard to understand by algorithms. Building an ordinal relationship between the values is very challenging for a machine learning algorithm if you leave the date columns without manipulation.

Three types of preprocessing for dates are suggested:
- Extracting the parts of the date into different columns: Year, month, day, etc.
- Extracting the time period between the current date and columns in terms of years, months, days, etc.
- Extracting some specific features from the date: Name of the weekday, Weekend or not, holiday or not, etc.

**Example DataFrame:**

```python
from datetime import date
data = pd.DataFrame({'date':
['01-01-2017',
'04-12-2008',
'23-06-1988',
'25-08-1999',
'20-02-1993',
]})
```

**Code:**

```python
# Transform string to date
data['date'] = pd.to_datetime(data.date, format="%d-%m-%Y")

# Extracting Year
data['year'] = data['date'].dt.year

# Extracting Month
data['month'] = data['date'].dt.month

# Extracting passed years since the date
data['diff_years'] = date.today().year - data['date'].dt.year

# Extracting passed months since the date
data['diff_months'] = (date.today().year - data['date'].dt.year) * 12 + date.today().month - data['date'].dt.month

# Extracting the weekday name of the date
data['day_name'] = data['date'].dt.day_name()
```

**Result:**

| date | year | month | diff_years | diff_months | day_name |
|---|---|---|---|---|---|
| 2017-01-01 | 2017 | 1 | 2 | 26 | Sunday |
| 2008-12-04 | 2008 | 12 | 11 | 123 | Thursday |
| 1988-06-23 | 1988 | 6 | 31 | 369 | Thursday |
| 1999-08-25 | 1999 | 8 | 20 | 235 | Wednesday |
| 1993-02-20 | 1993 | 2 | 26 | 313 | Saturday |

Ref:
- https://towardsdatascience.com/feature-engineering-for-machine-learning-3a5e293a5114

---

## Pipeline

### Data Processing Pipeline

> 📄 See [PDF page 35](documents/da-lec04-data-processing-20260718.pdf#page=35) — pipeline diagram showing modules (D1–D5) connected into an analytics system, with data flowing from Module 1 → Module 2 → Module 3 → Module 4.

> 📄 See [PDF page 36](documents/da-lec04-data-processing-20260718.pdf#page=36) — example pipeline: Module 1 → Module 2 (one-hot encoding) → Module 3 → Module 4, producing dx1 and dx2 outputs.

---

### Data Dictionary

Example data dictionary for a pipeline output:

- **Name**: dx2: User-SocialMedia Matrix
- **Location**: CSV file in `/var/system/XYZ/dataset/dx2_{date}.csv`
- **Note**: Daily data generated. `dx2_{date}` e.g., date = 2020-11-15

**Schema:**

| Field | Datatype | Description |
|---|---|---|
| User | String | User ID e.g., A, B, C |
| Other columns | Boolean | Use social media as a column. Values: 1 = Have, 0 = Don't Have |

Ref:
- Chris Clifton, "Instruction to Data Mining"

---

> "We're entering a new world in which data may be more important than software."
> — Tim O'Reilly

つづく
