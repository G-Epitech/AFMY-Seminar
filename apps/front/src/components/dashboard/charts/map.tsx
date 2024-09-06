"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { interpolateRgb } from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { DashboardChartProps } from "./utils";

const Countries = [
  {
    name: "France",
    number: 152
  },
  {
    name: "Canada",
    number: 300
  },
  {
    name: "United States",
    number: 200
  },
  {
    name: "Mexico",
    number: 100
  },
  {
    name: "Brazil",
    number: 50
  },
  {
    name: "Argentina",
    number: 20
  },
  {
    name: "Chile",
    number: 90
  },
  {
    name: "South Africa",
    number: 50
  },
  {
    name: "Australia",
    number: 200
  },
  {
    name: "New Zealand",
    number: 75
  },
  {
    name: "China",
    number: 150
  },
  {
    name: "India",
    number: 50
  },
]

const CountriesLabels: { [key: string]: string } = {
  "FRA": "France",
  "CAN": "Canada",
  "USA": "United States",
  "MEX": "Mexico",
  "BRA": "Brazil",
  "ARG": "Argentina",
  "CHL": "Chile",
  "ZAF": "South Africa",
  "AUS": "Australia",
  "NZL": "New Zealand",
  "CHN": "China",
  "IND": "India",
};

const numericScale = scaleLinear()
  .domain([0, 300])
  .range([0, 1]);

const colorInterpolator = interpolateRgb("#FFFFFF", "#FFA500");

function getColor(value: number) {
  const numericValue = numericScale(value);
  return colorInterpolator(numericValue);
}

export default function DashboardChartMap(
  { statistics }: DashboardChartProps
) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <CardTitle>Customers by country</CardTitle>
      </CardHeader>
      <CardContent>
        <ComposableMap>
          <Geographies geography={"/world-map.json"}>
            {({ geographies }) => {
              return geographies.map((geo) => {
                const label = CountriesLabels[geo.id]
                const country = Countries.find((c) => c.name === label)
                const color = country ? (getColor(country.number).toString()) : "#F5F4F6"
                return <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={color}
                  onClick={() => null}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      outline: "none",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              })
            }
            }
          </Geographies>
        </ComposableMap>
        <div className="flex flex-wrap">
          {Countries.map((country) => (
            <div key={country.name} className="flex w-1/2 items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor(country.number).toString() }} />
              <div>{country.name} - {country.number}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
