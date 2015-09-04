/*global requirejs*/
/**
 * Expects presence of the following on the file system.
 * submodules/fenix-ui-chart-creator
 * submodules/fenix-ui-table-creator
 */
requirejs(['./merged-paths'], function (paths) {
    requirejs.config(paths);
     requirejs(['fx-dashboard/start'], function (Dashboard) {

             this.dashboard = new Dashboard(
                {
                    config: 'config/sample.json',
                    container: '#main'
                }
            );
            this.dashboard.init();
        });

});