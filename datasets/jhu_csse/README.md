# Johns Hopkins University Data

The main dataset currently driving the dashboard is the one published and updated daily by Johns Hopkins University, available on the github page https://github.com/CSSEGISandData/2019-nCoV.

They offer a number of different files: 
- [WHO timeseries data][who-timeseries]
- [CSSE daily reports][csse-daily-reports]
- [CSSE timeseries data][csse-daily-reports]

Right now the import script only considers the CSSE timeseries data, and only the `time_series_19-covid-Confirmed.csv`, `time_series_19-covid-Deaths.csv` and `time_series_19-covid-Recovered.csv` files.
An [announcement on their repo][data-change-announcement] was made recently to introduce some changes. [Issue #1](https://github.com/rueckstiess/covid-19/issues/1) is going to deal with these changes.

In the future, we should also consider what other data from the JHU repo might be of interest, e.g. the daily reports. 

## Schema 

The data is stored in the `coronavirus_thomas.statistics` collection with the following schema: 

- `_id`: ObjectID
- `Province/State`: String
- `Country/Region`: String
- `Lat`: Number
- `Long`: Number
- `date`: Date
- `confirmed`: Number
- `dead`: Number
- `recovered`: Number
- `importDate`: Date (this field is added by the import script)


[who-timeseries]: https://github.com/CSSEGISandData/COVID-19/blob/master/who_covid_19_situation_reports/who_covid_19_sit_rep_time_series/who_covid_19_sit_rep_time_series.csv
[csse-daily-reports]: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_daily_reports
[csse-timeseries]: https://github.com/CSSEGISandData/COVID-19/tree/master/csse_covid_19_data/csse_covid_19_time_series
[data-change-announcement]: https://github.com/CSSEGISandData/COVID-19/issues/1250


## Data Import

Data import is currently manually. To import the data, run the following commands from the `jhu_csse` folder:

1. Install some additional packages used for parsing: `npm install`
2. Clone the COVID-19 repo from JHU: `git clone https://github.com/CSSEGISandData/COVID-19.git`
3. Now run the import script, passing the password as environment variable: `COVID_CLUSTER_PW=<password> node import.js`


