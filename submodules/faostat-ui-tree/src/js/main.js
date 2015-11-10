var root = '../../';

require.config({

    baseUrl: 'js/libs',

    paths: {

        FAOSTAT_TREE: root + 'faostat-tree',
        faostat_tree: root

    }

});

require(['FAOSTAT_TREE'], function(FSTREE) {

    var fstree = new FSTREE();
    fstree.init({
        placeholder_id: 'placeholder'
    });

});