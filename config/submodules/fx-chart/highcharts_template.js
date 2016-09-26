/*global define*/
define(['moment'],function (moment) {

    'use strict';

    // Export Client 
    // http://www.highcharts.com/plugin-registry/single/37/highcharts-export-clientside
    // http://jsfiddle.net/pscjzhe4/1/

    return {

        //Line chart
        chart: {
            events: {
                // water mark
                /*    load: function() {
                    this.renderer.image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMYAAAAqCAMAAADfw9SWAAAAolBMVEX///8XTHTd4+kAPGoARG8TSnMAN2cAOmkiV30AQGz4+fr7/PwmU3nq7fDU2uAsX4SUqbtjhJ+uucbZ4ukAM2Vqgprx9PcAR3K4xdDP1t3Q2+NGbIyar8Baf5vX3+Xj6e47ZIZtjqfE0dtRc5G0xNF9mrCOqLuitsaIn7NReZdBZ4dsjaZ5kKYALGHBydJ0lKwAJV4ALmI3aIpdg59ie5UAHlrG8NFHAAAI1UlEQVRogdVZ25qiOBAmkCjhYADbBDkIBhAUxp7tcd//1TYJoEDbOzNX/VkX3ZDEUH+dK9G0KVkufy9MICn2g4xqr0g07ACGgrAg+TcN9O/m6e/p2goQhpM2yfUaeD4RSFicWN/N1t8RbR3IwC9OqS1fbYvqDWAQFdF3c/Y3FDGM8gtXz1u/rRUWmuYAwhdSSOgwh5VBol5Oa/yhvHtTRcRERmN/K29/TlfCcON5bprJt8LJsXqoAu5fIYPea+DYA8a8zs1trxZvWzNuVvIhi+kuCv0CMu+7OfwTogyh0vI3J++QCmOq2YnjWIxX9T61zlGWQxYuf6MvacwxmXxxl8stnSfHtj2F+iIXufq+roP9OJx92lfPxh3GXb9YY7cYCXEHnpB+V2pah3cNQLamE+oFUappHCCyZIyYcyJ8+IaaSBfMRg0xVEYyQFtOIgYNU7AS9Ga2oRpuHXNJcb80JGbX//L8aYmZygUO9MVnD2crLXmu6QV8+wcyrjWVW7itwKUlGFcLGA6akzPoqzbkG9zMFicEItATgmB3Fwmt2Npsk8Tz4Rq0EvrRJD0xND6d+6Udhnkf+38NEwSh8emXUOsNEjXf1dy3Cs6ZqdmdUbkxTZool95NfQgW6cMZ+RpohGGqcXicrk2ZHESICeOVk5dhL8EaGHRjV2JYPNoD0bWxH1/Ugo1Jclz3a4dh1zD0x5oQwEZN85yeOY8Ds6Fune+8yiK8GaYc2D2BwfCdWNlbzyB2PFnaGGIMMVLcbnGPo+jtPVwDfl9VmlONWytjodBVE6yLmWm763X2+EELYRaWgqKYB+82SQ6uXxwOPN6UxTbOsiCpt9YOXg6fYfjBg/odK9YrB5f3lVe5FIGGu657CHIoZ/tMlOJqEskbeNl+CcMi7OA6cP8lDBdB3yIA4pV3ag/ETTotNGCghb4V12F6uMAfOI5KwIJPMNCnOJzFYlgqhPnjEN1JZAYfHPuQShxMlZzIuE5+GzngEQ+XMMJVSu3WaL+EEWIjcokRRlFmO1FzpB+bVpSE9CMMHZryAvtua/hZjqtZTfIcRilNxhP+gczRl64SBTzdl+yJRCpDi7YyZtKNnYekljBiLOb2zJhGwBmMIzSpgLHPMks7NhxQr0ohTOvY3TWbghOTa+7KzHwYZ9N9n8KgHQQI65X4O85ZjZA+iiefbyQuJmVi4tkG2aS/WcDYwljYdFYYyVcwCpgKGCyO8722j7exd8j9c3HKkw3Q3z3uyCi2whsPmzPneArjICTNzvQgzIrdenekH2Ihnn6dy2AGpf002OTac1rAaLCKMB4uvoLhwMZ2iYjAYktaXOuYx8Idc1Z7vmvyyCF7BYMbeGYBCsaUO0k1VixT6SFOz6GL5cIpt1YufUdGwIODyWmrPaM5jCwGZS8BZ7LTDAYS0dglq16fQUFBWzBHZJ/G3Dc3LTOdUjusia4bxicYABoDvSmPlpJHEnYtDAk2ypc2a4EinykyFVbFlHR5IXYAfqnTZS8whxGwi/pv3/Ak7s9gABEuBIzeBA7mpirOghlkVsU2F+mmNW48xR1d+uM8/UEVQrhQBtsJgeylk/f1S4Cla8x64aMAyW69mJMdwcYak/fwMEMyg0G79RAiEhw/tPcZBvi3h2F3fma+XyB0KlKXpiX1ucYr2QH+AYxWurY0NFcG2T51lP8LQ7C4D5szWhs472aWN4UhjG/Iey6axP1PRmW72ZCHSiciTlX5pwuoO1VRUB6EQsBPjeqexVfSqGxwD7SJgIFUMRQqGDOjaqVR7SYsU5cfxVZm/QWMk3EeH1Ps38PZ0sUn6rRj34e4CxnLK2cqw2cuDqpsO5CUVi15j11ZNwfykOhNftA1pLZmAekyuviMyhiCR+qfwqAmDobiPKsxvIvkU8Cd7Jbkop5wcoSKLh0Tr5w//Tbg2jeZENBaEgZjznNVeJ1WAJHKf0Ly1J25g8iw6b1mmsIoDWS8DWQgeBfAMv1NCy4K3mMmrAM2ZCgN6DHqAi39bfpT7E0JFZYsjqUJpROGE1EeItkkd7dy+nuhcOcuqSmMGAoTGamA4CkMUYxIa4nGLc04EeEWej4ajIjeSPO+/X0x4qliaSQ5rYJ8ILM4fDCsF3LqQzzlq3n6tCdRZAIjYubVtgay98QY91qWhqm2T8Eo7DdkJk1Tn+Gwp6VnbuZ5vy0Ns0K6xm03kMxxSv96rArc0c/cDo4F8FGUa9MtLZFln8Co8G5i9aJHGf19Wagz3fPicJCEiJk42RNhWP0APXaRRttnhfoMxpXNaqfQkK8yyNfSwFheSyCU+xIFVEZWG87M9Wvj4x5UHjCymM2KhRI40RMYom2S/YooAA8q6J4FAFNIdki9GbeCOHzeNk1h2O+PzK2+ITOgOomwVGmOQNF13c1UlkeUhKwBzkB6jrv76wNGgJyZU7rx6ORzGHSnmtis6Hm4iiJIFRqqtbH1j1KzIiHDRe2zhEHVjx79g6Vgqf5atDyqiYUQqgdmDtZdIjieRGhWScZeewaD+njWZEgjG5rHOYz+SEGXyUdGQKsB0jxYqhR8NH+J9Fg/O1KYw0hkIVJMtr0qHagB2gH2iF8wvnMb5tjIm3CzuXr5Cl8mJnaHsQfrRRW8hUN7tYChDnh4qFlhKqVJr7JtUk1pSLO4rctnBzxsbRjrRzOkkZWxXk2xHsSI8U+/wgpFTmXqyARfvMm35cHPSpGAM3U+6+dPBcOufpDFl7X4h1Ky5v78OSty1HGbFt3iY5klgl9KnN46cOu6Xxy3bSS5X7+LCCdHxu/QTeJ/EJJWfGbo8hiuPrZtVe+z+QHrZtP7ib75dMWSbXovtsc1I+0Bg2FUpsJHTqjNtFZE33cztc6+iCXRqxx+qqNo5lnahWpeRW0BQ9cS/xc9dyEPTfgqR9HqYgDtuLDOXEYkCWOTc63OqAde6GJApnwIzSbTVKqRRpUJ46JJwV7qmqa/NIMoVZdmqdCJZekNgK92aaZNrzCJ07zqFab2uFAWeRy+7oWy9sLX+/8B0M7F7JMv47MAAAAASUVORK5CYII=', 80, 40, 143, 57)
                        .add();
                }*/
            },

            type: 'line', //Tipo di grafico:  area, areaspline, boxplot, bubble, column, line, pie, scatter, spline

            alignTicks: false,
            backgroundColor: '#FFFFFF', //Colore di background
            //borderColor: '#3fa8da', //Colore bordo intorno
            //borderWidth: 1, //Spessore bordo intorno
            //borderRadius: 0, //Smusso bordo intorno
            //margin: [5,5,5,5], //Margine intorno (vince sullo spacing)
            //spacing: [20, 1, 1, 1],//Spacing intorno (molto simile al margin - Di default il bottom è 15, qui l'ho messo a 10 per essere uguale agli altri)
            //plotBackgroundColor: 'red', //Colore di background solo area chart
            plotBorderColor: '#ffffff', //Colore bordo intorno solo area chart
            plotBorderWidth: 0, //Spessore bordo intorno solo area chart
            //showAxes: false, //Mostra gli assi quando le serie sono aggiunte dinamicamente
            style: {
                fontFamily: 'FrutigerLTW02-45Light', // Font di tutto
                fontSize: '11px', // La dimensione qui vale solo per i titoli
                fontWeight: 300 // Con Roboto è molto bello giocare con i pesi
            },
            zoomType: 'xy', //Attiva lo zoom e stabilisce in quale dimensione
            //selectionMarkerFill: 'rgba(0,0,0,0.25)',//Colore di fonfo della selezione per lo zoom (trasparente per far vedere sotto)

            resetZoomButton: {
                position: {
                    align: 'right', //Allineamento zoom orizzontale
                    //verticalAlign:'middle' //Allineamento zoom verticale
                    x: -30, //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT
                    y: 0
                },
                theme: {
                    fill: '#FFFFFF', //Colore di background pulsante reset zoom
                    stroke: '#707070', //Colore di stroke pulsante reset zoom
                    width: 60, //Larghezza del pulsante reset
                    //r:0, //Smusso pulsante reset zoom
                    style: {
                        textAlign: 'center', //CSS style aggiunto da me per centrare il testo
                        fontSize: 10
                    },
                    states: {
                        hover: {
                            fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
                            stroke: '#707070', //Colore di stroke hover pulsante reset zoom
                            style: {
                                //color: 'white' //Colore testo hover pulsante reset zoom
                            }
                        }
                    }
                }

            }
        },
        colors: [ //Colori delle charts

           /* '#0D6CAC',
            '#D5E4EB',
            '#356B76',
            '#5895BE',
            '#e19a0e',
            '#bf4343'*/

            /*'#332288',
            '#88CCEE',
            '#44AA99',
            '#117733',
            '#999933',
            '#DDCC77',
            '#CC6677',
            '#882255',
            '#AA4499'*/

           /* '#5cbae6',
            '#b6d957',
            '#fac364',
            '#8cd3ff',
            '#d998cb',
            '#f2d249',
            '#93b9c6',
            '#ccc5a8',
            '#52bacc',
            '#dbdb46',
            '#98aafb',*/

            //http://there4.io/2012/05/02/google-chart-color-list/
            // Google Charts Palette (original)
            /*'#3366CC',
            '#DC3912',
            '#FF9900',
            '#109618',
            '#990099',
            '#3B3EAC',
            '#0099C6',
            '#DD4477',
            '#66AA00',
            '#B82E2E',
            '#316395',
            '#994499',
            '#22AA99',
            '#AAAA11',
            '#6633CC',
            '#E67300',
            '#8B0707',
            '#329262',
            '#5574A6',
            '#3B3EAC',*/

            // Google Charts Palette (Modified)
            // https://material.google.com/style/color.html#color-color-palette
            // modified chaning the color to the "700" one
            '#1976D2', //'#3366CC',
            '#D32F2F', //'#DC3912',
            '#FFA000', //'#FF9900',
            '#388E3C', //'#109618',
            '#5E35B1', // used 600 //'#512DA8' (700), //'#990099',
            '#303F9F', //'#3B3EAC',
            '#0099C6',
            '#DD4477',
            '#66AA00',
            '#B82E2E',
            '#316395',
            '#994499',
            '#22AA99',
            '#AAAA11',
            '#6633CC',
            '#E67300',
            '#8B0707',
            '#329262',
            '#5574A6',
            '#3B3EAC',


            // Google Charts Palette (Modified)
            // https://material.google.com/style/color.html#color-color-palette
            // modified chaning the color to the "500" one
            /*'#2196F3', //'#3366CC',
            '#F44336', //'#DC3912',
            '#FFC107', //'#FF9900',
            '#4CAF50', //'#109618',
            '#673AB7', //'#990099',
            '#3F51B5', //'#3B3EAC',
            '#0099C6',
            '#DD4477',
            '#66AA00',
            '#B82E2E',
            '#316395',
            '#994499',
            '#22AA99',
            '#AAAA11',
            '#6633CC',
            '#E67300',
            '#8B0707',
            '#329262',
            '#5574A6',
            '#3B3EAC',*/

        ],
        credits: {
            enabled: false //Attiva o disattiva il link di HighCharts dalla chart
        },
        exporting: {
            enabled: true,
            chartOptions:{
                title: {
                    enabled: true
                },
                subtitle: {
                    enabled: true
                },
                legend:{
                    enabled:true
                },
                credits: {
                    enabled: true,
                    text: "Source: FAOSTAT ("  + moment(new Date()).format("MMM DD, YYYY") + ")",
                    style: {
                        fontSize: '7px'
                    }
                }
            }
           /* buttons: {
                contextButton: {
                    menuItems: [{
                        textKey: 'downloadPNG',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        textKey: 'downloadJPEG',
                        onclick: function () {
                            this.exportChart({
                                type: 'image/jpeg'
                            });
                        }
                    }]
                }
            }*/
        },
        navigation: { //Modifica lo stile dei bottoni e spesso del solo bottone dell'esportazione (lo sfondo)
            /*buttonOptions: {
                theme: {
                    'zIndex': '3',
                    'stroke-width': 1, // Peso stroke del bottone
                    stroke: '#666666', // Colore stroke del bottone
                    r: 2, // Smusso stroke del bottone,
                    states: {
                        hover: {
                            stroke: '#666666', // Press stroke del bottone
                            fill: '#e6e6e6' // Rollover del bottone
                        },
                        select: {
                            stroke: '#666666', // Press stroke del bottone
                            fill: '#e6e6e6' // Press Fill del bottone
                        }
                    }
                }

            }*/
            menuStyle: {
                border: '1px solid #A0A0A0',
                background: '#FFFFFF',
                padding: '5px 0'
            },
            menuItemStyle: {
                padding: '0 10px',
                background: null,
                color: '#303030',
                fontSize: '11px'
            },
            menuItemHoverStyle: {
                background: '#4572A5',
                color: '#FFFFFF'
            },

            buttonOptions: {
                //x: 0,
                //y: -10,
                symbolFill: '#E0E0E0',
                symbolSize: 14,
                symbolStroke: '#707070',
                symbolStrokeWidth: 3,
                symbolX: 12.5,
                symbolY: 10.5,
                align: 'right',
                buttonSpacing: 3,
                height: 22,
                // text: null,
                theme: {
                    fill: 'white', // capture hover
                    stroke: 'none',
                },
                verticalAlign: 'top',
                width: 24
            }

        },
        legend: { //Modifica style della legenda
            enabled: true, //Attiva la legenda
            floating: false, // IMPORTANTE - Permette alla plot area di stare sotto alla legenda - si guadagna molto spazio

            //margin: 100, //Margine dell'intero blocco legenda dall'area di PLOT (Solo quando non è floating)
            //padding: 20, //Padding del box legenda (Ingrandisce il box)
            backgroundColor: '#FFFFFF', //Colore di sfondo della legenda
            //layout: 'horizontal', //Tipologia di legenda
            align: 'center', //Allineamento orizzontale del box della legenda (left, center, right)
            verticalAlign: 'bottom', //allineamento verticale della legenda (top, middle, bottom)
            //width: 200, //Larghezza della legenda (Aggiunge Margini e padding)
            //x: -8,//Offset della posizione della legenda rispetto all'allineamento (valori positivi > destra)
            //y: -8,//Offset della posizione della legenda rispetto all'allineamento (valori positivi > verso il basso)
            //maxHeight: 90, //IMPORTANTE - Indica l'altezza massima della legenda, se superata, mostra la paginazione (vedi sotto)
            //borderColor: '#666666', //Colore del bordo della legenda
            borderWidth: 0, //Spessore bordo della legenda
            //borderRadius: 3, //Smusso della legenda
            //itemDistance: 10, //Distanza X degli elementi quando la legenda è in verticale
            //symbolWidth: 20, //Larghezza del simbolo rettangolo quando la legenda ne ha uno (accanto al nome - default 16)
            //symbolHeight: 20, //Altezza del simbolo rettangolo quando la legenda ne ha uno (accanto al nome - default 12)
            //symbolRadius: 3, //Smusso del simbolo rettangolo quando la legenda ne ha uno (default 2)
            symbolPadding: 10, //Distanza tra simbolo e legenda (default 5)
            //itemMarginBottom: 5, //Margine inferiore di ogni elemento della legenda
            //itemMarginTop: 5, //Margine superiore di ogni elemento della legenda
            //lineHeight: 20, //Altezza di ogni elemento della legenda (il valore di default è 16)
            itemStyle: {
                cursor: 'pointer',
                color: '#707070',
                fontSize: '12px',
                fontWeight: 300
            },
            itemHiddenStyle: { //Colore dell'elemento legenda quando è disattivato
                color: '#eeeeee'
            },
            itemHoverStyle: { //Colore dell'elemento legenda in rollover
                color: '#3ca7da'
            },
            navigation: { //Paginazione Legenda - stilizzazione
                activeColor: '#3ca7da', //Colore freccia attiva legenda
                inactiveColor: '#707070', //Colore freccia disattiva legenda
                arrowSize: 8, //Dimensioni freccia
                animation: true, //Attiva/Disattiva animazione
                style: { //Stile CSS applicato solo alla navigazione della legenda
                    color: '#707070',
                    fontSize: '10px'
                }
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                color: '#707070',
                dataLabels: {
                    enabled: true,
                    color: '#707070',
                    formatter: function () {
                        var maxLength = 40,
                            name = (this.point.name.length <= maxLength)? this.point.name : this.point.name.substring(0, maxLength) + "...";
                        return '<b>' + name + '</b><br>' + Math.round(parseFloat(this.percentage).toFixed(1) * 100) / 100 + ' %';
                        //return '<b>' + this.point.name + '</b><br>' + Math.round(parseFloat(this.percentage).toFixed(1) * 100) / 100 + ' %';
                    }
                },
                showInLegend: true
            },
            series: {
                fillOpacity: 0.65,
                allowPointSelect: true, //Permette di selezionare i punti della chart
                animation: { // Configura l'animazione di entrata
                    duration: 1000,
                    easing: 'swing'
                },
                connectNulls: false,
                cropThreshold: 3,
                lineWidth: 1, // IMPORTANTE - Cambia lo spessore delle linee della chart
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    enabled: true, //Attiva o disattiva i marker
                    symbol: 'circle', // Tipologia di marker
                    radius: 3,
                    lineWidth: 1,
                    //lineColor: '#379bcd',
                    //fillColor: '#FFFFFF',
                    states: {
                        hover: {
                            enabled: true, // Attiva o disattiva il marker quando si passa sopra la chart
                            symbol: 'circle',
                            //fillColor: '#FFFFFF',
                            //lineColor: '#3ca7da',
                            radius: 4,
                            lineWidth: 2
                        }
                    }
                }
            }
        },

        title: {
            enabled: false,
            text: '',
            x: -20 //center
        },
        subtitle: {
            enabled: false,
            text: '',
            x: -20
        },
        xAxis: {
            //gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
            lineColor: '#e0e0e0',
            tickColor: '#e0e0e0',
            gridLineColor: '#eeeeee',
            tickLength: 7,
            //tickmarkPlacement: 'on', Per partire dall'origine
            labels: {
                y: 25,
                style: {
                    color: '#707070',
                    fontWeight: '300',
                    fontSize: 11
                }
            },
            //type: 'datetime',
            /*            dateTimeLabelFormats: { // don't display the dummy year
             //month: '%e. %b',
             year: '%Y'
             },*/
            title: {
                enabled: false,
                text: 'null'
            }
        },
        yAxis: {
            //gridLineWidth: 1, // IMPORTANTE - Attiva le linee verticali
            lineWidth: 1,
            //tickWidth: 1,
            lineColor: '#e0e0e0',
            gridLineColor: '#eeeeee',
            labels: {
                style: {
                    color: '#707070',
                    fontWeight: '300',
                    fontSize: 12
                }
            },
            //min: 0,

            title: {
                enabled: false,
                text: 'null'
            },
            /*            plotLines: [
             {
             value: 0,
             width: 1
             }
             ]*/
        },
        tooltip: {
            //valueSuffix: '',
            // backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderWidth: 1,
            shadow: true,
            crosshairs: "mixed",
            shared: true
        }

    };
});