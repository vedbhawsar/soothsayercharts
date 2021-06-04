# Soothsayer Charts

D3.js charts library for Soothsayer Analytics Inc. 

# Installation

`npm install soothsayercharts`

# Usage

```
import ssCharts from 'soothsayercharts';

const data = () => {return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((name)=>{
            let value = Math.random()
            return {name,value}
        });

ssCharts.barChart({
        element: document.getElementById('barChart'),
        data: data(),
        height: 400,
        width: 400,
        color: "steelblue",
        tooltip:false,
        xAxis:{
            label:"Y Axis"
        },        
        yAxis:{
            label:"Label"
        },
        backgroundColor:"#f4f4f4",
        barPadding: 3,
    });

```

Other functions
`ssCharts.lineChart(options);`
`ssCharts.scatterChart(options);`

# Developer
Soothsayer Analytics Inc., USA