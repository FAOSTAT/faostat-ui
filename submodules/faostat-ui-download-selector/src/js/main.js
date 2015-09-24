var root = '../../';

require.config({

    baseUrl: 'js/libs',

    paths: {

        FAOSTAT_DOWNLOAD_SELECTOR: root + 'faostat-download-selector',
        faostat_download_selector: root

    }

});

require(['FAOSTAT_DOWNLOAD_SELECTOR'], function(FSDWLDS) {

    var fsdwls_1 = new FSDWLDS();
    fsdwls_1.init({
        placeholder_id: 'placeholder_1',
        suffix: 'area_1',
        tabs :   [
            {
                label: 'Countries',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/1/1/E'
            },
            {
                label: 'Regions',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/1/2/E'
            },
            {
                label: 'Special Groups',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/1/3/E'
            }
        ]
    });

    var fsdwls_2 = new FSDWLDS();
    fsdwls_2.init({
        placeholder_id: 'placeholder_2',
        suffix: 'elements_1',
        tabs :   [
            {
                label: 'Elements',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/2/1/E'
            }
        ]
    });

    var fsdwls_3 = new FSDWLDS();
    fsdwls_3.init({
        placeholder_id: 'placeholder_3',
        suffix: 'items_1',
        tabs :   [
            {
                label: 'Items',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/3/1/E'
            },
            {
                label: 'Items Aggregated',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/3/2/E'
            }
        ]
    });

    var fsdwls_4 = new FSDWLDS();
    fsdwls_4.init({
        placeholder_id: 'placeholder_4',
        suffix: 'years_1',
        tabs :   [
            {
                label: 'Years',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/4/1/E'
            },
            {
                label: 'Year Projections',
                rest: 'http://faostat3.fao.org/wds/rest/procedures/usp_GetListBox/faostatdb/GT/4/2/E'
            }
        ]
    });

});