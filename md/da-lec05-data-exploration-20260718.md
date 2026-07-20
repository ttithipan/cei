# Data Analytics — Lec05: Data Exploration (2026)

> 📄 [View original PDF](documents/da-lec05-data-exploration-20260718.pdf) — source of truth
> ⚠️ The original lecture slides contain many images and diagrams — refer to the PDF for visual content.

Data Exploration

Asst. Prof. Dr. Rathachai Chawuthai
Department of Computer Engineering
Faculty of Engineering
King Mongkut's Institute of Technology Ladkrabang

---

## Agenda

- Data Format
- Charts
- Tools

---

> 📄 See [PDF page 5](documents/da-lec05-data-exploration-20260718.pdf#page=5) — the Data Science Process flowchart highlighting the "Exploratory Data Analysis" stage.

---

## Data Exploration

A preliminary exploration of the data to better understand its characteristics.

Key motivations of data exploration include:
- Helping to select the right tool for preprocessing or analysis
- Making use of humans' abilities to recognize patterns
- People can recognize patterns not captured by data analysis tools

Ref:
- Kumar, T S. "Introduction to Data Mining"

---

## Data Format

### Data Table — Iris Dataset

> 📄 See [PDF page 8](documents/da-lec05-data-exploration-20260718.pdf#page=8) — screenshot of the Iris dataset in a tabular data viewer (e.g., RStudio).

Ref:
- (image) https://support.rstudio.com/hc/en-us/articles/205175388-Using-the-Data-Viewer

---

### Graph Data Structure

> 📄 See [PDF page 9](documents/da-lec05-data-exploration-20260718.pdf#page=9) — example of graph data structure visualization (nodes and edges).

Ref:
- (image) http://www.bogotobogo.com/python/python_graph_data_structures.php

---

## Charts

### Histogram — Iris Sepal Width

> 📄 See [PDF page 11](documents/da-lec05-data-exploration-20260718.pdf#page=11) — histogram of Iris sepal width distribution.

Ref:
- (image) https://www.solver.com/xlminer-dataviz-app-help-and-support

---

### Boxplot — Iris Dataset

> 📄 See [PDF page 12](documents/da-lec05-data-exploration-20260718.pdf#page=12) — boxplot visualization of the Iris dataset features.

Ref:
- (image) https://www.solver.com/xlminer-dataviz-app-help-and-support

---

### Boxplot Interpretation

> 📄 See [PDF page 13](documents/da-lec05-data-exploration-20260718.pdf#page=13) — annotated boxplot explaining how to interpret quartiles, whiskers, and outliers.

Ref:
- (image) https://www.solver.com/xlminer-dataviz-app-help-and-support

---

### Histogram & Boxplot — Combined Interpretation

> 📄 See [PDF page 14](documents/da-lec05-data-exploration-20260718.pdf#page=14) — side-by-side histogram and boxplot for distribution interpretation.

Ref:
- (image) https://www.solver.com/xlminer-dataviz-app-help-and-support

---

### Boxplot — Normalization

> 📄 See [PDF page 15](documents/da-lec05-data-exploration-20260718.pdf#page=15) — boxplots before and after normalization, showing how normalization aligns distributions.

Ref:
- (image) http://telemedicina.med.muni.cz/genomic-proteomic-analysis/res/image/boxplotNormalization.png

---

### Scatter Plot — Iris Dataset

> 📄 See [PDF page 16](documents/da-lec05-data-exploration-20260718.pdf#page=16) — scatter plot of Iris data showing relationships between features.

Ref:
- (image) https://www.solver.com/xlminer-dataviz-app-help-and-support

---

### Correlation Matrix

> 📄 See [PDF page 17](documents/da-lec05-data-exploration-20260718.pdf#page=17) — correlation matrix visualization showing pairwise correlations between features.

Ref:
- (image) https://freshbiostats.wordpress.com/2013/09/04/an-example-of-principal-components-analysis/

---

### Heatmap — Iris Dataset

> 📄 See [PDF page 18](documents/da-lec05-data-exploration-20260718.pdf#page=18) — heatmap visualization of the Iris dataset.

Ref:
- (image) https://tryolabs.com/blog/2017/03/16/pandas-seaborn-a-guide-to-handle-visualize-data-elegantly/
- (image) https://www.solver.com/xlminer-dataviz-app-help-and-support

---

## Tools

### Overview

| Library | Import | URL |
|---|---|---|
| **matplotlib** | `import matplotlib.pyplot as plt` | https://matplotlib.org/ |
| **pandas plot** | `import pandas as pd` | https://pandas.pydata.org/pandas-docs/version/0.23.4/generated/pandas.DataFrame.plot.html |
| **seaborn** | `import seaborn as sns` | https://seaborn.pydata.org/ |

> 📄 See [PDF page 20](documents/da-lec05-data-exploration-20260718.pdf#page=20) — matplotlib logo and overview.

Ref:
- (image) https://wiki.openhatch.org/wiki/Matplotlib

---

### Matplotlib

Matplotlib is a Python 2D plotting library which produces publication quality figures in a variety of hardcopy formats and interactive environments across platforms.

Matplotlib can be used in Python scripts, the Python and IPython shells, the Jupyter notebook, web application servers, and four graphical user interface toolkits.

#### Advantages

- A multi-platform data visualization tool built on the numpy and scipy framework. Therefore, it's fast and efficient.
- It possesses the ability to work well with many operating systems and graphic backends.
- It possesses high-quality graphics and plots to print and view for a range of graphs such as histograms, bar charts, pie charts, scatter plots and heat maps.
- With Jupyter notebook integration, developers have been free to spend their time implementing features rather than struggling with compatibility.
- It has large community support and cross-platform support as it is an open source tool.
- It has full control over graph or plot styles such as line properties, fonts, and axis properties.

Ref:
- https://matplotlib.org
- https://www.simplilearn.com/data-visualization-in-python-using-matplotlib-tutorial

---

### Understanding the Plot

A plot is a graphical representation of data, which shows the relationship between two variables or the distribution of data.

> 📄 See [PDF page 23](documents/da-lec05-data-exploration-20260718.pdf#page=23) — annotated line plot showing title ("First Plot"), legend ("line one"), x-axis ("range"), y-axis, and grid.

- A line plot shows the random numbers on the y-axis and the range on the x-axis.
- The background of the plot is called a grid.
- The text "First Plot" denotes the title of the plot.
- The text "line one" denotes the legend.

---

### Steps to Create a Plot

1. Import the required libraries
2. Define or import the required dataset
3. Set the plot parameters
4. Display the created plot

> 📄 See [PDF page 24](documents/da-lec05-data-exploration-20260718.pdf#page=24) — code example showing these four steps.

---

### In the 3rd Step — Setting Plot Parameters

- Set the style of the plot, labels of the coordinates, titles of the plot, the legend and the linewidth.
- In this example:
  - We have used `ggplot` as the plot style.
  - The `plot` method is used to plot the graph against the random numbers.
  - In the `plot` method the character `'g'` denotes the plotline color as green.
  - The `label` denotes the legend label and is named as "line one".
  - `linewidth=2`

> 📄 See [PDF page 25](documents/da-lec05-data-exploration-20260718.pdf#page=25) — the resulting plot: green line with "First Plot" title, "range" on x-axis, "line one" legend.

---

### Creating a 2-D Plot

> 📄 See [PDF page 26](documents/da-lec05-data-exploration-20260718.pdf#page=26) — code and resulting 2-D plot visualization.

---

### Multiple Plots

> 📄 See [PDF page 27](documents/da-lec05-data-exploration-20260718.pdf#page=27) — code showing how to create multiple subplots in one figure.

---

## Pandas Plot

### Lines

```python
df = pd.DataFrame({"A": np.random.randn(10),
                   "B": np.random.randn(10)})
df.plot()
```

### Bar

```python
df = pd.DataFrame({"A": np.random.randn(10),
                   "B": np.random.randn(10)})
df.plot(kind="bar")
```

### Stacked Bar

```python
df = pd.DataFrame({"A": np.random.randn(10),
                   "B": np.random.randn(10)})
df.plot.bar(stacked=True)
```

### Histogram

```python
df = pd.DataFrame({"A": np.random.randn(1000)})
df["A"].plot.hist()
```

### Box Plot

```python
df = pd.DataFrame(np.random.rand(10, 5),
                  columns=['A', 'B', 'C', 'D', 'E'])
df.plot.box()
```

### Scattergram (Scatter Matrix)

```python
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from pandas.plotting import scatter_matrix

df = pd.DataFrame(np.random.randn(100, 4),
                  columns=['a', 'b', 'c', 'd'])
axes = scatter_matrix(df, alpha=0.5, diagonal='kde')
corr = df.corr().as_matrix()
for i, j in zip(*plt.np.triu_indices_from(axes, k=1)):
    axes[i, j].annotate("%.3f" % corr[i,j], (0.8, 0.8),
                        xycoords='axes fraction', ha='center', va='center')
plt.show()
```

Ref:
- https://matplotlib.org
- https://pandas.pydata.org/pandas-docs/stable/user_guide/visualization.html
- https://stackoverflow.com/questions/27768677/pandas-scatter-matrix-display-correlation-coefficient

---

## Seaborn

> 📄 See [PDF page 32](documents/da-lec05-data-exploration-20260718.pdf#page=32) — Seaborn library logo and overview.

Seaborn is a library for making statistical graphics in Python. It is built on top of matplotlib and closely integrated with pandas data structures.

**Key features:**

- A dataset-oriented API for examining relationships between multiple variables
- Specialized support for using categorical variables to show observations or aggregate statistics
- Options for visualizing univariate or bivariate distributions and for comparing them between subsets of data
- Automatic estimation and plotting of linear regression models for different kinds of dependent variables
- Convenient views onto the overall structure of complex datasets
- High-level abstractions for structuring multi-plot grids that let you easily build complex visualizations
- Concise control over matplotlib figure styling with several built-in themes
- Tools for choosing color palettes that faithfully reveal patterns in your data

Seaborn aims to make visualization a central part of exploring and understanding data. Its dataset-oriented plotting functions operate on dataframes and arrays containing whole datasets and internally perform the necessary semantic mapping and statistical aggregation to produce informative plots.

Ref:
- https://seaborn.pydata.org

---

### Seaborn — Heatmap

```python
import numpy as np
import pandas as pd
import seaborn as sns
%matplotlib inline

cnames = ['A', 'B', 'C', 'D']
df = pd.DataFrame(
    abs(np.random.randn(5, 4)),
    columns=cnames)
sns.heatmap(df, annot=True)
```

Ref:
- https://seaborn.pydata.org
- https://stackoverflow.com/questions/27768677/pandas-scatter-matrix-display-correlation-coefficient

---

> "Most of the world will make decisions by either guessing or using their gut. They will be either lucky or wrong."
> — Suhail Doshi

つづく
