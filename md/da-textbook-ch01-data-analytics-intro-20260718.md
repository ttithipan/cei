# Data Analytics Textbook — Ch01: Introduction (2026)

> 📄 [View original PDF](documents/da-textbook-ch01-data-analytics-intro-20260718.pdf) — source of truth

## Data Analytics

(English Edition)
Rathachai Chawuthai
Department of Computer Engineering
Faculty of Engineering
King Mongkut's Institute of Technology Ladkrabang

“

If the value of this book can be another step
for readers to apply data analytics
toward improving themselves, their organizations, society, the nation, or the environment,
the author dedicates this merit to his teachers, family, friends,
and all who have supported him.
”

Preface
From the popular saying “Data is the new oil,” coined by Clive Humby, a British mathematician and data-
analytics entrepreneur — this reflects today’s business competition. What used to be a race for oil is now a
race to own data assets that can be turned into value. Global technology leaders such as Google, Facebook,
and Netflix have all built enormous revenue on the vast amounts of data they hold. Yet data alone is not enough:
it must be analyzed to produce results that create value or support sound strategic decisions.
With this in mind, this book was written to share knowledge of data analytics, drawing on textbooks, academic
articles (both Thai and international), and the author’s experience teaching data analytics and artificial
intelligence, conducting research, and providing academic services. The content follows the data science
process — from data collection, data processing, data exploration, and building predictive, clustering, and
recommendation models using artificial-intelligence techniques, through to model evaluation and application
of results — including case studies drawn from the author’s own research. The book combines theory with
Python programming examples so that readers can learn and practice toward real-world application.
Finally, the author offers this body of knowledge through this book to those who wish to apply data analytics
in business, use it as a research reference, or use it to help improve the environment. As the field of data
analytics is constantly advancing, the author welcomes readers’ feedback to help keep the content up to date.
Rathachai Chawuthai

1. Introduction
“Data is the new oil.”
— Clive Humby
Today, data plays a critical role in the development of nearly every sector — business, education, healthcare,
defense, transportation, and more. For example:
•
7-Eleven in Japan analyzes sales using factors such as the previous day, the same day last year, days
with similar weather, and products sold at other branches, to plan next-day stock levels for each
store — helping make it Japan’s most profitable retail chain for over 30 years (Ross et al., 2013).
•
Amazon.com faced a problem where too many product choices made it hard for customers to
decide, so it built a recommendation system based on browsing behavior and estimated income by
location, boosting sales through more accurate recommendations (Marr, 2021).
•
Krungsri Bank analyzed debtor data to forecast repayment likelihood, improving debt-collection
efficiency and reducing the collection team’s workload by 20% (Muangtum, 2020).
•
Splunk won the Deutsche Bahn IoT Hackathon by predicting rail-track misalignment: sections
supported by wood showed far greater deviation than concrete sections (over 18% fewer issues),
guiding future infrastructure investment and predictive-maintenance alerts (Drieger, 2015).
•
Grab, across Southeast Asia, personalizes its app using product popularity, individual preference,
similar user groups, in-app behavior, and referrals — driving strong adoption for food delivery,
goods, and transport services (Justin, 2019).
•
Spotify uses listening behavior and search history to power its song-recommendation system, better
matching each listener’s taste and improving user satisfaction (Tyagi, 2020).
These cases show that data analytics is the discipline of finding needed answers from data: define the problem,
choose the data, apply techniques and tools to find the answer, and finally present the results for practical use.
This book explains the discipline of data analytics in detail, together with Python code examples. This
introductory chapter covers what data analytics is, the types of analytics problems, the data science process,
and the structure of the book.
## 1.1 Data Analytics

This section introduces the essentials of data analytics: the benefits of data analytics, how to frame an analytics
problem — which is crucial in determining the choice of technique and the method of evaluation — and how
to build a data analytics team.
Benefits of Data Analytics
The saying “data is the new oil” is hardly an exaggeration today. Just as industrial progress once depended on
oil, business today runs on data — whoever holds good, abundant data has the competitive edge, since data-
driven conclusions guide business direction (Provost & Fawcett, 2013). The benefits, or goals, of data analytics
fall into three categories: cost reduction, value adding, and innovation creation.
Cost Reduction
“Cost” here means resources and time. 7-Eleven Japan’s demand forecasting, mentioned above, reduces
inventory-holding costs — an example of reducing resource use. Google Maps is an example of reducing time:
before route-planning apps, most drivers had to consult paper maps or booklets; by analyzing map data together
with the real-time movement data of mobile devices worldwide, Google Maps can recommend the best route
almost instantly, greatly cutting the time users spend planning a trip.
Value Adding
“Value” in business terms means benefit — revenue and profit — as well as value created for people, society,
or the environment. For example: analyzing Amazon.com user data enables recommendations that match
customers’ needs, boosting sales; analyzing various measured values in the body can detect early cancer risk,

enabling timely treatment — a value to humanity and to medicine; and summarizing air-pollution data supports
environmental-policy decisions in many major cities — adding value to the environment.
Innovation Creation
Beyond reducing cost or adding value, analysis often reveals unexpected problems or a deeper understanding
of what consumers need, leading to new products or inventions that better serve users — in other words, data
analytics can itself drive innovation. Self-driving cars are a prime example: an innovation built on processing
enormous, multi-dimensional data using advanced technology, to produce something genuinely usable,
valuable to users, and safe.
Because every round of data analytics requires substantial investment of money and effort — sourcing data,
importing it, storing it, processing it, analyzing it, and validating the results — and the cost rises further with
larger data volumes, each analytics initiative needs a clear goal: is it aimed at cost reduction, value adding, or
innovation creation? The outcome must ultimately be worth the effort invested.
For this reason, starting an analytics project requires framing a good, clear, and useful problem — something
that depends on knowledge, expertise, and experience in the relevant domain, since a well-framed problem
leads to an effective analytics direction and process, as explained in the next section.
Framing the Analytics Problem
Every decision — from a personal choice to a national policy — begins with a question in the decision-maker’s
mind (Provost & Fawcett, 2013). For example: “What time should I leave home to arrive at work on time?”
Even a small question like this isn’t easy to answer — it breaks down into further questions about the distance
from home to work, how bad the traffic is, and how fast one can drive during rush hour. Such questions cannot
be reliably answered by intuition alone; a correct answer requires proper data analysis. Analytics questions can
be grouped into three types: descriptive, predictive, and prescriptive, illustrated below across five domains:
commerce, health, education, agriculture, and transportation.
Descriptive Analytics
Descriptive questions simply summarize what has already happened, using historical data — typically phrased
as “how much,” “what type,” or “which.” For an online retail business, for example:
Commerce: What was the average monthly sales last year? Who are the top 100 highest-spending customers?
Which month had the highest air-conditioner sales?
Health: Which month had the most flu patients? Which age group is most prone to flu?
Education: What was each student’s GPA last year? Which 10 courses received the highest evaluation scores
last year?
Agriculture: What was last year’s rice yield in Suphanburi province? Which crop had the highest monthly
output last year?
Transportation: What time of day sees the worst traffic in Bangkok? Which road segment moves fastest during
rush hour?
These questions can be answered using simple statistics such as averages, maxima, and minima. However, the
answers alone don’t immediately create business value — further discussion is usually needed to decide what
action to take. For instance, knowing that January has the best air-conditioner sales still leaves the question,
“so what should we do about it?”
Predictive Analytics
Predictive questions forecast a future answer — usually a value or a category — and often contain the word
“will.” For example:
Commerce: What will next month’s sales be? Will this customer return to the store?
Health: How many flu patients are expected next quarter? Given headache and vomiting, is this likely the flu?
Education: What will this student’s GPA be next semester? Is this student likely to pursue doctoral studies?

Agriculture: How much durian will be produced next quarter? Does this aerial photo show a corn field?
Transportation: What will the average speed at this point be in 5 minutes? Is there currently an accident at this
location?
These questions require clearly specifying what is being forecast, and typically use advanced statistical
techniques together with programming to detect patterns in the data and produce a forecast — a specific value
or category (e.g., next year’s rubber price) — but not what action to take, which is the subject of prescriptive
questions.
Prescriptive Analytics
Prescriptive questions recommend the best option(s) toward a clearly defined goal, typically phrased as “what’s
best” or “which is best.” For example:
Commerce: What product should we feature next month to attract more young customers? Which items should
be recommended to maximize the chance of purchase?
Health: Which area should be visited for health screening this week? Which physiotherapy best suits this
condition?
Education: Which faculty best matches this student’s high-school results? Which elective should be
recommended based on past grades?
Agriculture: What should be planted next year to maximize income without depleting the soil? Which market
should this produce be sent to for the best profit?
Transportation: Where should a new road be built to relieve rush-hour congestion? Which route is fastest and
most cost-effective for tomorrow’s trip?
These questions involve forecasting multiple options and then selecting the single best one, or a good shortlist,
for the user — as in the recommendation systems used by e-commerce platforms or video services. Answering
them requires more advanced statistical techniques and more complex programming, to make the
recommendation as accurate as possible.
Putting the Three Types Together
At this point, readers should be able to frame a question and identify which of the three types it belongs to,
since each requires a different level of technique and effort — an important consideration for any business, as
it affects both the value created and the competitive advantage gained. To reinforce this, here is how the three
question types connect, using a stock-investment example:
Descriptive: How much did this company’s stock rise or fall last quarter?
Predictive: What will this stock be worth next quarter? Will it rise or fall if the exchange rate increases?
Prescriptive: Which stock should I buy for the best profit next quarter? Which stock in my current portfolio
should I sell now for the best return?
Descriptive questions are the easiest, since existing data can be summarized directly, often as a chart. Predictive
and prescriptive questions are progressively more difficult, and the two are often confused — for example, a
project titled “stock recommendation system” that simply lets a user enter a stock code and returns a predicted
future price is, in fact, a stock-price prediction system, not a true recommendation system. A genuine stock
recommender would itself select which stocks are likely to perform well and present them to the user as buy
candidates. Framing the right type of question is therefore a critical starting point in data analytics, since it
drives the choice of data, analysis technique, evaluation method, and presentation — all of which affect the
value created and the investment required.
The Data Analytics Team
Effective data analytics requires a team of specialists working together — the Business Data Analyst, the Data
Engineer, the Data Scientist, and the Developer — collaborating from problem framing through data
preparation, analysis, and eventual deployment.

Business Data Analyst
Has strong knowledge of the specific business domain — finance, agriculture, education, logistics, healthcare,
and so on — and understands how data can strengthen that business. Their main responsibility is framing
questions that guide analytics toward creating real value for the business, whether through cost reduction, profit
growth, or new products.
Data Scientist
Responsible for building the models that answer business questions with high accuracy and real-world
usability, following a scientific process:
•
Problem definition — interpreting the business question as descriptive, predictive, or prescriptive; if
predictive, further specifying whether the target is a continuous number (e.g., stock price) or a
discrete/classification outcome (e.g., whether a stock will rise or fall).
•
Hypothesis formulation — reasoning about the relationship between independent and dependent
variables. For example, forecasting air-conditioner sales might start with the hypothesis “ambient
temperature affects air-conditioner sales,” or more specifically, “using temperature together with
Linear Regression improves sales-forecast accuracy.” A well-formed hypothesis clarifies what data
to collect and which technique to apply.
•
Hypothesis testing — selecting the data and technique, then running experiments using analytics
tools or code, following the direction set out in the hypothesis.
•
Result analysis — evaluating whether the experimental results are correct, how reliable the
evaluation process is, and whether the outcome truly answers the original question.
•
Conclusion — accepting or rejecting the hypothesis. If accepted, the resulting model becomes a
prototype for real deployment; if rejected, the cause and next steps must be identified.
Data Scientists also work closely with the rest of the team: with the Business Data Analyst, to jointly
understand the question, plan the workflow, and discuss the analysis results toward the intended business value;
with the Data Engineer, to clarify what data is needed so a clean, ready-to-use dataset can be prepared; and
with the Developer, to explain the resulting mathematical model so it can be implemented as working software.
This makes the Data Scientist a central role in the analytics process, requiring broad knowledge of mathematics
and statistics, programming, the relevant business domain, and communication — and the ability to coordinate
well with the rest of the team.
A well-known framework, shown in Figure 1.1-1, describes three core skills for data science: Mathematics &
Statistics, Programming, and Domain Expertise (communication is treated separately as a general soft skill
expected in any profession). The diagram illustrates that strong data science requires all three. Lacking
programming skill still allows research work to be produced; lacking domain expertise still allows general
machine-learning work to serve as a foundation for various businesses; but having business knowledge and
programming skill without solid grounding in mathematics and statistics — common among IT staff who
haven’t deeply studied these subjects but are drawn to business applications — is the highest-risk combination,
known as the “Danger Zone.” People in this zone tend to copy techniques found online and apply them
immediately without properly understanding the data’s behavior, the technique’s assumptions, or the true
nature of the problem. Such models may perform well in testing yet misrepresent the real relationships in the
data, leading to costly failures in production.
A good Data Scientist therefore needs a solid foundation in mathematics, statistics, programming, domain
knowledge, and communication — enabling effective teamwork toward accurate models and analytics
processes that genuinely meet business needs.

> 📄 See [PDF page 9](documents/da-textbook-ch01-data-analytics-intro-20260718.pdf#page=9) — Figure 1.1-1: Core skills of the data science profession
Data Engineer
If the Data Scientist is the chef, the Data Engineer is the one who sources and prepares the ingredients. In the
analytics process, the Data Engineer is mainly responsible for collecting data and performing initial processing
to produce a dataset ready for analysis. In practice this role demands significant effort and resources, since raw
data is vast and rarely in a directly usable form — the Data Engineer must therefore choose the most effective
technologies and tools for ingesting, collecting, storing, and pre-processing data so it is ready for the next stage
of analysis.
Developer
Once the Data Scientist has produced a suitable model, the Developer — the software engineer — takes the
model, essentially a mathematical function, and implements it into an actual production system. This step is
necessary because the tools used during experimentation (such as MATLAB, R, or RapidMiner) often differ
from the real deployment environment, which might be an embedded system or a mobile application. The
Developer must therefore re-implement the underlying model logic using the tools or programming language
required by the target platform.
## 1.2 Levels of Analytics

Data analytics exists to drive some Action toward a goal — where and when to advertise a product to boost
sales, which route to take to arrive on time and save cost, how many staff to reduce for a company to survive
a crisis, and so on. Taking Action requires Data, but raw data alone cannot help directly — it must first go
through Analytics to produce a result that supports a Decision, which then leads to Action, as shown in Figure
1.2-1. The diagram shows three levels of analytics — Descriptive, Predictive, and Prescriptive — of increasing
technical complexity. A low-complexity method such as descriptive analytics, which merely summarizes data
(e.g., daily, monthly, or yearly sales), cannot by itself indicate how much stock to invest in for the coming
week; it still requires More Human Input (additional brainstorming) before a Decision can be made and an
Action taken. As the level of analytics rises — toward predictive or prescriptive analytics — more complex
mathematical techniques and heavier investment of effort are required, but the payoff is a reduced need for
further human input to reach a decision and act. Analysts must therefore identify which level a given problem
belongs to, since each level differs in investment, tools, technique, and the amount of additional human
brainstorming expected.

> 📄 See [PDF page 11](documents/da-textbook-ch01-data-analytics-intro-20260718.pdf#page=11) — Figure 1.2-1: Diagram of the levels of analytics
The following explains each level using a fund-investment example.
Descriptive Analytics
Descriptive analytics summarizes historical data to support decisions (O’Neil & Schutt, 2013). For a fund-
investment example, questions at this level ask things like: did this fund gain or lose money last year? Over
the past 3–5 years? These can be answered using Microsoft Excel or SQL queries against a database, making
this the least computationally complex level. However, knowing the result — for example, that a fund was
profitable for two years but lost money last year — still isn’t enough to decide whether to invest; further
brainstorming and additional information are usually needed. So while this level of analysis is inexpensive, its
results are often insufficient on their own for a confident decision. Still, it is typically where analytics begins,
and it can reveal patterns in the data useful for higher-level analysis.
Predictive Analytics
Predictive analytics forecasts an unknown output from known inputs (Igual & Seguí, 2017). In the fund
example, this means forecasting the growth rate of a fund of interest over the next 1, 3, or 5 years. This level
begins using machine-learning techniques to learn patterns in the data and forecast outcomes under given
conditions — for example, Linear Regression, Decision Trees, Naïve Bayes, Logistic Regression, or Artificial
Neural Networks — requiring more advanced computer science and mathematics knowledge. Predictive
analytics gives clearer direction than descriptive analytics, since it forecasts a future value of interest, reducing
the amount of additional human brainstorming needed after reading the results. Still, for a good decision, the
analyst must choose carefully what to forecast — for example, which funds to forecast, and over what time
horizon.
Prescriptive Analytics
Prescriptive analytics recommends the option(s) a user is likely to want, in order to achieve a system’s goal
(Ricci et al., 2011). In the fund example, this means recommending specific funds to a user based on a clearly
defined goal — for instance, if the user wants a short-term fund, the system recommends which fund is likely
to deliver short-term profit within the user’s acceptable risk level, with the computer performing the analysis
and selection. This level uses even more advanced computational and mathematical techniques, such as
Collaborative Filtering, often combined with Clustering and Machine Learning, and sometimes enriched with
additional content or domain knowledge for greater recommendation accuracy.
Prescriptive analytics can substantially reduce the human brainstorming burden, since it narrows the options
down to the best candidates for the user to act on. Results at this level fall into two sub-categories: Decision
Support, where the system presents the best available information for the user to choose from (e.g.,
recommending funds likely to perform well, suggesting routes, or ranking search results by keyword); and
Decision Automation, where the system itself selects the best option and acts — for example, automated fund-
trading systems, automated stock-trading systems, and chatbots, which interpret a user’s intent and
automatically select the best response.

## 1.3 The Data Science Process

This book follows the data science process shown in Figure 1.3-1, adapted from Doing Data Science: Straight
Talk from the Frontline (O’Neil & Schutt, 2013) — a continuous cycle running from real-world data through
to results that ultimately feed new data back into the real world. Each stage is explained below.

> 📄 See [PDF page 13](documents/da-textbook-ch01-data-analytics-intro-20260718.pdf#page=13) — Figure 1.3-1: The data science process
Reality
All data originates in the real world, represented by the globe icon in Figure 1.3-1 — every activity on Earth,
and across the universe, constantly generates data: heat, light, movement in every activity, every step, every
motion, and every human communication throughout history. This data becomes usable once it is properly
recorded, and advances in science and technology continually let us capture more of it, in more varied forms,
for more purposes.
Data Collection (DS-1)
Today we collect data far more effectively thanks to advances in science and technology — sensing devices
such as thermometers, light meters, microphones, cameras, speed sensors, accelerometers, rotation sensors,
chemical sensors, and many others. The Internet of Things plays an especially large role at this stage, with the
Data Engineer as the key contributor, turning real-world phenomena into raw data ready for the next step (DS-
1 in Figure 1.3-1).
Data Processing (DS-2)
Once data exists in digital form, it usually still cannot be used directly, since it isn’t yet in a ready-to-use
structure. It must therefore go through data processing (DS-2 in Figure 1.3-1), whose main activities include
handling missing data, handling outliers, data transformation, feature engineering, and scaling. Practitioners in
the field generally agree that over 60% of analytics effort goes into this stage — so adequate staffing and time
must be planned for data processing before moving on to analysis.
Clean Dataset
After data processing, the result is a dataset ready for model building — data in a proper, well-structured
tabular form, with consistent units and a consistent data type in each column, and free of missing or abnormal
values.
Data Exploration (DS-3)
Even once a clean dataset is ready, it is good practice to explore the data first (DS-3 in Figure 1.3-1) to observe
its behavior — relationships between variables, its distribution, and its range — typically presented through
charts such as scatter plots, histograms, or box plots. This both verifies data quality and reveals trends that
guide the choice of analysis technique.

Model & Algorithm Development (DS-4)
Model development (DS-4 in Figure 1.3-1) is the core step of analysis, using machine-learning techniques to
learn from the dataset and produce a mathematical model — equations, logical rules, and so on — for
description, prediction, clustering, or recommendation. This is the stage where the Data Scientist plays the
largest role, aiming to develop a model that fits the problem, meets the required accuracy, and performs
efficiently given the available data volume and technology.
Once a good model is ready, the process branches into two paths, described next: communicating the results,
or building a data product from them.
Communicating Results (DS-5)
Presenting analysis results (DS-5 in Figure 1.3-1) means reformatting them for communication, reporting, or
visualization, so that the audience — a manager, a client, or the general public — can clearly and quickly
understand the results and use them effectively to support a decision. The Business Data Analyst plays a key
role here, blending both science and art, an understanding of human perception, and the audience’s needs to
shape an effective presentation.
Data Product (DS-6)
A data product (DS-6 in Figure 1.3-1) is a software or hardware application built using the analytics model as
its core mechanism, learning and improving as it encounters new data. The Developer plays a central role at
this stage. Such a product may be a primary offering or a supporting feature of another product — for example,
a keyword-based website-recommendation system is the core product of a search engine, a message-
interpretation system is the core product of a chatbot, a product-recommendation feature supports an e-
commerce platform, and a route-recommendation feature supports a maps application. When users act on these
products, new data flows back into Reality — for instance, Google Maps’ route recommendations rely on real
travel data collected from the real world, and once a user follows a recommended route, that trip generates new
real-world data that continues to improve the product.
## 1.4 Scope and Structure of This Book

This book explains data analytics using the data science process shown in Figure 1.3-1 as its guiding
framework, with an emphasis on building analytics models for tabular data, and Python code examples using
libraries popular for data-analytics programming. It is therefore best suited to readers who want to learn data
analytics and already have a programming background, particularly in Python. The content of each chapter is
as follows.
Chapter 1 – Introduction: An overview of data analytics, how to frame analytics problems, the data analytics
team, the levels of analytics, and the data science process, all covered in this chapter.
Chapter 2 – Data Collection: How data is obtained, types of data, and the example datasets used in this book
— covering the Reality and Data Collection (DS-1) stages, and importantly introducing data scales: nominal,
ordinal, interval, and ratio, which matter throughout the rest of the book for choosing processing techniques,
analysis techniques, and visual presentation.
Chapter 3 – Data Processing: Data cleaning and transformation — covering Data Processing (DS-2) and the
Clean Dataset stage. This chapter also introduces Python programming for data processing using the NumPy
and Pandas libraries, both essential and popular among data analysts.
Chapter 4 – Exploratory Data Analysis: Data types, basic statistics (central tendency, dispersion, correlation),
and observing data behavior through statistics and charts, with worked examples — covering the Data
Exploration (DS-3) stage.
Chapter 5 – Analytics Approach: An introduction to machine learning, covering model-selection approaches,
evaluation methods, and the model-development process, as part of Model Development (DS-4).
Chapter 6 – Regression Analysis: Building regression models for forecasting continuous numeric outcomes,
as part of Model Development (DS-4).
Chapter 7 – Classification Analysis: Building classification models for forecasting categorical outcomes, as
part of Model Development (DS-4).

Chapter 8 – Clustering Analysis: Building clustering models to group similar items together, as part of Model
Development (DS-4).
Chapter 9 – Recommender Systems: The science of building systems that recommend items to users — such
as recommending products a user is likely to buy, based on context and behavior — as part of Model
Development (DS-4) and a key mechanism of the Data Product (DS-6) stage.
Chapter 10 – Data Visualization: The science and art of visual presentation, understanding human perception,
and using visual symbols effectively so presentations are easy to understand and to the point — an important
part of Communicating Results (DS-5).
Chapter 11 – Additional Analytics Techniques: Further techniques for handling common data challenges,
including techniques for analyzing unstructured data.
Chapter 12 – Research Case Studies: Case studies drawn from the author’s own research, illustrating real-
world applications of data analytics.
Chapter 13 – Conclusion: A summary of the entire book, organized according to the data science process.
Readers can also find the datasets used, Python code examples, full-color figures, and updates to this book at:
https://github.com/Rathachai/DA-LAB
## 1.5 Chapter Summary

This chapter introduced data analytics as a whole — its benefits, which guide how problems are framed as
descriptive (for finding conclusions), predictive (for forecasting), or prescriptive (for recommending
decisions); the roles that make up an analytics team, namely the Business Data Analyst, Data Scientist, Data
Engineer, and Developer; the three levels of analytics — descriptive, predictive, and prescriptive; and the data
science process, which forms a continuous cycle of Reality, Data Collection, Data Processing, Clean Dataset,
Data Exploration, Model Development, Communicating Results, and Data Product. This process is the main
thread that structures the rest of this book.
## 1.6 Review Questions

1. Give five examples of descriptive-analytics questions for a course-registration system.
2. Give five examples of predictive-analytics questions for a course-registration system.
3. Give five examples of prescriptive-analytics questions for a course-registration system.
4. Explain the term “Danger Zone,” with example causes and consequences.
5. Explain why the Data Product stage in the data science process loops back to the Reality stage.
6. Present a business case study for each of the following domains where data analytics created
business value: (a) agriculture, (b) public health, (c) finance, (d) tourism.
7. Explain why the same person should generally not take on both the Data Scientist and Data
Engineer roles.
## 1.7 References

Drieger, P. (2015). All Aboard with Infrastructure 4.0 — Splunk Wins Deutsche Bahn Internet of Things
Hackathon. splunk.com. [Accessed 15 October 2021]
Igual, L., & Seguí, S. (2017). Introduction to Data Science. Springer, Cham.
Justin, B. (2019). Recommendation Systems at Scale — Making Grab’s Everyday App Super.
towardsdatascience.com. [Accessed 15 October 2021]
Marr, B. (2021). Amazon: Using Big Data to Understand Customers. bernardmarr.com. [Accessed 15 October
2021]
Muangtum, N. (2020). Krungsri Uses Data Before Calling to Collect Debt. everydaymarketing.co. [Accessed 15 October 2021]

O’Neil, C., & Schutt, R. (2013). Doing Data Science: Straight Talk from the Frontline. O’Reilly Media, Inc.
Provost, F., & Fawcett, T. (2013). Data Science for Business: What You Need to Know about Data Mining
and Data-Analytic Thinking. O’Reilly Media, Inc.
Ricci, F., Rokach, L., & Shapira, B. (2011). Introduction to Recommender Systems Handbook. In
Recommender Systems Handbook (pp. 1–35). Springer, Boston, MA.
Ross, J. W., Beath, C. M., & Quaadgras, A. (2013). You May Not Need Big Data After All. hbr.org. [Accessed 15 October 2021]

Tyagi, N. (2020). How Spotify Uses Machine Learning Models? analyticssteps.com. [Accessed 15 October
2021]
