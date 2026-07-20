# Data Analytics Textbook — Ch02: Data Collection (2026)

> 📄 [View original PDF](documents/da-textbook-ch02-data-collection-20260718.pdf) — source of truth

2. Data Collection
“With data collection, ‘the sooner the better’
is always the best answer.”
— Marissa Mayer

> 📄 See [PDF page 2](documents/da-textbook-ch02-data-collection-20260718.pdf#page=2) — Figure 2.0-1: Data collection step in the data science process
Human activity, the environment, the Earth, and the universe itself have generated enormous amounts of data
since the beginning of time. Advances in digital technology have made it far more effective to sense and record
data from the real world, marking the starting point of the data science process shown in Figure 2.0-1.
This chapter covers Internet of Things (IoT) technology, structured and unstructured data, data scales — which
play a key role in later chapters — data collection practices, and the example datasets used throughout this
book.
## 2.1 Internet of Things

The Internet of Things (IoT) is a major technological milestone (Figure 2.1-1) that lets devices capture data
and be controlled over the internet, sending measured data to a server for integration, processing, and analysis
— enabling many new innovations (Serpanos & Wolf, 2017).
IoT's key role is collecting data from sensors — temperature, humidity, light intensity, wind force, acceleration,
speed, tilt, image, sound, heart rate, pressure, and many others — directly into digital form, without a person
manually writing it down as in the past, making data integration for analysis far more efficient.

> 📄 See [PDF page 2](documents/da-textbook-ch02-data-collection-20260718.pdf#page=2) — Figure 2.1-1: General architecture of an IoT system

## 2.2 Data Types

Electronic data can be grouped into three types: structured data, unstructured data, and semi-structured data.
Structured Data
Structured data has a clear structure, so a specific part of it can be accessed directly by index — tabular data
is the classic example.
A table (or data frame) is the most popular structure, since it is easy to understand and process. It works like a
matrix: any cell is accessed by row and column index, and the table has both a row index and column headers,
as shown in Table 2.2-1, which has columns Name, Age, and Height, and three rows (0, 1, 2).
When a computer reads this data and needs Billy's age, it simply looks up row 1, column “Age,” and gets the
value 20 (years).
Table 2.2-1: Example student age and height data

| Name  | Age | Height (cm) |
|-------|-----|-------------|
| Alin  | 15  | 160         |
| Billy | 20  | 180         |
| Chao  | 25  | 175         |

Structured data is commonly saved in formats such as CSV (Comma-Separated Values), TSV (Tab-Separated
Values), JSON (JavaScript Object Notation), or XML (Extensible Markup Language).
This book focuses on CSV files, since they are plain text files that can easily be created with a text editor or
Microsoft Excel. Each row represents one record; the first row typically holds the column names, with commas
separating each field — as in the example below, representing Table 2.2-1. Because of its simplicity,
standardization, and wide compatibility with many programs, CSV is extremely popular for data analytics.
Name, Age, Height
Alin, 15, 160
Billy, 20, 180
Chao, 25, 175

Unstructured Data
Unstructured data lacks enough structure for a computer to reliably extract specific values from it. It is usually
data that humans understand directly — text, images, and sound.
Text
For example: “There are three students: Alin, Billy, and Chao. Alin is 15 years old and 160 cm tall. Billy is
twenty years old and one meter eighty tall. Chao was born a year after Billy, and is half a foot taller than Alin.”
A human can read this natural-language passage and work out each person's name, age, and height. But even
though the text exists digitally as a string of characters, it is difficult for a computer to correctly interpret it —
for instance, to extract Chao's exact age.
Image
Images (and video) are understood by humans through vision and interpretation by the brain (Figure 2.2-1) —
a person can immediately read off Billy's age and height from a photo. But to a computer, an image is simply
a matrix of pixel color values; it is hard for a computer to tell which part of the image is a person, which part
represents height, and so on.

> 📄 See [PDF page 4](documents/da-textbook-ch02-data-collection-20260718.pdf#page=4) — Figure 2.2-1: Image example of student age and height data
Sound
Sound captured from a spoken sentence, e.g., reading aloud “There are three students: Alin, Billy, and Chao…”
produces a waveform such as in Figure 2.2-2. Even though it's digital and a human can listen and understand
it, a computer likewise finds it hard to identify which part of the waveform corresponds to a name, an age, or
a height.

> 📄 See [PDF page 4](documents/da-textbook-ch02-data-collection-20260718.pdf#page=4) — Figure 2.2-2: Simulated waveform for the student age and height example
Semi-Structured Data
Semi-structured data has some structure but cannot be processed as conveniently as fully structured data, since
most of its content is still unstructured — for example, Twitter hashtags or webpage content.
For a tweet such as “Data is the new oil. #datascience #quote #humby,” the hashtags help categorize or signal
intent, but a computer still cannot easily determine what #datascience, #quote, or #humby actually mean, or
who is the source of the quote, despite the #humby hashtag.
Similarly, a webpage is structured according to HTML (Hypertext Markup Language) tags, but these tags are
still hard for a computer to interpret meaningfully, and different designers structure their pages differently with
no single standard. The following HTML file describes a Data Analytics course, yet a computer cannot tell
which part is the course title, which is the description, and which is the instructor's name:
```html
<html>
<head>
<title>Data Analytics</title>
</head>
<body>
<h1>Data Analytics</h1>
<p><strong>Course Description:</strong>
This course presents a wide range of data analytic
techniques and is structured around the broad contours
of the different types of data analytics, namely,
descriptive, predictive, and prescriptive analytics.
</p>
<p><strong>Lecturer:</strong> Rathachai Chawuthai</p>
</body>
</html>
```

For this reason, semi-structured data usually needs pre-processing to convert it into a structured form before
analysis, with the difficulty depending on the complexity of the underlying content.
Data analytics workflows generally favor converting datasets into tabular form first, since it has a clear
structure and can be processed efficiently. Still, much of the world's data remains unstructured or semi-
structured — text, images, sound, webpages — and would be extremely valuable if it could be analyzed

directly. Fortunately, ongoing advances in artificial intelligence continue to improve computers' ability to
interpret such data, and it's reasonable to expect that AI will eventually understand unstructured data on par
with the human brain.
## 2.3 Data Scales

For analytics purposes, data is grouped into four scales: nominal, ordinal, interval, and ratio (Walliman, 2010).
Understanding these scales is essential, since different analytics techniques work with different scales —
sometimes requiring a technique choice, or a scale conversion, to match the intended method.
Nominal Scale
Nominal data represents named groups or categories with no inherent order. For example:
•
Gender: male, female
•
Faculty: Engineering, Science, Information Technology
•
Blood type: A, B, O, AB
•
Appliances: TV, fan, refrigerator, computer, mobile phone
•
City: Bangkok, Tokyo, London, Suphanburi, Beijing
Such values cannot be ranked — for example, in the appliance group, we cannot say a refrigerator is “greater”
or “less” than a fan.
Ordinal Scale
Ordinal data is a step above nominal data: it represents categories that can be ranked, but the difference between
ranks cannot be quantified. For example:
•
Grade: A, B+, B, C+, C, D+, D, F
•
Shirt size: XS, S, M, L, XL
•
Survey response: strongly agree, agree, neutral, disagree, strongly disagree
•
Sentiment: positive, neutral, negative
•
Risk level: none, low, medium, high
These values can be ordered — grade A is higher than B+ — but we cannot say the gap between A and B+
equals the gap between B+ and B.
Interval Scale
Interval data is a step above ordinal data: the difference between values can be measured, but there is no true
zero — zero is just another value, not “nothing,” so ratios between values are not meaningful. For example:
•
Temperature in Celsius: …, -2, -1, 0, 1, 2, 3, 4, 5, …
•
Temperature in Fahrenheit: …, -2, -1, 0, 1, 2, 3, 4, 5, …
•
pH value: 1, 2, 3, …, 14
•
Calendar dates: 2021-06-11, 2021-06-14, 2021-10-15, …
We can say 20°C is 5 degrees more than 15°C, but we cannot say 0°C means “no heat,” nor use 0°C as the
same reference point as 0°F, nor say 20°C is “twice as hot” as 10°C.
Ratio Scale
Ratio data is the highest level, one step above interval data, with a true zero — meaning zero genuinely
represents “none,” providing a valid reference point across the scale, so ratios between values are meaningful.
Examples include height, weight, age, monetary amount, and distance.
Because of this true zero, a distance of 0 km genuinely means “no distance,” and we can correctly say that 100
km is 10 times farther than 10 km.

## 2.4 Data Collection

Collecting data is another core task of the analytics team, since acquiring data is the essential first step of the
whole process (see Figures 1.2-1 and 2.0-1): everything starts from data, followed by analysis, decision-
making, and finally action. The team must therefore understand how data is obtained from different sources
and the problems that can arise during collection.
Data Sources
In statistics, data sources are grouped into primary data and secondary data:
•
Primary Data — raw data collected directly by the analytics team from its original source (Walliman,
2010): direct surveys, self-run experiments, direct interviews, or direct sensor readings. Its advantage
is accuracy and exact fit to the team's needs, at the cost of extra time and expense to acquire.
•
Secondary Data — data the analytics team did not collect itself, but obtained from another source —
an organization or individual that already gathered it, whether as raw data or pre-summarized results
(Walliman, 2010): sensor data, government statistics, private-sector data, research institutes,
researchers, books, or journals. Its advantages and disadvantages mirror those of primary data: it is
available with little or no time and cost, but it may not fully match the analytics team's actual needs,
since the team wasn't the one who framed the original data-collection goal.
For example, consider a company running a social-network application where many users post, comment, like,
and share content, generating large volumes of data. This is primary data for the company; if that data (raw or
summarized) is then sold or distributed to other organizations, it becomes secondary data for them.
For readers starting out in data analytics, building a primary dataset from scratch is usually impractical due to
the time and cost involved, so secondary data is recommended for learning purposes. This book provides ready-
to-use example datasets, described in the next section — some compiled by the author as primary data, and
some drawn from popular external secondary sources. Readers can also find additional secondary data from
open-data sources, which are freely accessible over the internet in a usable format, such as:
•
Kaggle (https://www.kaggle.com) — a very popular hub of well-organized datasets for analytics,
complete with example problems and community discussions of analysis approaches.
•
Open government data portals from various countries, e.g., Thailand (https://data.go.th), the United
States
(https://www.data.gov),
the
United
Kingdom
(https://data.gov.uk),
and
Japan
(https://www.data.go.jp).
•
DBpedia (https://www.dbpedia.org) — a large Linked Open Data repository built from Wikipedia
content, structured as a knowledge graph. As of 2021, DBpedia links over 4 million entities, covering
places, people, works, species, organizations, and more, accessible via the SPARQL query language;
readers interested in using it effectively should study the Semantic Web and SPARQL further (Heath
& Bizer, 2011).
Challenges in Data Collection
Data collection in practice is rarely straightforward. Analytics teams commonly face problems arising from
the variety of data sources, structures, and recording practices (Igual & Segui, 2017), including:
•
Different file formats — e.g., Excel, CSV, JSON, or relational databases — requiring the team to
consolidate these into one ready-to-use format, typically a table or data frame.
•
Missing data — arising from data simply not existing, not yet being known, not yet being recorded,
or recording-device failure — producing null/NA values that can break analysis code; these must be
handled, whether by removing or imputing values, without distorting the results.
•
Different schemas — e.g., one dataset uses the column name “Name” while another uses “Fullname”
for the same meaning, requiring renaming before the datasets can be merged; or one dataset stores
full name in one column while another splits it into separate columns, requiring a consistent approach
to be chosen.
•
Different data formats — e.g., inconsistent date orderings (year-month-day, year/month/day,
day/month/year, month/day/year), inconsistent month representation (numeric or abbreviated), or 2-
digit vs. 4-digit years, requiring standardization, ideally to an international format.

•
Different units — e.g., weight (kg, g, lb), currency (baht, yen, euro, USD), speed (mph, km/h),
temperature (Celsius, Fahrenheit, Kelvin), or calendar year (Buddhist era, Common era) —
requiring the team to choose and standardize on a suitable unit.
•
Different frequencies — especially for time-series data, e.g., one sensor logs every minute while
another logs hourly.
•
Incorrect data — from recording errors or outdated records, e.g., a country's capital city that has
since changed, or a customer's outdated address.
Because these challenges vary depending on how the source system (or the staff responsible for it) records
data, the analytics team must recognize them, diagnose the underlying issue, and plan the initial data-
processing steps needed — the subject of the next chapter.
## 2.5 Example Datasets Used in This Book

The example datasets used throughout this book are hosted at https://github.com/Rathachai/DA-LAB. Each is
described below.
Employee Sample Dataset
A simulated employee dataset for a fictitious company.
Access
https://rathachai.github.io/DA-LAB/datasets/simple-employee-db.csv
Description
Table 2.5-1: Employee dataset description
Column
Description
Data Scale
eid
Employee ID
(identifier)
name
Employee name
Nominal
gender
Gender
Nominal
department
Department
Nominal
age
Age (years)
Ratio
salary
Salary (baht)
Ratio
working_years
Years of service
Ratio
birth_place
Province of birth
Nominal

Sample Data

> 📄 See [PDF page 8](documents/da-textbook-ch02-data-collection-20260718.pdf#page=8) — Table 2.5-2: Employee data sample

Simple Vehicle Classification Dataset
A simulated dataset for a simple classification task: car vs. non-car.
Access
https://rathachai.github.io/DA-LAB/datasets/simple-veh-class.csv
Description
Table 2.5-3: Vehicle classification dataset description
Column
Description
Data Scale
vid
Vehicle ID
(identifier)
weight_kg
Vehicle weight (kg)
Ratio
height_m
Vehicle height (m)
Ratio
n_wheels
Number of wheels
Ratio
vtype
Vehicle type: car or other
Nominal

Sample Data

> 📄 See [PDF page 10](documents/da-textbook-ch02-data-collection-20260718.pdf#page=10) — Table 2.5-4: Vehicle classification data sample

Flu Diagnosis Dataset
Laboratory-confirmed flu diagnosis results together with recorded symptoms — body temperature, headache,
and nausea — for use in learning basic patient-screening models (Grzymala-Busse, 2004).
Access
https://rathachai.github.io/DA-LAB/datasets/flu-test.csv
Description
Table 2.5-5: Flu diagnosis dataset description
Column
Description
Data Scale
case
Case number
(identifier)
temp
Body temperature range
Ordinal
headache
Whether headache present
Nominal

Column
Description
Data Scale
nausea
Whether nausea present
Nominal
is_flu
Lab-confirmed flu diagnosis
Nominal

Sample Data

> 📄 See [PDF page 11](documents/da-textbook-ch02-data-collection-20260718.pdf#page=11) — Table 2.5-6: Flu diagnosis data sample

Boston Housing Price Dataset
Housing prices in Boston (target variable medv), with 13 predictor variables (Harrison & Rubinfeld, 1978).
This is a widely used dataset for learning regression analysis.
Access
https://rathachai.github.io/DA-LAB/datasets/boston.csv
Description
Table 2.5-7: Boston housing dataset description
Column
Description
Data Scale
crim
Per-capita crime rate by town
Ratio
zn
Proportion of residential land zoned for large lots
Ratio
indus
Proportion of non-retail business acres per town
Ratio
chas
Charles River dummy variable (1 = borders river, 0 = otherwise)
Nominal (encoded)
nox
Nitrogen oxide concentration (parts per 10 million)
Ratio
rm
Average number of rooms per dwelling
Ratio
age
Proportion of owner-occupied units built before 1940
Ratio
dis
Weighted distance to employment centers
Ratio
rad
Index of accessibility to radial highways
Ratio
tax
Property tax rate per $10,000
Ratio
ptratio
Pupil-teacher ratio by town
Ratio
black
Proportion of Black residents by town
Ratio
lstat
Percentage of lower-status population
Ratio
medv
Median home value (in $1,000s)
Ratio

Sample Data

> 📄 See [PDF page 12](documents/da-textbook-ch02-data-collection-20260718.pdf#page=12) — Table 2.5-8: Boston housing data sample

## 2.6 Chapter Summary

Data collection is the very first step in turning real-world phenomena into digital data ready for use, and
Internet of Things technology has made sensing and recording data far more efficient. Data can be structured,
such as tables (especially CSV files), or unstructured, such as images, text, and sound — the latter requiring
AI-based pre-processing to become structured before analysis. This chapter also covered how data is collected
and introduced the example tabular datasets used in later chapters. Importantly, it introduced four data scales
— nominal, ordinal, interval, and ratio — which form the foundation for understanding data throughout the
rest of the book.
## 2.7 Review Questions

1. Write a CSV file from the flu diagnosis data in Table 2.5-6.
2. Explain whether values within the same column can be of different data types.
3. Explain why unstructured data cannot be analyzed directly without pre-processing.
4. Research how humans collected data before Internet of Things technology existed.
5. Explain whether scanning a printed page of Table 2.5-6 from this book into a computer would
produce structured data, and why.
6. Using the supplementary exercises at https://github.com/Rathachai/DA-LAB/tree/gh-
pages/exercises, write a description for each of the following datasets: (a) Titanic survivors, (b)
mushroom classification, (c) drug classification, (d) mall customer behavior, (e) movie ratings.
## 2.8 References

Grzymala-Busse, J. W. (2004). Data with Missing Attribute Values: Generalization of Indiscernibility Relation
and Rule Induction. In Transactions on Rough Sets I (pp. 78–95). Springer, Berlin, Heidelberg.
Harrison Jr, D., & Rubinfeld, D. L. (1978). Hedonic Housing Prices and the Demand for Clean Air. Journal of
Environmental Economics and Management, 5(1), 81–102.
Heath, T., & Bizer, C. (2011). Linked Data: Evolving the Web into a Global Data Space. Synthesis Lectures
on the Semantic Web: Theory and Technology, 1(1), 1–136.
Igual, L., & Seguí, S. (2017). Introduction to Data Science. Springer, Cham.
James, G., Witten, D., Hastie, T., & Tibshirani, R. (2013). An Introduction to Statistical Learning: With
Applications in R (Vol. 112). Springer.
O’Neil, C., & Schutt, R. (2013). Doing Data Science: Straight Talk from the Frontline. O’Reilly Media, Inc.
Provost, F., & Fawcett, T. (2013). Data Science for Business: What You Need to Know about Data Mining
and Data-Analytic Thinking. O’Reilly Media, Inc.
Serpanos, D., & Wolf, M. (2017). Internet-of-Things (IoT) Systems: Architectures, Algorithms,
Methodologies. Springer.
Walliman, N. (2010). Research Methods: The Basics. Routledge.
