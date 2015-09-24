function renderCharts(creator) {


    // GENERIC
    creator.init({
        model: model,
        adapter: {
            type: "timeserie", // "standard", "pie", "scatter"

            // used just in STAR adapter
            filters: ['Country'],

            // used in init just for MATRIX and FENIX
            xDimensions: ['time'],
            xAxisOrder: 'desc',
            yDimensions: ['Element'],
            valueDimensions: ['value'],
            seriesDimensions: []
        },
        onReady: renderChart1,

        // chart template: TODO: pass the temaplte
        template: {
            title: "Title",
            subtitle: "Subtitle",
            footer: "Footer"
        },

        // creator (i.e. highchart)
        creator: {
            // highcharts overwrite definition (or just a standard chart with the series)
            chartObj: {}
        }
    });

    // STAR
    function renderCharts(creator) {

        console.log(creator);
        creator.render({
            container: "#chart1",
            creator: {
            },
/*            adapter: {
                x_dimension: 'Year',
                y_dimension: 'Region',
                series: [
                    {
                        filters: {
                            'Country': 'BWA',
                        },
                        value: 'NFLoss',
                        name: 'BWA'
                    }
                ]
            }*/
            adapter: {
                xAxis: ['Year'],
                yAxis: ['Region'],
                series: [
                    {
                        filters: {
                            'Country': ['BWA'],
                        },
                        value: 'NFLoss',
                        name: 'BWA'
                    }
                ]
            }
        });
    };




    /** EXAMPLES **/

    // FENIX
    creator.init({
        model: model,
        adapter: {
            type: "timeserie",
            filters: {
                xAxis: 'time',
                yAxis: 'Element',
                value: 'value',
                series: []
            }
        },
        template: {

        },
        creator: {

        },
        onReady: renderChart1
    });


    // MATRIX
    creator.init({
        model: model,
        adapter: {
            xAxis: {
                order: "desc"
            }
        },
        template: {

        },
        creator: {},
        onReady: renderCharts
    });

    // STAR
    creator.init({
        model: model,
        adapter: {
            filters: ['Country'],
            //type: 'timeserie',
            //groupby: ['Country']
        },
        template: {},
        creator: {},
        onReady: renderCharts
    });


};