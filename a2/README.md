# EDA of McDonalds Nutrition Facts

[McDonalds NutritionFacts data source](https://github.com/pffy/data-mcdonalds-nutritionfacts)

About the data:

The first thing I wanted to know about this dataset was: *what kind of items does McDonald’s serve the most?* I answered this question by visualizing the total number of items for each McDonalds category. Before this, I took a look at the data to see what kinds of categories were included. Because I had some prior knowledge of McDonalds items, I decided to stick to main food categories that were of interest for comparison and excluded these:

1. ADBISCUIT
2. ADBMUFFIN
3. ALLDAYBREAKFAST
4. BEVERAGE
5. CONDIMENT
6. MCPICK2A
7. MCPICK2B
8. MCPICK2C

> Sheet 1

After looking at the category distribution, I noticed that SALAD only had 1 item in its category! I decided to look at the data source and search for the keyword “salad” to see what was up. From a portion of the table below, you can see that salads were categorized in different categories such as “CHICKEN” and/or “BREAKFAST.” We can determine from this that a limitation to the dataset is that items that perhaps belong to multiple categories won’t be represented as such. Because of this, I decided to also exclude SALAD from our analysis.

*Is there a relationship between the nutrition types by category?* There are a lot of nutrition types in the dataset, so I wanted to take a quick view of some of them on a scatterplot matrix to see what interesting variable relationships come up.

> Sheet 2

From the scatterplot matrix, you can notice that there is a lot of CHICKEN items that deviate from the rest of the categories in many of the nutrition types. CHICKEN and BREAKFAST were really making their debut in cholesterol as well. Because we were seeing quite the divide for CHICKEN in calories, salt, and fat, I wanted to take a closer look for these three nutrition types. Thus, I tried to answer the question: *what is the relationship between calories, fat, and salt for the McDonalds food categories?*

> Sheet 3

As we observed before, we see multiple items from the CHICKEN category containing high volumes of calories, salt, and fat, though the difference in fat between CHICKEN and other calories isn’t as high relative to the other two. We also see one burger item as an outlier for fat, the “Double Bacon Smokehouse Burger on Artisan Roll (Fresh Beef).”

Seeing these outliers made me wonder if these items were an accurate representation of the categories, so I made the same scatterplot but aggregated it to answer the question *what is the relationship between calories, fat, and salt for the McDonalds food category items on average?*

> Sheet 4

From this visualization, we can observe that CHICKEN, SIGNATURE, and BURGER appear to have a high balance of calories, salt, and fat. SIGNATURE did not have any of the outliers mentioned before, but it is the category with the highest calories and fat on average! This was an interesting discovery. Upon looking at the individual items more closely, we see that the CHICKEN outliers had higher values because of the portion size of the item. This shows to be a huge limitation to our dataset and because of varying sizes, categories like CHICKEN may not be accurately represented in terms of nutrition. I discuss more on limitations at the end of this document.

I’ve analyzed these 3 variables (calories, salt, fat) by category, but now I’m curious if the other nutrition types can tell me something. I ask a broad question again to start analyzing this: *what is the distribution of nutrition types and amounts for McDonalds items?*

To be able to compare all the nutrition types together on Tableau, I had to transform the data. I pivoted all the nutrition columns into rows so that each item had a row for each nutrition type. After that, I could make aggregations comparing each nutrition type along with each category.

> Sheet 5

> Sheet 6

I see the average gram values for all of the nutrition types but it doesn’t tell me much because we cannot compare the amounts of each nutrition type with different scales. To standardize this, I want to know how this compares to the daily suggested intake.

* /As Specified by the FDA Based on a 2,000 Calorie Intake for Adults and Children 4 or More Years of Age./

* Source: [GUIDE TO NUTRITION LABELING AND EDUCATION ACT (NLEA) REQUIREMENTS-ATTACHMENT 6-8](https://www.fda.gov/ICECI/Inspections/%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20InspectionGuides/ucm114098.htm#ATTACHMENT_8)

After this transformation, I want to see how the nutrition types compare to each other now. *What is the average nutrition percentage of daily intake of each nutrition type for McDonalds items?*

> Sheet 7 (Same as sheet 5?)

*How many McDonalds items go above the suggested daily intake for each nutrition type?*

> Sheet 8