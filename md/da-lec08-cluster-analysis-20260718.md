# Data Analytics — Lec08: Cluster Analysis (2026)

> 📄 [View original PDF](documents/da-lec08-cluster-analysis-20260718.pdf) — source of truth
> ⚠️ The original lecture slides contain many images and diagrams — refer to the PDF for visual content.

Instructor: Asst. Prof. Dr. Rathachai Chawuthai
Department of Computer Engineering, Faculty of Engineering
King Mongkut's Institute of Technology Ladkrabang

---

## Agenda

- Clustering
- K-Means
- Cluster Validation
- Dimensionality Reduction

---

## Data Science Process Recap

Reality → Raw Data Collected → Data is Processed → Clean Dataset → Exploratory Data Analysis → Model & Algorithms → Communicate, Visualize, & Report → Data Product → Decision Making.

### Machine Learning Types

- **Supervised Learning** (develop model based on both input and output):
  - Regression: Linear Regression, Polynomial Regression, …
  - Classification: Decision Tree, Logistic Regression, Neural Network, …
- **Unsupervised Learning** (develop model based on input only):
  - Clustering: K-Means, DBSCAN, …

---

## Clustering

### What is Clustering?

A grouping of objects such that objects in a group (cluster) are similar (or related) to one another and different from (or unrelated to) the objects in other groups.

- **Intra-cluster distances** are minimized
- **Inter-cluster distances** are maximized

> 📄 See [PDF page 6](documents/da-lec08-cluster-analysis-20260718.pdf#page=6) — Intra-cluster vs. inter-cluster distance diagram.

### How Many Clusters?

The notion of a cluster can be ambiguous — the same data can be viewed as 2, 4, or 6 clusters depending on perspective.

> 📄 See [PDF page 7](documents/da-lec08-cluster-analysis-20260718.pdf#page=7) — Diagrams showing the same data with 2, 4, and 6 clusters.

### Types of Clusterings

- **Partitional Clustering**: A division of data objects into subsets (clusters) such that each data object is in exactly one subset.
- **Hierarchical Clustering**: A set of nested clusters organized as a hierarchical tree.

> 📄 See [PDF page 9](documents/da-lec08-cluster-analysis-20260718.pdf#page=9) — Partitional clustering diagram (original points vs. partitioned result).

> 📄 See [PDF page 10](documents/da-lec08-cluster-analysis-20260718.pdf#page=10) — Hierarchical clustering diagram with dendrogram.

### Other Types of Clustering

- **Exclusive (non-overlapping)** vs. **Non-exclusive (overlapping)**: In non-exclusive clusterings, points may belong to multiple clusters (e.g., border points).
- **Fuzzy (soft)** vs. **Non-fuzzy (hard)**: In fuzzy clustering, a point belongs to every cluster with some weight between 0 and 1; weights usually sum to 1.
- **Partial** vs. **Complete**: In some cases, we only want to cluster some of the data.

### Types of Clusters

#### Well-Separated Clusters

A cluster is a set of points such that any point in a cluster is closer (or more similar) to every other point in the cluster than to any point not in the cluster.

> 📄 See [PDF page 12](documents/da-lec08-cluster-analysis-20260718.pdf#page=12) — 3 well-separated clusters diagram.

#### Center-Based Clusters

A cluster is a set of objects such that an object in a cluster is closer (more similar) to the "center" of a cluster than to the center of any other cluster. The center is often a **centroid** (minimizer of distances) or a **medoid** (most representative point).

> 📄 See [PDF page 13](documents/da-lec08-cluster-analysis-20260718.pdf#page=13) — 4 center-based clusters diagram.

#### Density-Based Clusters

A cluster is a dense region of points separated by low-density regions from other regions of high density. Used when clusters are irregular or intertwined, and when noise and outliers are present.

> 📄 See [PDF page 14](documents/da-lec08-cluster-analysis-20260718.pdf#page=14) — 6 density-based clusters diagram.

### Clustering Algorithms

- **K-Means** (focus of this lecture)
- Hierarchical clustering
- PAM, CLARANS: Solutions for the k-medoids problem
- BIRCH: Constructs a hierarchical tree that acts as a summary of the data, then clusters the leaves
- MST: Clustering using Minimum Spanning Tree
- ROCK: Clustering categorical data by neighbor and link analysis
- LIMBO, COOLCAT: Clustering categorical data using information theoretic tools
- CURE: Hierarchical algorithm using different cluster representation
- CHAMELEON: Hierarchical algorithm using closeness and interconnectivity for merging

---

## K-Means

### K-Means Clustering

- **Partitional clustering approach**
- Each cluster is associated with a **centroid** (center point)
- Each point is assigned to the cluster with the **closest centroid**
- Number of clusters, **K**, must be specified
- The objective is to **minimize the sum of distances** of points to their respective centroid

### Mathematical Formulation

Given a set X of n points in a d-dimensional space and an integer K, group the points into K clusters C = {C₁, C₂, …, Cₖ} such that:

```
Cost(C) = Σᵢ₌₁ₖ Σₓ∈Cᵢ dist(x, cᵢ)
```

is minimized, where cᵢ is the centroid of the points in cluster Cᵢ.

### K-Means Algorithm (Lloyd's Algorithm)

1. Initial centroids are often chosen **randomly**
2. Clusters produced vary from one run to another

> 📄 See [PDF page 20](documents/da-lec08-cluster-analysis-20260718.pdf#page=20) — K-means steps visualization.

### K-Means: Example Steps (1 Feature)

Data points: 0, 2, 3, 7, 9 with initial centroids A (random) and B (random).

> 📄 See [PDF pages 21–34](documents/da-lec08-cluster-analysis-20260718.pdf#page=21) — K-means step-by-step convergence diagram with 1 feature.

**Iteration Summary:**

- **Round 0**: Initial centroids A (random), B (random) — assign each point to nearest centroid
- **Round 1**: New Center A = (0+2)/2 = 1.0, New Center B = (3+7+9)/3 = 6.3
- **Round 2**: New Center A = (0+2+3)/3 = 1.7, New Center B = (7+9)/2 = 8.0
- **Round 3**: Centroids unchanged → convergence

### K-Means: Example (2 Features)

> 📄 See [PDF page 35](documents/da-lec08-cluster-analysis-20260718.pdf#page=35) — K-means example with 2 features diagram.

### K-Means: Example (3 Features)

Iterations 1–6 showing convergence of cluster assignments in 2D projected view.

> 📄 See [PDF pages 36–38](documents/da-lec08-cluster-analysis-20260718.pdf#page=36) — K-means iterations 1–6 with scatter plots.

### Importance of Choosing Initial Centroids

Different random initializations can lead to different final clusterings.

> 📄 See [PDF page 39](documents/da-lec08-cluster-analysis-20260718.pdf#page=39) — Two different initial centroid choices (A and B) producing different results.

### Dealing with Initialization

- Do multiple runs and select the clustering with the smallest error
- Select original points by methods other than random (e.g., pick the most distant points from each other as cluster centers)

### Limitations of K-Means

K-means has problems when clusters have:

- **Differing Sizes**
- **Differing Densities**
- **Non-globular Shapes**
- **Outliers**

> 📄 See [PDF page 41](documents/da-lec08-cluster-analysis-20260718.pdf#page=41) — K-means limitation: differing sizes.

> 📄 See [PDF page 42](documents/da-lec08-cluster-analysis-20260718.pdf#page=42) — K-means limitation: differing density.

> 📄 See [PDF page 43](documents/da-lec08-cluster-analysis-20260718.pdf#page=43) — K-means limitation: non-globular shapes.

### Overcoming Limitations

One solution is to use **many clusters** — find parts of clusters, then put them together.

> 📄 See [PDF pages 44–46](documents/da-lec08-cluster-analysis-20260718.pdf#page=44) — Overcoming K-means limitations with many clusters.

### Variations

- **K-medoids**: Similar to K-means, but the centroid is defined to be one of the points in the cluster (the medoid).
- **K-centers**: Similar to K-means, but the goal is to minimize the maximum diameter of the clusters (diameter = maximum distance between any two points in the cluster).

### Python (scikit-learn)

```python
from sklearn.cluster import KMeans
```

Ref: http://scikit-learn.org/stable/modules/generated/sklearn.cluster.KMeans.html

---

## DBSCAN: Density-Based Clustering

### Overview

DBSCAN partitions points into dense regions separated by not-so-dense regions.

- **Density at point p**: number of points within a circle of radius **Eps** (epsilon)
- **Dense Region**: A circle of radius Eps that contains at least **MinPts** points

### Characterization of Points

- **Core Point**: Has more than MinPts points within Eps — belongs to a dense region (interior of a cluster)
- **Border Point**: Has fewer than MinPts within Eps, but is in the neighborhood of a core point
- **Noise Point**: Not a core point or a border point

> 📄 See [PDF page 53](documents/da-lec08-cluster-analysis-20260718.pdf#page=53) — DBSCAN: Core, Border, and Noise points diagram (original points with Eps=10, MinPts=4).

### Density-Connected Points

- **Density edge**: An edge between two core points q and p if they are within distance Eps.
- **Density-connected**: A point p is density-connected to a point q if there is a path of edges from p to q.

> 📄 See [PDF page 54](documents/da-lec08-cluster-analysis-20260718.pdf#page=54) — Density-connected points diagram.

### DBSCAN Algorithm

1. Label points as core, border, and noise
2. Eliminate noise points
3. For every core point p not yet assigned to a cluster:
   - Create a new cluster with point p and all points density-connected to p
4. Assign border points to the cluster of the closest core point

> 📄 See [PDF page 56](documents/da-lec08-cluster-analysis-20260718.pdf#page=56) — DBSCAN clustering result diagram.

### When DBSCAN Works Well

- Resistant to noise
- Can handle clusters of different shapes and sizes

---

## Cluster Validation

### Different Aspects

1. **Determining clustering tendency**: Distinguishing whether non-random structure actually exists in the data
2. **External validation**: Comparing clustering results to externally known class labels
3. **Internal validation**: Evaluating how well the clustering fits the data without external reference
4. **Comparing clusterings**: Determining which of two different cluster analyses is better
5. **Determining the correct number of clusters**

### Measures of Cluster Validity

- **External Index**: Measures how well cluster labels match externally supplied class labels (e.g., Entropy)
- **Internal Index**: Measures goodness of clustering structure without external information (e.g., Sum of Squared Error — SSE)
- **Relative Index**: Compares two different clusterings or clusters (often using external or internal indices like SSE or entropy)

### Measuring Cluster Validity via Correlation

Two matrices are compared:
- **Proximity Matrix** — distances between points
- **Ideal Similarity Matrix** — one row/column per data point; entry is 1 if the pair belongs to the same cluster, 0 otherwise

Compute the correlation between the two matrices (only n(n−1)/2 entries needed since matrices are symmetric). High correlation = points in the same cluster are close to each other.

> 📄 See [PDF page 61](documents/da-lec08-cluster-analysis-20260718.pdf#page=61) — Correlation of ideal similarity and proximity matrices for two datasets (Corr = −0.9235 vs. −0.5810).

### Using Similarity Matrix for Cluster Validation

Order the similarity matrix with respect to cluster labels and inspect visually.

> 📄 See [PDF pages 62–64](documents/da-lec08-cluster-analysis-20260718.pdf#page=62) — Similarity matrix visualizations for K-means and DBSCAN clusterings.

---

## Dimensionality Reduction

### The Curse of Dimensionality

Real data usually have thousands or millions of dimensions:
- Web documents: vocabulary of words as dimensions
- Facebook graph: number of users as dimensions

Problems:
- Data becomes very sparse; some algorithms become meaningless (e.g., density-based clustering)
- Algorithm complexity depends on dimensionality and becomes infeasible

### Dimensionality Reduction

Usually data can be described with fewer dimensions without losing much meaning. Dimensionality reduction:
- Assumes some data is noise, and we can approximate the useful part with lower dimensional space
- Does not just reduce data amount — it often brings out the useful part

### Latent Factor Model

- Rows (columns) are linear combinations of k latent factors
- Some noise added to the rank-k matrix results in higher rank
- **SVD** (Singular Value Decomposition) retrieves the latent factors

### SVD (Singular Value Decomposition)

> 📄 See [PDF page 69](documents/da-lec08-cluster-analysis-20260718.pdf#page=69) — SVD matrix decomposition diagram.

Ref: https://dsc-spidal.github.io/harp/docs/harpdaal/svd/

### Dimensionality Reduction of the Iris Dataset

> 📄 See [PDF page 71](documents/da-lec08-cluster-analysis-20260718.pdf#page=71) — Plot of dimensionality reduction applied to the Iris Dataset.

### Python (PCA)

```python
from sklearn.decomposition import PCA
```

Ref: http://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html

---

> "Thanks to big data, machines can now be programmed to the next thing right. But only humans can do the next right thing." — Dov Seidman
