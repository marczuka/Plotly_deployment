function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector.append("option").text(sample).property("value", sample);
      });
      buildMetadata(sampleNames[0]);
      buildCharts(sampleNames[0]);
    })
}

function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      
      PANEL.html("");
      Object.entries(result).forEach(([key, value]) => {
          //console.log(key + ': ' + value);
          PANEL.append("h5").text(key + ': ' + value);
        });
    });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      // The data for the chart: the top 10 bacterial species (OTUs)
      var otuIDs = result.otu_ids.slice(0, 10).reverse();
      var sampleValues = result.sample_values.slice(0, 10).reverse();
      var labels = result.otu_labels.slice(0, 10).reverse();

      // Create bar plot 
      var trace = {
          x: sampleValues,
          y: otuIDs.map((id) => "OTU " + id),
          text: labels,
          type: "bar",
          orientation: "h"
      }

      var layout = {
        title: "Top 10 bacterial species in the belly button"
      }

      Plotly.newPlot("bar", [trace], layout);

      console.log("otu_ids: " + otuIDs);
      console.log("sample_values: " + sampleValues);
      console.log("lables: " + labels);

      // Create scatter plot
      var trace1 = {
        x: otuIDs,
        y: sampleValues,
        text: labels,
        mode: 'markers',
        marker: {
          color: otuIDs.map((value) => value - 800),
          size: sampleValues.map((value) => value)
        }
      };

      var layout1 = {
        xaxis: { title: "OTU IDs"}
      }

      Plotly.newPlot("bubble", [trace1], layout1);
  })
}

init();