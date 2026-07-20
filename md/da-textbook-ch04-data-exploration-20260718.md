# Data Analytics Textbook — Ch04: Data Exploration (2026)

> 📄 [View original PDF](documents/da-textbook-ch04-data-exploration-20260718.pdf) — source of truth

4. Data Exploration
“No data is clean, but most is useful.”
— Dean Abbott

> 📄 See [PDF page 1](documents/da-textbook-ch04-data-exploration-20260718.pdf#page=1) — Figure 4.0-1: Data exploration step in the data science process
Once data is ready for use, the next step is data exploration (Figure 4.0-1, DS-3), which builds a deeper
understanding of how the data behaves and guides the choice of analysis technique. If the data proves genuinely
ready, the process moves on to model development; if issues are found, it loops back to data processing. This
chapter reviews basic statistics, exploring data distribution, and data relationships.
## 4.1 Review of Basic Statistical Functions

This section reviews basic statistical functions, grouped into central tendency and dispersion (James et al.,
2013), as a foundation for the analysis ahead.
Central Tendency
Values that represent a dataset as a whole: the arithmetic mean, the median, and the mode.
Arithmetic Mean
In this book, "average" refers to the arithmetic mean, defined as:

x̄ = (1/n) Σ x̄ᵢ  (summed over i = 1 to n)

where x̄ denotes the mean, n is the number of data points, and xi is each individual value being summed.
```python
import numpy as np

X = np.array([1, 1, 5, 8, 10, 11])
np.mean(X)
```

```
6.0
```

Median
An alternative measure of center, useful when the data contains extreme outliers that would skew the mean.
The median is found by sorting the data and taking the middle value: for [1, 3, 5, 7, 100] (5 items), the middle
(3rd) value, 5, is the median. For an even count, such as [1, 3, 5, 7, 9, 100] (6 items), the median is the mean
of the 3rd and 4th values (5 and 7), giving 6.

```python
np.median(X)
```

```
6.5
```

Mode
The most frequently occurring value(s), applicable to nominal data too. For example, in the blood-type list [A,
A, A, B, B, B, O, O, AB], both A and B are modes, since they tie for the highest frequency.
```python
from scipy import stats
stats.mode(X)[0]
```

```
array([1])
```

Dispersion
Beyond central tendency, dispersion describes how spread out the data is. This section reviews the standard
deviation.
Standard Deviation
The most common measure of dispersion:

SD = √(1/n) Σ (x̄ᵢ − x̄)²

where SD is the standard deviation, x̄ denotes the mean, n is the number of data points, and xi is each individual
value. A full statistical treatment of standard deviation is beyond this book's scope; the notation above is
presented as a reference for the code that follows.
```python
np.std(X)
```

```
4.0
```

## 4.2 Exploring Data Distribution

Exploring a dataset's distribution (Walliman, 2010) typically uses histograms and box plots.
Histogram
A histogram shows the frequency distribution of a variable. Figure 4.2-1 shows an example histogram of
student height at a school of 1,000 students: the horizontal axis is height (cm) and the vertical axis is frequency
— for instance, about 10 students fall in the [157, 158) range, and about 250 fall in [160, 161). Naturally
distributed data typically forms the classic bell-shaped curve shown here, indicating a normal distribution.

> 📄 See [PDF page 3](documents/da-textbook-ch04-data-exploration-20260718.pdf#page=3) — Figure 4.2-1: Example histogram of student height at a school
Using the Boston housing dataset as an example:
```python
import pandas as pd

df = pd.read_csv('https://rathachai.github.io/DA-LAB/datasets/boston.csv')
df["rm"].hist()
```

Box Plot
While histograms give a detailed view of one variable's distribution, box plots are better suited to comparing
distributions across multiple variables side by side. Figure 4.2-2 shows the anatomy of a box plot:
•
Outlier — points beyond the upper or lower bound
•
Minimum — the lowest value excluding outliers
•
Q1 — the 1st quartile (25th percentile)
•
Q2 — the 2nd quartile, i.e., the median (50th percentile)
•
Q3 — the 3rd quartile (75th percentile)
•
Maximum — the highest value excluding outliers
•
IQR — the range between Q1 and Q3

> 📄 See [PDF page 4](documents/da-textbook-ch04-data-exploration-20260718.pdf#page=4) — Figure 4.2-2: Anatomy of a box plot
Using the Boston housing dataset:
```python
df[["indus", "rm", "age", "dis"]].plot.box()
```

## 4.3 Data Relationships

Finding relationships between data means examining how two variables relate to each other. This section
covers Pearson correlation and scatter plots, both popular in data analytics (James et al., 2013; Wexler, 2017).
Pearson Correlation
Pearson correlation measures linear correlation — the direction between two variables. If one variable
increases as the other increases, they move in the same (positive) direction; if one increases as the other
decreases, they move in opposite (negative) directions (James et al., 2013). This measure indicates direction
only, not which variable depends on which:
r = Σ (x̄ᵢ − x̄)(yᵢ − ȳ) / √(Σ (x̄ᵢ − x̄)² · Σ (yᵢ − ȳ)²)

where r is the Pearson correlation coefficient, x̄ and ȳ denote the means, n is the number of data points, and xi,
yi are the individual x and y values.

> 📄 See [PDF page 5](documents/da-textbook-ch04-data-exploration-20260718.pdf#page=5) — Figure 4.3-1: Pearson correlation coefficient patterns
As shown in Figure 4.3-1, data that increases together along a straight line scores close to 1; as points scatter
away from that line the score falls toward 0 (no relationship); and data trending in opposite directions along a
line scores close to −1, again approaching 0 as points scatter.
Even though values near 1 and −1 are opposite in direction, both indicate a strong linear relationship — just
with different signs. Because of this property, linear regression relies on this measure when selecting variables
to build a model.

Using the Boston housing dataset:
```python
import pandas as pd

df = pd.read_csv('https://rathachai.github.io/DA-LAB/datasets/boston.csv')
df[["rm","medv"]].corr(method="pearson")
df[["rm","medv"]].corr(method="pearson").loc["rm","medv"]
```

```
0.6953599470715394
```
Scatter Plot
A scatter plot is the most common way to visualize a relationship between two variables, with one variable on
each axis. Figure 4.3-2 shows an example using the height and weight of four people, plotted to reveal the
relationship between the two variables.

> 📄 See [PDF page 6](documents/da-textbook-ch04-data-exploration-20260718.pdf#page=6) — Figure 4.3-2: Example scatter plot of weight vs. height
Using the Boston housing dataset:
```python
df.plot.scatter(x="rm", y="medv")
```

## 4.4 Example of Data Exploration

To reinforce these ideas, this section walks through exploring relationships in data, distinguishing two variable
types:
•
Numerical (quantitative) variables — represented by numbers, covering interval and ratio scales, e.g.,
GPA, test scores, amounts of money, income, headcount, weight, height, age, or temperature.
•
Categorical (qualitative) variables — not measurable by number, represented by category names (or
numbers standing in for categories), covering nominal and ordinal scales, e.g., gender, religion,
country, province, class, product group, department, blood type, shirt size (S, M, L, XL), or date.

The following explores relationships between numerical–numerical, categorical–categorical, and numerical–
categorical variable pairs, using the employee dataset from section 2.5.1: numerical variables age, salary, and
working_years, and categorical variables gender, department, and birth_place.
Importing the Data

```python
import pandas as pd
import seaborn as sns

df = pd.read_csv('https://rathachai.github.io/DA-LAB/datasets/simple-employee-db.csv')
df
```

Numerical – Numerical
Exploring the relationship between two numerical variables typically uses scatter plots and correlation values:

```python
sns.pairplot(df[["age","salary","working_years"]], diag_kind="kde", corner=True)
```

This produces scatter plots for age vs. working_years, age vs. salary, and salary vs. working_years, letting the
analyst inspect whether each pair is linear, curved, or unrelated, along with each variable's own distribution.

```python
sns.heatmap(df[["age","salary","working_years"]].corr(), annot=True)
```

This produces a heat map of correlation values among age, salary, and working_years, color-coded and
annotated with the numeric correlation — here, salary and working_years show a notably high correlation.

Categorical – Categorical
Exploring the relationship between two categorical variables is best done by counting occurrences across
groups, typically with a bar chart:
```python
sns.countplot(data=df, x="department", hue="gender")
```

This produces a bar chart with department on the x-axis and count on the y-axis, split by gender. The result
shows a roughly even gender split across most departments, except developer (more female) and devops (male
only).

Numerical – Categorical
Exploring the relationship between a numerical and a categorical variable can be done several ways: group-
wise means, grouped box plots, or grouped scatter plots.
Group-wise means, shown as a bar chart:
```python
dfg = df.groupby("department")[["salary"]].mean().reset_index()
dfg.plot.bar(x="department", y="salary")
```

This produces a bar chart with department on the x-axis and mean salary on the y-axis; the result shows
marketing has the highest average salary.

A grouped box plot:
```python
dfg = df[["department", "salary"]].groupby("department")
dfg.boxplot(rot=45, subplots=False)
```
This produces four box plots, one per department, showing salary distribution; marketing shows both a high
salary level and low spread.

A grouped scatter plot:
```python
sns.pairplot(df[["working_years","salary", "age", "department"]],
             hue="department",
             markers=["o", "s", "P", "D"], size=2, corner=True)
```
This produces scatter plots for age vs. working_years, age vs. salary, and salary vs. working_years, color- and
marker-coded by department (circle = developer, square = marketing, plus = support, diamond = devops),
along with each group's distribution per variable.

## 4.5 Chapter Summary

This chapter covered exploring data once it's ready for use, to observe its behavior and guide the choice of
analysis technique. It reviewed key basic statistics — the arithmetic mean, median, mode, and standard
deviation — and introduced ways to visualize data behavior through histograms, box plots, and scatter plots,
along with a worked example of data exploration. If exploration reveals something abnormal, the process can
always loop back to data processing.
## 4.6 Review Questions

Load the simple vehicle classification dataset from section 2.5.2 with:
```python
import pandas as pd

df = pd.read_csv('https://rathachai.github.io/DA-LAB/datasets/simple-veh-class.csv')
```

Then answer the following:
1. Write code to find the arithmetic mean of the weight_kg column.
2. Write code to find the standard deviation of the weight_kg column.
3. Write code to show a histogram of the weight_kg column.
4. Write code to show a box plot of the weight_kg, height_m, and n_wheels columns.
5. Write code to show a scatter plot between weight_kg and height_m.
6. Write code to find the Pearson correlation coefficient between weight_kg and height_m.
7. Write code to find the Pearson correlation coefficient between weight_kg and n_wheels.
8. Write code to find the Pearson correlation coefficient between height_m and n_wheels.
## 4.7 References

Boschetti, A., & Massaron, L. (2015). Python Data Science Essentials. Packt Publishing Ltd.
Igual, L., & Seguí, S. (2017). Introduction to Data Science. Springer, Cham.
James, G., Witten, D., Hastie, T., & Tibshirani, R. (2013). An Introduction to Statistical Learning: With
Applications in R (Vol. 112). Springer.
O’Neil, C., & Schutt, R. (2013). Doing Data Science: Straight Talk from the Frontline. O’Reilly Media, Inc.
VanderPlas, J. (2016). Python Data Science Handbook: Essential Tools for Working with Data. O’Reilly
Media, Inc.
Walliman, N. (2010). Research Methods: The Basics. Routledge.
Wexler, S., Shaffer, J., & Cotgreave, A. (2017). The Big Book of Dashboards: Visualizing Your Data Using
Real-World Business Scenarios. John Wiley & Sons.
