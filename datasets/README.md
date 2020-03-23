# Datasets

The main dataset is that provided by Johns Hopkins University in their github repo [COVID-19][github-covid19-jhu]. 
Other datasets can be added to the cluster and combined for a more complete picture of the situation.

## Overview

The following datasets are currently available:

- JHU CSSE Timeseries data: [jhu_csse](./datasets/jhu_csse)
- Country population, area and density data: [population](./datasets/population)


## Steps to add a new dataset

1. Create a subfolder here
2. Add a `README.md` file describing the dataset
3. Tag your PR with the "Dataset" label

The README should have at least a `Schema` and `Data Import` section (see existing datasets for examples). 
Static datasets (ones that don't change over time) that are not too big can be added as .csv or .json directly
into this github repo. Changing datasets should have an `import.js` script in the folder to import and clean the data.



[github-covid19-jhu]: https://github.com/CSSEGISandData/COVID-19
