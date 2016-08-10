/*global define*/
define(function () {

    'use strict';

    return {

        // GOOGLE ANALYTICS BINDINGS

        // centralized download export
        /* global interaction events */

        site: {

            // to track if the left side are used
            select_google_form: {
                category: 'google_form',
                action: 'clicked'
            },

            select_jira_collector: {
                category: 'jira_collector',
                action: 'clicked'
            },

            faostat_bulk_downloads_zip: {
                category: 'faostat_full_bulk_downloads_zip',
                action: 'downloaded'
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


        /* specificic to the different sections */


        /****** ALREADY MAPPED *******/

        /* global export csv */
        export: {

            data: {

                category: 'export',
                action: 'export_data',
                label: '' // json request and timing query

            }

        },
        
        /* interactive_download */
        interactive_download: {

            table_preview: {

                category: 'interactive_download',
                action: 'table_preview',
                label: '' //domain_codes, if queryPassed

            },

            table_download_csv: {

                category: 'interactive_download',
                action: 'table_download_csv',
                label: '' //domain_codes

            },

            table_query_size: {

                category: 'interactive_download',
                action: 'table_query_size',
                label: '' //domain_codes

            },

            pivot_preview: {

                category: 'interactive_download',
                action: 'pivot_preview',
                label: '' //domain_codes

            },

            pivot_download: {

                category: 'interactive_download',
                action: 'pivot_download',
                label: '' //domain_codes

            },

            pivot_query_size: {

                category: 'interactive_download',
                action: 'pivot_query_size',
                label: '' //domain_codes

            }

        },

        /* report */
        report: {

            preview: {
                category: 'report',
                action: 'preview',
                label: '' //code
            },

            download: {
                category: 'report',
                action: 'download',
                label: '' //code
            }
            
        },

        /* browse by domain */
        browse_by_domain: {

            selection_change: {
                category: 'browse_by_domain',
                action: 'selection',
                label: 'change' //type?
            }

        },

        /* bulk downloads (currently on the "data" caret) */
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

        /* definitions and standards section*/
        definitions: {
            selection: {
                category: 'definitions',
                action: 'selection',
                label: '' //code
            },
            download: {
                category: 'definitions',
                action: 'download',
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