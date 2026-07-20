# Data Analytics Textbook — Ch10: Data Visualization (2026)

> 📄 [View original PDF](documents/da-textbook-ch10-data-visualization-20260718.pdf) — source of truth

10. Data Visualization
"A picture is worth a thousand words."
— Chinese proverb

> 📄 See [PDF page 1](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=1) — Figure 10.0-1: Data visualization step in the data science process

Another critical step in the analytics process is presenting results (DS-5 in Figure 10.0-1), to communicate
findings so stakeholders can perceive, understand, and act on key insights. A report full of raw numbers or
dense text often doesn't serve the audience well, so analysts need to summarize data visually — helping the
audience grasp the point, spot trends, and make sharper, better-informed decisions.

## 10.1 Using Images to Convey Meaning

Try spending just 3 seconds studying Table 10.1-1, which shows monthly 2020 sales for products A, B, C, and
D at a company, with the last column totaling the year. Before turning the page, try answering:
"If you could manage only one product next year, which would you choose?"

**Table 10.1-1: Monthly product sales at a company in 2020**

| Product | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec | Sum |
|---------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| A       | 82.25 | 81.46 | 79.68 | 74.91 | 75.03 | 74.03 | 70.46 | 69.47 | 67.62 | 64.75 | 63.52 | 64.09 | 867.26 |
| B       | 13.58 | 13.41 | 14.92 | 10.15 | 10.81 | 11.56 | 10.32 | 10.56 | 12.28 | 14.56 | 18.07 | 18.33 | 158.54 |
| C       | 20.67 | 22.24 | 27.50 | 29.38 | 31.99 | 37.64 | 37.59 | 38.94 | 39.43 | 38.42 | 38.16 | 38.17 | 403.11 |
| D       | 32.99 | 35.08 | 34.03 | 38.98 | 40.32 | 41.65 | 42.26 | 45.85 | 50.22 | 54.07 | 55.12 | 57.90 | 523.48 |

*(figures in million baht)*

Many people can't answer in time; many others answer "A," since it has the highest total (867.26 million baht).
But most people find reading a table like this under time pressure uncomfortable — and prone to leading to
the wrong decision.

Now compare this to the same data shown as a line chart (Figure 10.1-1): the horizontal axis is month, the
vertical axis is sales in million baht, and each line is a product's monthly revenue. Reading this chart for just 3
seconds reveals that product A is actually becoming less interesting — it's trending downward — while product
D, despite lower total revenue, is trending steadily upward and may eventually overtake A. This shows why
visualizing data, rather than presenting it as text or tables, matters so much for audience understanding and the
decisions that follow.

> 📄 See [PDF page 2](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=2) — Figure 10.1-1: Line chart of monthly sales by product (figures in million baht)

Designing a chart to explain data requires both science and art: science to choose which aspect or dimension
of the data to present, and art to make sure the audience gets the point quickly, without excessive mental effort.
The same data could also be shown as a bar chart, pie chart, and so on. Figure 10.1-2 shows the same data as
a stacked 3D bar chart — a visually striking technique that was once popular, but demands far more mental
effort from the audience to interpret correctly. This reinforces that good data visualization requires both science
and art together.

> 📄 See [PDF page 3](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=3) — Figure 10.1-2: Stacked 3D bar chart of monthly sales by product (figures in million baht)

This leads to the key goals good data visualization should achieve:

- Help the audience get the point quickly.
- Let the audience think and decide immediately.
- Reduce the burden of remembering large amounts of data.
- Align with how human perception naturally works.

The following sections explain the principles behind achieving these goals.

## 10.2 Human Visual Perception

Visual perception is the human ability to distinguish and interpret what we see without extra mental effort —
something is seen and understood instantly, consistently across most people. This section covers visual
encoding grounded in human visual perception (Iliinsky & Steele, 2011; Wexler et al., 2017): size, position,
and color.

**Size**

Size can be shown through varying areas, and humans naturally distinguish objects of different sizes, instantly
interpreting a smaller object as representing a smaller value and a thinner object as representing less than a
thicker one, as in Figure 10.2-1. Size perception therefore has natural ordering, requiring no extra cognitive
effort.

> 📄 See [PDF page 4](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=4) — Figure 10.2-1: Perceiving size

Charts based on size (Figure 10.2-2) include: bar charts (bar length represents value), bubble charts (circle size
represents value), area charts (area represents value), and pie charts (slice size represents value).

> 📄 See [PDF page 4](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=4) — Figure 10.2-2: Example charts using size

For example, the bar chart in Figure 10.2-3 shows average ratings for several movies, letting the audience
easily compare them via bar length. Charts like this can be improved further — sorting scores descending,
labeling values at the end of each bar, or highlighting a specific bar (e.g., coloring "Movie 2" distinctly if a
studio wants to see how their film compares to others released at the same time).

> 📄 See [PDF page 5](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=5) — Figure 10.2-3: Example bar chart of movie ratings

**Position**

Position can be shown via an object's coordinates, and humans naturally distinguish and interpret different
positions — a higher position is read as a greater value than a lower one, without extra effort, as in Figure
10.2-4 (1). Position therefore also has natural ordering, though left-right positioning is harder to interpret
consistently, since its meaning varies across cultures and beliefs.

> 📄 See [PDF page 5](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=5) — Figure 10.2-4: Perceiving position, and example charts

The best-known position-based chart is the line chart (Figure 10.2-4, panel 2), which places data at heights
representing values and connects them to show continuity. The OHLC (Open-High-Low-Close) price chart
(panel 3) similarly uses position to mark the open, high, low, and close prices.

Position can also be combined with maps to show data by location, as in Figure 10.2-5, where each point
represents data tied to a specific place. Map-based visuals typically combine several visual encodings at once,
matching the different dimensions being communicated.

> 📄 See [PDF page 6](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=6) — Figure 10.2-5: Using position on a map

**Color**

Color strongly leverages human visual perception — people readily distinguish differences in hue, making
color effective for creating contrast, grabbing attention, and conveying meaning. Figure 10.2-6 outlines the
principles of color use: hue, brightness, localization (social interpretation), and wavelength.

> 📄 See [PDF page 6](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=6) — Figure 10.2-6: Principles of color use

*Hue*

Hues — black, brown, red, orange, yellow, green, blue, purple, gray, white, etc. — are clearly distinguishable
to humans and useful for signaling that one piece of data differs from another. However, hue cannot convey
magnitude — there's no way to say gray is "greater" than purple, or by how much, since hue has no natural
ordering. Avoid using hue to represent numeric values; use it only to create distinction, grab attention, and
convey easily understood meaning, such as traffic light colors.

*Brightness*

While hue shouldn't represent numeric value, brightness within a single hue can: darker shades are read as
greater values than lighter ones, giving brightness natural ordering too. However, use no more than 3–5 levels,
since the human eye struggles to reliably distinguish more than that.

*Localization (Social Interpretation)*

Color meaning is often culturally learned — traffic lights, where green means go, yellow means prepare to
stop, and red means stop, leading most people to associate red negatively and green positively. This carries
over into project-status reports (green for on-track, yellow for in-progress, red for behind schedule) and stock-
price indicators (green up-arrows for gains, red down-arrows for losses in many markets). But this isn't
universal: in some cultures, like Japan, red conventionally signals a stock price increase and green a decrease.
Designers must understand their audience's cultural context (localization) to avoid miscommunication.

*Wavelength*

Since hue lacks natural ordering, some designs instead try ordering hues by wavelength — purple (400nm)
through blue, cyan, green, yellow, to red (700nm) — to represent numeric values. Even though this follows a
physical ordering principle, it isn't a natural ordering that humans intuitively perceive, so readers need extra
mental effort to interpret such a report. This approach isn't recommended; if unavoidable, include a reference
scale so readers have something to compare against, though it will still require some added interpretive effort.

## 10.3 Turning Data into Images

Visual encoding — turning data into images — relies fundamentally on human visual perception (Iliinsky &
Steele, 2011; Wexler et al., 2017), aiming to help the audience get the point quickly, decide immediately,
remember less, and align with natural perceptual ability. Table 10.3-1 summarizes this, followed by guidance
for each data scale: ratio, interval, ordinal, and nominal (classification).

**Table 10.3-1: Perceptual properties of visual elements**

| No. | Element | Example | Perception | Natural Ordering | Recommended Count |
|-----|---------|---------|------------|------------------|-------------------|
| (1) | Point | Position | Yes | As many as needed |
| (2) | Bar | Size | Yes | As many as needed |
| (3) | Area | Size | Yes | Many |
| (4) | Thickness | Size | Yes | Few |
| (5) | Brightness | Color (intensity) | Yes | Few |
| (6) | Hue | Color (hue) | No | Up to 20 |

**Ratio Scale**

Ratio-scale data is continuous, so elements with natural ordering can be used:

- Point position (1) — works well for as many points as needed, since one-dimensional placement is
easy to compare, even for small differences — recommended.
- Bar length (2) — similarly works for as many bars as needed, being one-dimensional and easy to
compare — recommended.
- Area (3) — usable, but avoid too many distinct sizes and ensure clear differences between them, since
comparing area requires judging two dimensions (width and height) at once, demanding more mental
effort.
- Thickness (4) — usable, but with only a few levels, since similar thicknesses are hard to compare (if
humans were great at this, we'd be able to read barcodes by eye).
- Brightness (5) — usable, but with only a few levels (3–5), since similar intensities are hard to
distinguish.

**Interval Scale**

Interval-scale data is continuous and ordered, just like ratio-scale data, so the same principles apply.

**Ordinal Scale**

Ordinal data isn't continuous but is ordered (e.g., shirt sizes S, M, L, XL), with no meaningful measure of the
gap between values. All of point position (1), bar length (2), area (3), thickness (4), and brightness (5) can be
used, with emphasis on showing clear distinctions between levels.

**Nominal Scale (Classification Scale)**

Nominal data represents unordered group names with no measurable difference between them, so hue is
recommended, along with point position:

- Hue (6) — usable and recommended, with each group given a distinct primary hue; keep to 20 hues
or fewer, since more becomes hard to distinguish.
- Point position (1) — usable by clustering same-group items together, as in placing data points on a
map.

## 10.4 Approaches to Presenting Data Visually

Presenting an analytics report visually requires combining visual elements — point position, bar length, area,
thickness, brightness, hue, and so on — to communicate clearly to the audience. This section walks through a
real example: website usage statistics from Google Analytics, shown in Figure 10.4-1.

> 📄 See [PDF page 11](documents/da-textbook-ch10-data-visualization-20260718.pdf#page=11) — Figure 10.4-1: Example data visualization of website usage statistics (source: analytics.google.com)

This report uses visual elements to convey several data dimensions as follows.

**Traffic Channel**

Shows daily website visits by channel:

- Visit volume (ratio scale) — shown via bar height, using the size principle.
- Date (interval scale) — shown via bar position, left to right by day.
- Traffic channel (nominal scale) — shown via hue, e.g., dark blue for Direct traffic, light blue for
Organic Search.

**Active Users**

Shows daily active users, broken down by day-range:

- User count (ratio scale) — shown via point height on a line chart, using the position principle.
- Date (interval scale) — shown via position, left to right by day.
- Day-range (interval scale) — shown via brightness, from light blue to dark blue for 1-day, 7-day,
and 30-day.

**Users by Time of Day**

Shows hourly active users by day of week:

- User count (ratio scale) — shown via 4 brightness levels, light to dark.
- Hour of day (ratio scale) — shown via vertical position.
- Day of week (interval scale) — shown via horizontal position.

**Sessions by Country**

Shows visit counts by country:

- Country (nominal scale) — shown via position on a map.
- Visit count (ratio scale) — shown via brightness, light to dark for low to high.
- An alternative view of visit count (ratio scale) uses a bar chart, with bar length representing each
country's percentage share, sorted descending.

**Sessions by Device**

Shows visit counts by device type:

- Device type (nominal scale) — shown via hue: light blue for Desktop, dark blue for Mobile.
- Visit count (ratio scale) — shown via size in a doughnut chart.

Note: judging slice size in a pie chart demands comparing area across two dimensions, requiring extra mental
effort; in practice, comparing arc length alone would suffice, but a solid pie's shape leads viewers to consider
both dimensions anyway. A doughnut chart — a pie chart with its center removed, leaving a hollow ring — is
therefore recommended instead (Wexler, 2017), guiding the viewer to judge only each segment's arc length,
closer to a single dimension along the ring's curve.

As Figure 10.4-1 shows, there's no single fixed rule for each type of visualization — user counts, for instance,
can be shown via bar height or length, line-chart position, or doughnut-chart size. Good design therefore blends
both science and art: readers should understand the fundamentals of data scales and visual encoding, then apply
them to communicate so the audience gets the point quickly, can decide immediately, remembers less, and
stays aligned with natural human perception.

## 10.5 Chapter Summary

Data visualization turns data into images so the audience can perceive, understand, and recognize key issues,
spot trends, and make more accurate, informed decisions. Good visualization relies on human visual perception
to enable instant interpretation without extra mental effort. This chapter covered size, position, and color as
ways to represent ratio, interval, ordinal, and nominal-scale data, and walked through a real example of
visualizing website usage statistics. Since visualization design has no fixed rules, readers should study the
fundamentals and apply them thoughtfully, guided by the principle:

> "Present information so the audience understands it
> accurately, quickly, and usefully for decision-making."

## 10.6 Review Questions

1. Discuss why data visualization is necessary, even though it can't convey information as completely as a table.
2. Discuss why hue shouldn't be used to represent numeric data.
3. Look up "Chord Diagram" online and explain the visual-perception principles behind it.
4. Find a data visualization report you find impressive, explain the visual-perception principles it uses, and give your own critique.
5. Design your own CV (curriculum vitae) using data-visualization principles from this chapter, explaining your design reasoning.
6. Choose and discuss a suitable chart for presenting student counts across faculties of similar size.
7. Choose and discuss a suitable chart for presenting daily rainfall data.
8. Choose and discuss a suitable chart for showing that today's step count falls short of your target, prompting more walking.
9. Design a visualization showing inter-province travel volume during a long holiday weekend.
10. Design a visualization showing available parking spaces on each floor, to help drivers decide which floor to head to.

## 10.7 References

Iliinsky, N., & Steele, J. (2011). Designing Data Visualizations: Representing Informational Relationships.
O'Reilly Media, Inc.

Provost, F., & Fawcett, T. (2013). Data Science for Business: What You Need to Know about Data Mining
and Data-Analytic Thinking. O'Reilly Media, Inc.

Wexler, S., Shaffer, J., & Cotgreave, A. (2017). The Big Book of Dashboards: Visualizing Your Data Using
Real-World Business Scenarios. John Wiley & Sons.

Yang, H., Zhou, H., & Li, Y. (2022, July). A Review of Academic Recommendation Systems Based on
Intelligent Recommendation Algorithms. In 2022 7th International Conference on Image, Vision and
Computing (ICIVC) (pp. 958–962). IEEE.
