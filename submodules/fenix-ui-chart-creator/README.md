[![Stories in Progress](https://badge.waffle.io/FENIX-Platform/fenix-ui-chart-creator.svg?label=in%20Progress&title=In%20Progress)](http://waffle.io/FENIX-Platform/fenix-ui-chart-creator)

# FENIX Chart Creator

## Configuration

### General
`
{
    "model" : Object,
    "container" : CSS3 selector | HTML DOM Element Object,
    "adapter" : Object,
    "template" : Object,
}
`

### Model
It depends on the adapter selected.

### Adapter
`
{
    "id" : String //ID of the selected adapter. Default: "d3s_highcharts",
    "options" : Object //Specific internal library configuration. E.g, if the adapter is "d3s_highcharts", it contains the specific Highcharts configuration.
}
`
ID currently supported:
* d3s_highcharts

### Adapter
`
{
   "id" : String //ID of the selected template. Default: "base_template"
}
`
ID currently supported:
* base_template
