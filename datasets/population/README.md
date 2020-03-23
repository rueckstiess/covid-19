# Population Data

Population data for most countries from 2019, as well as country area and density data was added from this page: https://worldpopulationreview.com/countries/ (direct link to json file above the table, right side).

## Schema

- `Rank`: Number 
- `name`: String
- `pop2019`: String
- `GrowthRate`: String
- `area`: Number
- `Density`: String

## Data Import

mongoimport --uri "mongodb+srv://admin:<password>@coronacluster-eydl1.mongodb.net/covid19" -c population_original population.json --jsonArray --drop

## Transformation

### Type Conversions

The fields `pop2019`, `GrowthRate`, `area` needed to be converted to a numeric type. 

### Value Mapping

#### Country Names

To match up the countries with the `jhu_csse` dataset, the following aggregation shows which country names do not have a match in the `population` dataset and need to be mapped: 

```js
db.statistics.aggregate([
  {
    $lookup: {
        from: 'pop',
        localField: 'Country/Region',
        foreignField: 'name',
        as: 'population'
    }
  },
  {
    $match: {"population": []}
  },
  {
    $group: {
      _id: "$Country/Region"
    }
  }
])
```
This is the mapping: 

- United States --> US
- Taiwan --> Taiwan*
- Swaziland --> Eswatini
- Ivory Coast --> Cote d'Ivoire
- Vatican City --> Holy See
- Macedonia --> North Macedonia
- Cruise Ship
- DR Congo --> Congo (Kinshasa)
- Republic of the Congo --> Congo (Brazzaville)
- South Korea --> Korea, South
- Czech Republic --> Czechia
- Gambia --> Gambia, The
- Bahamas --> Bahamas, The

There doesn't appear to be population information about Kosovo. The `jhu_csse` dataset also tracks `Cruise Ship` as a region, which also doesn't have population information in this dataset available.

#### Population Numbers

In addition to converting the population field `pop2019` to a number, it needs to be multiplied by 1000. 

### Data Cleanup

Using the following aggregation to create a cleaned up collection `population`: 

```js
db.population_original.aggregate([
  {
    $addFields: {
      GrowthRate: {
        $convert: {
          input: "$GrowthRate", to: "double", onError: null
        }
      },
      Density: {
        $convert: {
          input: "$Density", to: "double", onError: null
        }
      },
      pop2019: {
        $multiply: [
          1000,
          {
            $convert: {input: "$pop2019", to: "double", onError: null}
          }
        ]
      },
      name: {
        $switch: {
          branches: [
            { case: {$eq: ["$name", "United States"]}, then: "US" },
            { case: {$eq: ["$name", "Taiwan"]}, then: "Taiwan*" },
            { case: {$eq: ["$name", "Swaziland"]}, then: "Eswatini" },
            { case: {$eq: ["$name", "Ivory Coast"]}, then: "Cote d'Ivoire" },
            { case: {$eq: ["$name", "Vatican City"]}, then: "Holy See" },
            { case: {$eq: ["$name", "Macedonia"]}, then: "North Macedonia" },
            { case: {$eq: ["$name", "DR Congo"]}, then: "Congo (Kinshasa)" },
            { case: {$eq: ["$name", "Republic of the Congo"]}, then: "Congo (Brazzaville)" },
            { case: {$eq: ["$name", "South Korea"]}, then: "Korea, South" },
            { case: {$eq: ["$name", "Czech Republic"]}, then: "Czechia" },
            { case: {$eq: ["$name", "Gambia"]}, then: "Gambia, The" },
            { case: {$eq: ["$name", "Bahamas"]}, then: "Bahamas, The" },
          ],
          default: "$name"
        }
      }
    }
  }, 
  {
    $out: "population"
  }
])
```



