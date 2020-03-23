# COVID-19 Data & Visualization

### Data collection, processing and visualization of COVID-19.

This project started as a simple [MongoDB Charts dashboard][public-dashboard] (full disclosure, I work on MongoDB Charts) to track and visualise the [data][github-covid19-jhu] made available by Johns Hopkins University. 

Given the rapid escalation of the situation, I want to dedicate some time and extend this to collect additional datasets from different sources and make them available for visualization. 

## Data

The data is currently imported once daily with a manual script that I run. The data is stored in a MongoDB Atlas cluster and used as a data source for the dashboard. 

I'd like to add additional relevant datasets to get a comprehensive view of the situation unfolding. This can include additional information about the infections themselves (age, gender, other circumstances) as well as other secondary information that might be helpful and interesting in this context. I've already added a collection with population, area and density information at a country level. This allows for visualizations showing relative infection rates based on population. 

## Contributors

I welcome any contributions, part of the work ahead will actually be to figure out how people can contribute in meaningful ways. Please let me know if you're interested and we can work something out. 

## Usage as a consumer of the data

If you are interested in accessing the MongoDB cluster directly for your own projects, I can provide a read-only user account. Let me know. 

If you'd like to create your own charts (they can also be embedded in websites) or dashboards, I can send you an invitation to the MongoDB Atlas project. 


## Links / Resources

- [Public Coronavirus dashboard][public-dashboard]
- [JHU Github Repo][github-covid19-jhu]


[public-dashboard]: https://charts.mongodb.com/charts-coronavirus-dashboard-yamfx/public/dashboards/4b328ffa-ba5d-435e-af11-b39fc974e47a
[github-covid19-jhu]: https://github.com/CSSEGISandData/COVID-19

