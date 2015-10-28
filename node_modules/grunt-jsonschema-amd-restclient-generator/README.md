# grunt-jsonschema-amd-restclient-generator

> Generate an AMD client for REST web services described by a JSON Schema.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-jsonschema-amd-restclient-generator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-jsonschema-amd-restclient-generator');
```

## The "jsonschema_amd_restclient_generator" task

### Overview
In your project's Gruntfile, add a section named `jsonschema_amd_restclient_generator` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  jsonschema_amd_restclient_generator: {
    custom_options: {
      /* Task-specific options go here. */
    }
  }
});
```

### Options

#### options.base_url
Type: `String`

The URI of the JSON Schema.

#### options.output_name
Type: `String`

The name of the final AMD library.

### Usage Examples

#### Custom Options
This is an example of the use of the plugin to generate the AMD client for FAOSTAT APIs. The final reslt, 
`FAOSTATClient.min.js`, will be available in the `dist` folder. 

```js
'use strict';

module.exports = function (grunt) {

    /* Project configuration. */
    grunt.initConfig({

        /* Plugin configuration. */
        jsonschema_amd_restclient_generator: {
            custom_options: {
                options: {
                    base_url: 'http://localhost:8080/faostat-api/v1.0/',
                    output_name: 'test-client'
                }
            }
        }

    });

    /* Load NPM tasks. */
    grunt.loadNpmTasks('grunt-jsonschema-amd-restclient-generator');

    /* Register task. */
    grunt.registerTask('default', ['jsonschema_amd_restclient_generator']);

};
```
