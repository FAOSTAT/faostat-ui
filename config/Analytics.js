/*global define*/
define(function () {

    'use strict';

    return {

        // GOOGLE ANALYTICS BINDINGS
        ANALYTICS: {

            // categories
            download: {
                category: 'download',
                action: {
                    preview: 'preview',
                    download: 'download',
                },
                label: {
                    section: '', //i.e. browse_by_domain/download_interactive from ChaplinJS etc
                } //domain code
            },

            download_bulk: {
                category: 'download_bulk',
                action: {
                    download: 'download'
                },
                label: {
                    filename: '',
                    section: ''
                }
            },

            browse_data: {
                category: 'browse_data',
                action: {
                    change_selection: 'change_selection'
                },
                label: '' // type? domain code? code changed?
            },

            metadata: {
                category: 'metadata',
                action: {
                    download: 'download_metadata'
                },
                label: '' // code
            },

            compare: {
                category: 'compare',
                action: {
                    change_selection: 'change_selection',
                    compare_data: ''
                },
                label: '' // type? domain code? code changed?
            },

            search: {

            },

            methodologies: {

            },

            classifications: {

            },

            units: {

            },

            glossary: {

            },

            abbreb: {

            },


            BROWSE_BY_DOMAIN: {
                category: 'DATA_BY_DOMAIN',
                action: {
                    show_table: 'Show Tables - TABLE'
                }
            },
            DOWNLOAD_STANDARD: {
                category: 'DOWNLOAD_STANDARD',
                action: {
                    show_table: 'Show Tables - TABLE'
                }
            },
            COMPARE: {
                category: 'COMPARE',
                action: {
                    compare_data: 'Compare the data'
                }
            }
        }
    };
});