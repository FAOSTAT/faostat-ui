define(['fx-dashboard/views/base/view', 'text!fx-dashboard/templates/site.hbs'], function(View, template) {
  'use strict';

  var SiteView = View.extend({
    container: 'body',
    id: 'site-container',
    regions: {
      main: '#main-container'
    },
    template: template
  });

  return SiteView;
});
