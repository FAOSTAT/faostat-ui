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

            select_feedback_system: {
                category: 'feedback_system',
                action: 'clicked'
            },

            select_jira_collector: {
                category: 'jira_collector',
                action: 'clicked'
            },

            faostat_bulk_downloads_zip: {
                category: 'faostat_full_bulk_downloads_zip',
                action: 'downloaded'
            },

            change_language: {
                category: 'change_language',
                action: '' //language changed
            }

        },

        /* download section (both groups display that downlaod section */
        data_domain_list_page: {

            select_a_domain: {
                category: 'data_domain_list_page',
                action: 'domain_selection',
                label: '' //domain_code
            },

            search_a_domain: {
                category: 'data_domain_list_page',
                action: 'domain_search', //label searched
                label: '' //label typed
            }

        },

        data_domain_specific_page: {

            selection_metadata: {
                category: 'data',
                action: 'selection_metadata',
                label: '' // domain_code
            },

            selection_definitions: {
                category: 'data',
                action: 'selection_definitions',
                label: '' // domain_code
            },

            // TODO: not used yet
            selection_back_to_domains: {
                category: 'data',
                action: 'selection_back_to_domains',
                label: null
            },

            open_domain_tree: {
                category: 'data',
                action: 'domain_tree_open',
                label: null
            },

            select_domain_in_tree: {
                category: 'data',
                action: 'domain_tree',
                label: null // 'domain_code
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

        onboarding: {

            category: 'onboarding',
            action: '', // section
            label: '' //domain_code

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
            },

            selection_tab: {
                category: 'browse_by_domain',
                action: 'selection_tab',
                label: '' // view-code
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
            selection_types: {
                category: 'definitions_types',
                action: 'selection',
                label: '' //code
            },
            download_types: {
                category: 'definitions_types',
                action: 'download',
                label: '' //code
            },
            selection_domain: {
                category: 'definitions_domain',
                action: 'selection_domain',
                label: '' //code
            },
            selection_domain_type: {
                category: 'definitions_domain',
                action: 'selection_domain_type',
                label: '' //code
            },
            download_domain: {
                category: 'definitions_domain',
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

        },

        external_link: {
            category: 'external_link',
            action: 'selection',
            label: '' //  e.g. 'all_fao_menu', 'development_goals', 'statistical_yearbook'
        },

        internal_link: {
            category: 'internal_link',
            action: 'selection',
            label: '' //  e.g. 'country_indicators', 'rankings'
        },

        home: {
            database_updates: {
                category: 'database_updates',
                action: 'selection',
                label: '' // url
            }
        },

        error: {
            "404": {
                category: 'error',
                action: '404',
                label: '' // page
            }
        }

    };
});