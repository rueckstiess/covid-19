const _ = require("lodash");
const csv = require("csvtojson");
const MongoClient = require("mongodb").MongoClient;

const password = process.env['COVID_CLUSTER_PW'];

const CONFIRMED_FILE =
  "COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv";
const DEAD_FILE =
  "COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv";
const RECOVERED_FILE =
  "COVID-19/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv";
const MONGO_URI =
  `mongodb+srv://admin:${password}@coronacluster-eydl1.mongodb.net/test?retryWrites=true&w=majority`;
const DATABASE_NAME = "covid19";
const COLLECTION_NAME = "jhu_csse";

// Promises to import CSV files
const promises = [
  csv().fromFile(CONFIRMED_FILE),
  csv().fromFile(DEAD_FILE),
  csv().fromFile(RECOVERED_FILE)
];

Promise.all(promises)
  .then(tables => {
    const docsToInsert = [];
    const importDate = new Date();

    const [confirmed, dead, recovered] = tables;
    const headers = _.keys(confirmed[0]);
    const firstDateColumn = _.findIndex(headers, s => s.startsWith("1"));

    // Go through each row of the three tables in parallel
    for (let rowIdx = 0; rowIdx < confirmed.length; rowIdx++) {
      // get rows from the tables
      const confirmedRow = confirmed[rowIdx];
      const deadRow = dead[rowIdx];
      const recoveredRow = recovered[rowIdx];

      // build base object without dates
      const baseObjectKeys = headers.slice(0, firstDateColumn);
      const baseObjectValues = _.map(baseObjectKeys, key => confirmedRow[key]);
      const doc = _.zipObject(baseObjectKeys, baseObjectValues);
      doc.Lat = parseFloat(doc.Lat, 10);
      doc.Long = parseFloat(doc.Long, 10);

      // for each date column, create a separate object
      for (let colIdx = firstDateColumn; colIdx < headers.length; colIdx++) {
        const docToInsert = _.clone(doc);
        const date = headers[colIdx];
        docToInsert.date = new Date(`${date} UTC`);
        docToInsert.confirmed = parseInt(confirmedRow[date], 10) || 0;
        docToInsert.dead = parseInt(deadRow[date], 10) || 0;
        docToInsert.recovered = parseInt(recoveredRow[date], 10) || 0;
        docToInsert.importDate = importDate;
        // push doc to resulting array
        docsToInsert.push(docToInsert);
      }
    }
    // insert docs to database
    MongoClient.connect(MONGO_URI, { useUnifiedTopology: true }, function(
      err,
      client
    ) {
      if (err) {
        throw err;
      }
      const collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);
      collection
        .drop() // !!! This drops the collection and recreates it !!!
        .catch(err => null)
        .then(() => collection.insertMany(docsToInsert))
        .then(res => {
          console.log(
            `Successfully inserted ${res.result.n} documents into collection.`
          );
          client.close();
        });
    });
  })
  .catch(err => {
    console.log("Error:", err);
  });
