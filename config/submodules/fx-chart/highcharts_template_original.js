/*global define*/
define(function () {

    'use strict';

    return {

        //Line chart
        chart: {
            events: {},

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
                    x: -10 //Posizione del pulsante rispetto all'allineamento (valori positivi > destra) e al PLOT

                },
                theme: {
                    fill: '#FFFFFF', //Colore di background pulsante reset zoom
                    stroke: '#666666', //Colore di stroke pulsante reset zoom
                    width: 60, //Larghezza del pulsante reset
                    //r:0, //Smusso pulsante reset zoom
                    style: {
                        textAlign: 'center', //CSS style aggiunto da me per centrare il testo
                        fontSize: 10
                    },
                    states: {
                        hover: {
                            fill: '#e6e6e6', //Colore di background hover pulsante reset zoom
                            stroke: '#666666', //Colore di stroke hover pulsante reset zoom
                            style: {
                                //color: 'white' //Colore testo hover pulsante reset zoom
                            }
                        }
                    }
                }

            }
        },
        colors: [ //Colori delle charts

            '#0D6CAC',
            '#D5E4EB',
            '#356B76',
            '#5895BE',
            '#e19a0e',
            '#bf4343'
        ],
        credits: {
            enabled: false //Attiva o disattiva il link di HighCharts dalla chart
        },
        exporting: {
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
            buttonOptions: {
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
              // y: -22
            }
/*            buttonOptions: {
                theme: {
                    'stroke-width': 1, // Peso stroke del bottone
                    stroke: '#666666', // Colore stroke del bottone
                    r: 0, // Smusso stroke del bottone,
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
                color: '#666666',
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
                inactiveColor: '#666666', //Colore freccia disattiva legenda
                arrowSize: 8, //Dimensioni freccia
                animation: true, //Attiva/Disattiva animazione
                style: { //Stile CSS applicato solo alla navigazione della legenda
                    color: '#666666',
                    fontSize: '10px'
                }
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return '<b>' + this.point.name + '</b><br>' + Math.round(parseFloat(this.percentage).toFixed(1) * 100) / 100 + ' %';
                    }
                },
                showInLegend: true
            },
            series: {
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
                    color: '#666666',
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
                    color: '#666666',
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