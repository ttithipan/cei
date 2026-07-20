# Data Analytics — Lec01: Introduction to Data Analytics (2026)

> 📄 [View original PDF](documents/da-lec01-introduction-20260718.pdf) — source of truth
> ⚠️ The original lecture slides contain many images and diagrams — refer to the PDF for visual content.

Introduction to the Data Analytics Course

Rathachai Chawuthai
Department of Computer Engineering
Faculty of Engineering
King Mongkut's Institute of Technology Ladkrabang

---

## Agenda

- About this Course
- Data Analytics

---

## About this Course

### Course Outline

- Introduction
- Basic Statistic for Data Analysis
- Data Manipulation using Python
- Data Exploration
- Data Processing
- Regression Analysis
- Classification Analysis
- Cluster Analysis
- Social Network Analysis
- Recommender System
- Visualization

### Textbook

**หนังสือ การวิเคราะห์ข้อมูล (Data Analytics)**

- ผู้แต่ง : Rathachai Chawuthai
- ปี : 2022
- จำนวนหน้า : 332
- อ้างอิง : รัฐชัย ชาวอุทัย (2565). การวิเคราะห์ข้อมูล: งานเทคโนโลยีการศึกษา คณะวิศวกรรมศาสตร์ สจล.

### E-Learning

[Python for Data Science and Machine Learning Bootcamp](https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/)

### Tools

- **Anaconda**
  - Language: Python
  - Packages: NumPy, SciPy, Pandas, Scikit-learn, etc.
  - Download: [https://www.anaconda.com/download/](https://www.anaconda.com/download/)
- **Editors**: Spyder, Jupyter, Colab

---

## Data Analytics

### Sample Questions

- How much is the price of 1 acre of land in this area?
- How to commute from here to Icon Siam at 8:00?
- Will this be a flu or not?
- If the customer has already bought this item, which products should be recommended next?
- Where should the gas station be opened?

> 📄 See [PDF page 11](documents/da-lec01-introduction-20260718.pdf#page=11) — slides showing the Data Analytics process diagram: Data → Analytics → Human Input → Decision → Action.

Ref:
- (image) https://sensanalytics.com/executive-master-classes/introduction-data-science/
- Mathematics
- Business
- Programming

---

### Types of Analytics

> 📄 See [PDF page 13](documents/da-lec01-introduction-20260718.pdf#page=13) — Gartner's four types of analytics capability diagram (Value and Difficulty scale).

Ref:
- Four types of analytics capability (Gartner, 2014)
- (image) https://www.healthcatalyst.com/closed-loop-analytics-method-healthcare-data-insights

#### Descriptive Analytics

Descriptive analytics is the interpretation of historical data to better understand changes that have occurred in a business. Descriptive analytics describes the use of a range of historic data to draw comparisons.

Ref:
- (content) https://www.investopedia.com/terms/d/descriptive-analytics.asp
- (image) https://www.freepik.com/free-photos-vectors/chart

**Questions:**
- Which are the best-seller products?
- Which are the most or least revenue-generating products?
- Which are the most successful promotional campaigns?
- Who are the most paying customers?
- What are revenue trends for each Strategic Business Unit (SBU) of last N years, last N months?

Ref:
- https://www.chulamoocachieve.com/pathway/data-science

**Techniques:**
- Exploratory Data Analysis
- Measure of the Shape of the Distribution
- Measure of Data Summary
- Measure of Variability or Dispersion
- Standard Deviation, Interquartile Range, Range
- Measure of Central Tendency
- Mean, Median, Mode, Min, Max

Ref:
- https://www.chulamoocachieve.com/pathway/data-science

#### Predictive Analytics

Predictive analytics is the practice of extracting information from existing data sets in order to determine patterns and predict future outcomes and trends. Predictive analytics does not tell you what will happen in the future.

Ref:
- (content) https://www.webopedia.com/TERM/P/predictive_analytics.html
- (image) https://socioboard.org/blog/prediction-instagram-mobile-ad-sales-to-surpass-2-81-billion-in-2017/

**Questions:**
- What is going to be likely revenue for each SBU in coming year?
- What is going to be likely attrition rate for the common year?
- Who all customers are likely to churn-out?
- Which promotional campaigns are likely to do well?
- Which products are likely to sell most in the next 6 months?

Ref:
- https://www.chulamoocachieve.com/pathway/data-science

**Techniques:**
- Regression
  - Linear Regression
- Classification
  - Decision Tree
  - Logistic Regression
  - Support Vector Machine
  - Artificial Neural Network
  - etc.

#### Prescriptive Analytics

Prescriptive analytics is a type of data analytics — the use of technology to help businesses make better decisions through the analysis of raw data. Specifically, prescriptive analytics factors information about possible situations or scenarios, available resources, past performance, and current performance, and suggests a course of action or strategy. It can be used to make decisions on any time horizon, from immediate to long term.

Ref:
- https://www.investopedia.com/terms/d/descriptive-analytics.asp
- (image) https://www.diytradenews.co.za/digital-dynamism-a-new-dawn-for-retailers/

**Questions:**
- What would be the best channel to sell this product?
- Which of the supplier suggested promotions to adopt?
- What new or replacement items to introduce, and when?
- How to modify the overall product assortment for each category?
- What's the next promotion that I can offer to this customer segment?
- What is the best route from point A to B?

Ref:
- https://www.chulamoocachieve.com/pathway/data-science

**Techniques:**
- Decision Support System
- Recommender System
- Search Engine
- Route and Direction Recommendation
- Chatbot

Ref:
- https://www.chulamoocachieve.com/pathway/data-science

---

### Quiz: Which Analytics Type?

For each question below, identify whether it calls for Descriptive, Predictive, or Prescriptive analytics:

- What was the popular product last month?
- What is the average revenue of this product?
- What will be the revenue of the next quarter?
- Which products should be promoted next month?
- Which products should be stopped selling?
- Which place should we promote this product?
- Which products will we recommend to our customers?
- Will the customers cancel their orders?

Ref:
- https://www.chulamoocachieve.com/pathway/data-science

---

### When You Have a Question!

> 📄 See [PDF page 19](documents/da-lec01-introduction-20260718.pdf#page=19) — diagram showing the thought process for formulating data questions.

Ref:
- (image) URL

---

### Example: A Small Dataset

Consider this medical dataset for flu diagnosis:

| Body Temperature | Headache | Nausea | Flu? |
|---|---|---|---|
| high | yes | - | yes |
| very high | yes | yes | yes |
| normal | - | - | - |
| high | yes | yes | yes |
| high | - | yes | - |
| normal | yes | - | - |
| normal | - | yes | - |
| normal | yes | yes | ? |

> 📄 See [PDF page 21](documents/da-lec01-introduction-20260718.pdf#page=21) — visual examples illustrating how different attributes (Temperature, Headache, Nausea) relate to the flu diagnosis.

---

### In This Age

- Much Data → High Accuracy
- Much Data → Headache
- **(Then, let's use Computers)**

---

## Data Science

Data science, also known as data-driven science, is an interdisciplinary field about scientific methods, processes and systems to extract knowledge or insights from data in various forms, either structured or unstructured, similar to Knowledge Discovery in Databases.

Ref:
- (content) https://en.wikipedia.org/wiki/Data_science

---

### Data Science Process

> 📄 See [PDF page 24](documents/da-lec01-introduction-20260718.pdf#page=24) — the complete Data Science Process flowchart: Reality → Raw Data → Collected → Data is Processed → Clean Dataset → Exploratory Data Analysis → Model & Algorithms → Communicate, Visualize, & Report → Data Product → Decision Making.

---

### Data Science in Action (Examples)

> 📄 See [PDF page 25](documents/da-lec01-introduction-20260718.pdf#page=25) — examples of data science applications: Weather Forecast (Google), Amazon recommendations, YouTube recommendations, Gmail spam filter, Google Maps route planning.

---

### Data is Processed

- **Merge Data Sets** into the same format
- **Rebuild Missing Data** with appropriate values
- **Standardize** — e.g., same column name
- **Normalize** — e.g., same date format
- **De-Duplicated**
- **Verify & Enrich** — e.g., update the salary values

> 📄 See [PDF page 27](documents/da-lec01-introduction-20260718.pdf#page=27) — diagram: Raw Data Collected → Machine-Readable Format.

---

### Clean Dataset

- Good Format
- Good Shape
- Ready for Data Analysis

---

### Exploratory Data Analysis

> 📄 See [PDF page 29](documents/da-lec01-introduction-20260718.pdf#page=29) — example charts: Box Plot (ความเร็วในการบอกชื่อสีที่เห็นระหว่างผู้หญิงกับผู้ชาย), Histogram (คะแนนสอบกับจำนวนผู้ที่ได้คะแนน), Scatter Plot (ดูความสัมพันธ์).

---

### Model & Algorithms

- **Algorithm**: a process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.
- **Model**: a computation or formula formed as a result of an algorithm that takes some values as input and produces some value as output.
- **Example**:
  - Model: Decision Tree with structure
  - Algorithm: A process to build an accurate decision tree

> 📄 See [PDF page 31](documents/da-lec01-introduction-20260718.pdf#page=31) — overview diagram of models and algorithms: Supervised Learning (Classification & Regression) vs Unsupervised Learning (Clustering & Association Rule), including Decision Tree, Naïve Bayes, Linear Regression, SVM, K-Means, Apriori, Community Structure, Neural Network.

---

### Communicate, Visualize, & Report

> 📄 See [PDF page 32](documents/da-lec01-introduction-20260718.pdf#page=32) — slide on data communication and visualization.

---

### Data Product

A product that is mainly produced by data analytics:

- **Amazon**: Recommendation Engine for recommending next products
- **Netflix**: Recommendation Engine for recommending next movies
- **Gmail**: Spam filter for identifying junk emails
- **Self-Driving Car**: Drive to the destination by understanding traffic signs and traffic conditions in realtime.

---

### One Last Thing

> 📄 See [PDF page 34](documents/da-lec01-introduction-20260718.pdf#page=34) — Domain/Business context reminder and closing slide.

> "The goal is to turn data into information, and information into insight."
> — Carly Fiorina

つづく
