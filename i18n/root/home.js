/*global define*/
define(['jquery', 'i18n!nls/common'], function ($, Common) {

    'use strict';

    return $.extend(true, {}, Common, {

        'home_welcome_title' : 'Welcome to the FAOSTAT prototype',
        'text' : 'This section is not ready yet, we apologize for any inconvenience. To find out more about the next ' +
                 'releases, please visit the project\'s <a target="_blank" href="https://github.com/FAOSTAT/faostat-ui/milestones">roadmap page</a>.',
        'authentication_credentials' : ''

    });

});