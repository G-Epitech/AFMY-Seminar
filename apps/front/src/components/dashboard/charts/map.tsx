"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { interpolateRgb } from "d3-interpolate";
import { scaleLinear } from "d3-scale";
import React from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { DashboardChartProps } from "./utils";

const colorInterpolator = interpolateRgb("#FFE500", "#FFA500");

export default function DashboardChartMap(
  { statistics }: DashboardChartProps
) {
  const numericScale = scaleLinear()
    .domain([0, statistics.customers.count]);

  const getColor = (value: number) => {
    const numericValue = numericScale(value);
    return colorInterpolator(numericValue);
  }
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
                const country = statistics.customers.countries.find((c) => c.country === geo.properties.name);
                const color = country ? (getColor(country.count).toString()) : "#F5F4F6"
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
          {statistics.customers.countries.map((country) => (
            <div key={country.country} className="flex w-1/2 items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getColor(country.count).toString() }} />
              <div>{country.country} - {country.count}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
