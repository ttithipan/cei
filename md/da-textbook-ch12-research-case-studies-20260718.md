# Data Analytics Textbook — Ch12: Research Case Studies (2026)

> 📄 [View original PDF](documents/da-textbook-ch12-research-case-studies-20260718.pdf) — source of truth

12. Research Case Studies
"Without data you're just
another person with an opinion."
— W. Edwards Deming

Having learned data analytics through the data science process, this chapter presents case studies from the
author's own research on data analytics, published in international conferences and journals.

## 12.1 Detecting Road Damage with a Gyro Sensor

Drawn from "Monitoring Roadway Lights and Pavement Defects for Nighttime Street Safety Assessment by
Sensor Data Analysis and Visualization," published in Sensors and Materials, Vol. 30, No. 10 (2018), special
issue on Sensors and Materials for Cyber-Physical Applications, MYU K.K., Japan (Chawuthai, 2018).

**Research Problem**

This research aimed to build a model detecting road damage using a gyro sensor mounted on a moving vehicle,
distinguishing potholes and bumps in the road surface from speed bumps — a classification analysis problem.

**Data**

An IoT device was built with a Raspberry Pi connected to a gyro sensor and an accelerometer. The gyro sensor
measured rotation on the x, y, and z axes (gX, gY, gZ), and the accelerometer measured acceleration on 3 axes
(aX, aY, aZ). Driving around to collect data, sensor readings — along with timestamp (ts) and GPS coordinates
(lat, lon) — were sent to a Firebase cloud database every 500 milliseconds. Each point was labeled as normal
road or speed bump (defect=0) or damaged road (defect=1), as in Table 12.1-1, totaling 20,000 rows.

> 📄 See [PDF page 2](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=2) — Table 12.1-1: Example sensor data for road-damage detection

**Data Analysis**

This classification problem uses aX, aY, aZ, gX, gY, and gZ as features to predict defect, testing:

- Logistic Regression
- Decision Tree, using the GINI Coefficient as the split-quality measure
- Artificial Neural Network, with 1 hidden layer of 10 nodes, logistic activation, max 5,000 training iterations, stopping tolerance 0.0001, and learning rate 0.001

Analysis used all sensors together, then the gyro and accelerometer sensors separately, evaluated via 4-Fold
Cross-Validation with F1 (F-Measure).

**Results**

Table 12.1-2 shows Decision Tree gave the best-performing model, using only the gyro sensor — meaning
road-damage detection can rely solely on the gyro sensor's x, y, z rotation data. The resulting model was also
tested in the field, successfully mapping detected damage locations (Figure 12.1-1).

**Table 12.1-2: F1 results for road-damage detection**

| Technique | aX,aY,aZ,gX,gY,gZ | aX,aY,aZ | gX,gY,gZ |
|-----------|-------------------|----------|----------|
| Logistic Regression | 0.716 | 0.527 | 0.741 |
| Decision Tree | 0.821 | 0.630 | 0.918 (best) |
| Artificial Neural Network | 0.763 | 0.452 | 0.872 |

> 📄 See [PDF page 3](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=3) — Figure 12.1-1: Road-damage locations detected by the developed Decision Tree model

## 12.2 Detecting Kicks with a Microwave Sensor

Drawn from "The Analysis of a Microwave Sensor Signal for Detecting a Kick Gesture," presented at the
International Conference on Engineering, Applied Sciences, and Technology (ICEAST), published by IEEE,
2018 (Chawuthai & Sakdanuphab, 2018).

**Research Problem**

This research built a device to detect a kicking gesture, to open a car's trunk hands-free when the user's hands
are full. It used a microwave sensor emitting waves that reflect off objects back to a receiver, computing object
speed via the Doppler Effect. Volunteers' activities — walking by, kicking, or other objects passing — were
recorded and their signals examined, then processed for classification analysis with two outcomes: kick or not
kick.

**Data**

Signals were recorded across 3 activity types: kicking, walking, and something passing. Exploring the data
revealed clearly distinguishable signal shapes (Figure 12.2-1), suitable for classification.

> 📄 See [PDF page 4](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=4) — Figure 12.2-1: Microwave sensor signals across different activities

From the raw signal stream (10ms per reading), a sliding window of 1,000ms (100 readings) formed each set
of input features, with output labeled kick (kick=1) or not (kick=0, covering idle or other activities like walking
or objects passing), as in Table 12.2-1.

> 📄 See [PDF page 5](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=5) — Table 12.2-1: Example microwave signal data for kick detection

**Data Analysis**

Classification techniques tested, evaluated via 4-Fold Cross-Validation with Accuracy:

- Logistic Regression
- Decision Tree, using the GINI Coefficient
- Artificial Neural Network, 1 hidden layer of 10 nodes, logistic activation, max 5,000 iterations, stopping tolerance 0.0001, learning rate 0.001
- Support Vector Machine, RBF (Radial Basis Function) kernel, gamma 0.3, max 5,000 iterations, stopping tolerance 0.0001

**Results**

Logistic Regression gave the highest accuracy, 0.984 (Table 12.2-2). The final model was then trained on the
full dataset, with its 100 feature coefficients and intercept implemented in C on a microcontroller for real-
world deployment.

**Table 12.2-2: Kick-detection evaluation results**

| Technique | Accuracy |
|-----------|----------|
| Logistic Regression | 0.984 (best) |
| Decision Tree | 0.822 |
| Artificial Neural Network | 0.941 |
| Support Vector Machine | 0.887 |

## 12.3 A Recommender for Biologists Studying Fungi–Host Pairs

Drawn from "Link Prediction in Linked Data of Interspecies Interactions Using Hybrid Recommendation
Approach," presented at the Joint International Semantic Technology Conference, published in Lecture Notes
in Computer Science (LNCS), Springer, 2014 (Chawuthai et al., 2014; Chawuthai, 2016).

**Research Problem**

This research modeled relationships between observed fungi and their hosts (plants or animals), to recommend
to mycology researchers where else a given fungus might be found on other hosts — framed as a prescriptive
analytics problem.

**Data**

Original data was scanned from the book A List of Fungi Recorded in Japan: 9,151 fungi–host pairs, covering
3,884 fungus species and 2,582 host species. The book listed both scientific and Japanese common names (e.g.,
モミ, scientific name Abies firma), which were converted entirely to scientific names, as in Table 12.3-1.

> 📄 See [PDF page 6](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=6) — Table 12.3-1: Example fungi–host observation data

**Data Analysis**

Analysis used link prediction, viewing the fungi–host relationship as a bipartite graph, and built models to
predict the probability of missing links using 3 approaches:

- Collaborative Filtering, recommending likely relationships, named model Pᶜᶠ (also used as the baseline for comparison).
- Community Detection, grouping fungi and hosts into social communities based on similar relationship patterns, then estimating the probability of a relationship between a fungus and another host in the same community — named model Pᶜˢ.
- Content-Based Filtering, recommending likely relationships based on genus-level similarity between fungus and host species — named model Pᴮᶜ.

These 3 models were then combined into a Hybrid Model via linear learning, named Pⁱⁱ:

```
Pⁱⁱ(f,h) = 0.763 × Pᶜᶠ(f,h) + 0.543 × Pᶜˢ(f,h) + 0.101 × Pᴮᶜ(f,h) +
           0.428 × Pᶜᶠ(h,f) + 0.584 × Pᶜˢ(h,f) + 0.025 × Pᴮᶜ(h,f)
```

**Results**

Testing via Train-Test Split, with 20% of data randomly held out for testing, Pⁱⁱ outperformed the baseline
model, evaluated via Top-100 Precision alongside AUC (Area Under the receiver operating characteristic
Curve), as in Table 12.3-2.

The highest-scoring, not-yet-observed fungi–host relationships recommended by Pⁱⁱ were further investigated,
and several were confirmed to genuinely exist, discovered by researchers at Japan's National Museum of
Nature and Science after being guided by this research's recommendations, including:

- Fungus Amanita pseudoporphyria found on host Megaselia salteri
- Fungus Russula alboareolata found on host Drosophila brachynephros
- Fungus Amanita kotohiraensis found on host Megaselia gotoi
- Fungus Tylopilus ballouii found on host Megaselia flava
- Fungus Tylopilus ballouii found on host Tricimba japonica

**Table 12.3-2: Test results for the fungi–host recommendation models**

| Recommendation Technique | Top-100 Precision | AUC |
|---------------------------|-------------------|-----|
| Pᶜᶠ(f,h) — baseline model | 0.303 | 0.855 |
| Pⁱⁱ(f,h) — best | 0.577 (best) | 0.906 (best) |

## 12.4 A Recommender for Vehicle Rest Stops

Drawn from "A Hybrid Method for Predicting a Potential Next Rest Stop of Commercial Vehicles," presented
at the International Symposia of Transport Simulation (ISTS) and the International Workshop on Traffic Data
Collection and its Standardization (IWTDCS), Japan, published in Transportation Research Procedia, Elsevier,
2018 (Chawuthai et al., 2018).

**Research Problem**

This research predicted commercial vehicles' next rest stop, helping anticipate where vehicles will stop next to
prepare service and readiness — framed as a prescriptive analytics problem.

**Data**

Data came from commercial vehicle GPS tracking — coordinates (lat, lon) and timestamp (ts) — along with
vehicle type, as in Table 12.4-1.

> 📄 See [PDF page 9](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=9) — Table 12.4-1: Example vehicle GPS tracking data

**Data Analysis**

The approach used the previous stop (s0) and current stop (s1) to predict the next stop (s2), where a stop was
defined as a 30-minute to 3-hour stay after 50–300 km of travel, at a location visited by at least 100 vehicles
per day. Given a current stop (s1), the model considered all candidate stops within 300 km (Figure 12.4-1),
which shows the previous stop (s0), current stop (s1), and candidate next stops A, B, C, D.

> 📄 See [PDF page 10](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=10) — Figure 12.4-1: Diagram of next-stop selection

Raw GPS data (Table 12.4-1) was processed to identify each vehicle's stops and their sequence, recorded as in
Table 12.4-2, with s0, s1, s2 as stop coordinates (s2 the target to predict), vtype the vehicle type, and ts1 the
timestamp at the current stop (s1).

> 📄 See [PDF page 9](documents/da-textbook-ch12-research-case-studies-20260718.pdf#page=9) — Table 12.4-2: Example stop-sequence data for analysis

This data then fed a Hybrid Recommender System combining 3 scoring models:

- Model SF — estimates the probability of stopping at s2 given a history of stopping at s0 then s1.
- Model SD — considers the vector directions from s0 to s1 and s1 to s2 using Cosine Similarity: a straight-line path across all three points scores higher than an angled one, and a sharp turn (resembling backtracking) scores very low.
- Model SP — counts each stop's overall popularity, weighted against the popularity of all stops.

These models were learned and combined into a linear hybrid recommender:

```
PNext(s0, s1, s2*) = SF(s0, s1, s2*) + 0.8 SD(s0, s1, s2*) + 0.2 SP(s0, s1, s2*)
```

where Pᴺᵉˣᵗ scores a candidate next stop s2*, given the known previous stop (s0) and current stop (s1).

**Results**

Tested via Train-Test Split and evaluated with AUC, the model achieved 0.848 — a good-to-very-good result
for a recommender system.

Breaking results down by vehicle type and time of day: liquid-cargo trucks driving during the day scored
highest (AUC 0.938), followed by scheduled buses (day and night), container trucks (day and night), and
hazardous-cargo trucks driving during the day.

## 12.5 Chapter Summary

This chapter presented 4 of the author's own data-analytics research projects. The first two — "Detecting Road
Damage with a Gyro Sensor" and "Detecting Kicks with a Microwave Sensor" — are predictive-analytics
examples in classification, with sensor data as features and nominal-scale group labels as the target. The latter
two — "A Recommender for Biologists Studying Fungi–Host Pairs" and "A Recommender for Vehicle Rest
Stops" — are prescriptive-analytics examples, blending classification and clustering science into working
hybrid recommender systems. All these projects illustrate applying data analytics to real problems: framing
the problem clearly, choosing a trustworthy evaluation method, understanding and preparing the data, selecting
suitable analytics techniques, and reporting model results.

## 12.6 Review Questions

1. From "Detecting Road Damage with a Gyro Sensor," discuss what type of problem, what data, and what evaluation method would suit extending this research to measure pothole severity.
2. From "Detecting Kicks with a Microwave Sensor," discuss what would happen if another activity later produced a similar signal to kicking, and how the device could be improved.
3. From "A Recommender for Biologists Studying Fungi–Host Pairs," discuss why using Collaborative Filtering alone performed worse than combining it with other techniques.
4. From "A Recommender for Vehicle Rest Stops," discuss what additional variables could improve this recommender's performance.
5. From "A Recommender for Vehicle Rest Stops," discuss how evaluating results separately by vehicle type benefits the analytics work.

## 12.7 References

Chawuthai, R. (2016). Linked Open Data-Based Knowledge Management Process for Biodiversity. Doctoral
dissertation, SOKENDAI.

Chawuthai, R. (2018). Monitoring Roadway Lights and Pavement Defects for Nighttime Street Safety
Assessment by Sensor Data Analysis and Visualization. Sens. Mater, 30, 2267–2279.

Chawuthai, R., & Sakdanuphab, R. (2018). The Analysis of a Microwave Sensor Signal for Detecting a Kick
Gesture. In 2018 International Conference on Engineering, Applied Sciences, and Technology (ICEAST) (pp.
1–4). IEEE.

Chawuthai, R., Chankaew, N., & Threepak, T. (2018). A Hybrid Method for Predicting a Potential Next Rest
Stop of Commercial Vehicles. Transportation Research Procedia, 34, 36–43.

Chawuthai, R., Takeda, H., & Hosoya, T. (2014). Link Prediction in Linked Data of Interspecies Interactions
Using Hybrid Recommendation Approach. In Joint International Semantic Technology Conference (pp. 113–
128). Springer.

Lü, L., & Zhou, T. (2011). Link Prediction in Complex Networks: A Survey. Physica A: Statistical Mechanics
and Its Applications, 390(6), 1150–1170.
