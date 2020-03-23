# Datasets

The main dataset is that provided by Johns Hopkins University in their github repo [COVID-19][github-covid19-jhu]. 
Other datasets can be added to the cluster and combined for a more complete picture of the situation.

## Overview

The following datasets are currently available:

- JHU CSSE Timeseries data: [jhu_csse][jhu_csse-dataset]
- Country population, area and density data: [population][population-dataset]


## Steps to add a new dataset

1. Create a subfolder here
2. Add a `README.md` file describing the dataset
3. Tag your PR with the "Dataset" label

The README should have at least a `Schema` and `Data Import` section (see existing datasets for examples). 

### Static Data

Static datasets (ones that don't change over time) that are not too big can be added as .csv or .json directly
into this github repo. If they are too large or cannot be included here, an import script (see dynamic data) can be provided instead. 

To transform and clean static datasets, first import them into the cluster with a different name, e.g. `<dataset>_original`. Then provide an aggregation pipeline that addresses the issues in the data. Use a [$out][dollar-out] stage as the final stage in the aggregation and write it to the intended collection name `<dataset>`. See the [population][population-dataset] dataset as an example of a static dataset. 

### Changing Data

Datasets that change over time and warrant frequent updates should have an `import.js` script in the folder to import and clean the data. The import script should write the data directly into the cluster under the `covid19` database. See the [jhu_csse][jhu_csse-dataset] dataset as an example of changing data that requires frequent updates.



[github-covid19-jhu]: https://github.com/CSSEGISandData/COVID-19
[dollar-out]: https://docs.mongodb.com/manual/reference/operator/aggregation/out/index.html

[jhu_csse-dataset]: (./datasets/jhu_csse)
[population-dataset]: (./datasets/population)
