/*global define*/
define(function () {

    'use strict';

    return {

        // GOOGLE ANALYTICS BINDINGS

        // centralized download export
        /* global interaction events */
        download: {
            category: 'download',
            action: {
                preview_table: 'preview',
                download_table: 'download',
                preview_pivot: 'download',
                download_pivot: 'download'
            },
            label: {
                // section should be derived from the page viewed
                section: '', //i.e. browse_by_domain/download_interactive from ChaplinJS etc
            } //domain code
        },


        /* specificic to the different sections */

        /* interactive_download */
        interactive_download: {

            table_preview: {

                category: 'data',
                action: 'table_preview',
                label: '' //domain_codes

            },

            table_download_csv: {

                category: 'data',
                action: 'table_download_csv',
                label: '' //domain_codes

            },

            pivot_preview: {

                category: 'data',
                action: 'pivot_preview',
                label: '' //domain_codes

            },

            pivot_download: {

                category: 'data',
                action: 'pivot_download',
                label: '' //domain_codes

            }

        },

        /* download section (both groups display that downlaod section */
        data: {

            // to track if the left side are used
            selection_metadata: {
                category: 'data',
                action: 'selection',
                label: 'matadata'
            },

            // to track if the left side are used
            selection_interactive_download: {
                category: 'data',
                action: 'selection',
                label: 'interactive_download'
            },

            selection_back_to_domains: {
                category: 'data',
                action: 'selection',
                label: 'back_to_domains'
            },

            selection_show_more: {
                category: 'data',
                action: 'selection',
                label: 'back_to_domains'
            }

        },

        /* report */
        report: {

        },



        /******************** FATTI *******/

        download_bulk: {

            download: {
                category: 'download_bulk',
                action: 'download',
                label: '' //filename
            }
        },

        /* related documents */ 
        documents: {

            download: {
                category: 'documents',
                action: 'download',
                label: '' //filename
            }

        },

        /* metadata */
        metadata: {

            download_csv: {
                category: 'metadata',
                action: 'download_csv',
                label: '' //code
            }

        },

        /* methodos and standards specific tracking */
        methodology: {
            selection: {
                category: 'methodology',
                action: 'methodology_selection',
                label: '' //code
            }
        },

        classifications: {

            selection: {
                category: 'classifications',
                action: 'classifications_selection',
                label: '' //code
            },

            download: {
                category: 'classifications',
                action: 'download',
                label: '' //code
            }

        },

        abbreviations: {

            download: {
                category: 'abbreviations',
                action: 'download',
                label: ''
            }
            
        },

        glossary: {

            download: {
                category: 'glossary',
                action: 'download',
                label: ''
            }
            
        },

        units: {

            download: {
                category: 'glossary',
                action: 'download',
                label: ''
            }

        },

        /* search */
        search: {

            // tracking query
            query: {
                category: 'search',
                action: 'query',
                label: '' //text searched
            },

            // tracking the downloads on the search page
            download: {
                category: 'search',
                action: 'download',
                label: '' // filter object
            }

            /*
            
            // the link now is in the anchor
             
            go_to_browse: {
                category: 'search',
                action: 'go_to_browse',
                label: '' // url
            },

            go_to_download: {
                category: 'search',
                action: 'go_to_download',
                label: '' // url
            }
            */
        },

        /* compare */
        compare: {

            add_filter: {
                category: 'compare',
                action: 'add_filter',
                label: ''
            },

            remove_filter: {
                category: 'compare',
                action: 'remove_filter',
                label: ''
            },

            compare_data: {
                category: 'compare',
                action: 'compare_data',
                label: {
                    codes: []
                }
            }

        }

    };
});