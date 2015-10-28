# grunt-writefile

> Writes static files using handlebars templates.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-writefile --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-writefile');
```



## The "writefile" Task

The writefile task is a simple task to create all kind of static files from [handlebars](http://handlebarsjs.com) templates. You might find this helpful if you want to export files for different environments (e.g. development and production) and need a basic and quick solution.


### Options

| Property            | Type           | Description
|:--------------------|:---------------|:-------------
| `data`              | Object/String  | The data object passed to the handlebars template. If a string is given, it is interpreted as a path to a JSON file (defaults to `undefined`).
| `paths`             | Object         | Creates an array of paths for each given file pattern and adds (or overrides) a `paths` property to the template data. Each file pattern can either be a string or an object for building paths [dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) (defaults to `undefined`).
| `helpers`           | Object         | Custom handlebars [helpers](http://handlebarsjs.com/#helpers), where the key is the helper name and the value is the helper function (defaults to `undefined`).
| `preserveExtension` | Boolean        | This option is only relevant for [expanded](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) paths. Will strip the file extension from the destination path when set to `false` or keep it unchanged when set to `true` (defaults to `false`).
| `encoding`          | String         | The file encoding to write files with (defaults to [`grunt.file.defaultEncoding`](http://gruntjs.com/api/grunt.file#grunt.file.defaultencoding)).
| `mode`              | Boolean/Number | Whether to copy or set the existing file permissions. Set to `true` to copy the existing file permissions. Or set to the mode (i.e. `0644`) that copied files will be set to (defaults to `false`).



### Examples

#### Basic Options

Basic configuration reading/writing a single file.

```js
grunt.initConfig({
  writefile: {
    options: {
        data: {
            foo: 1,
            bar: 2
        }
    },
    main: {
        src: 'path/to/template.hbs',
        dest: 'path/to/target.txt'
    }
  }
});
```

#### Advanced Options

Scans for `*.html.hbs` files nested inside a `template` directory and writes the structure to a `public` directory. As `preserveExtension` is set to `false`, the file extension will be dropped when writing. Thereby `index.html.hbs` will become `index.html`.


```js
grunt.initConfig({
  writefile: {
    options: {
        preserveExtension: false,
        data: 'path/to/data.json',  // read template data from JSON file
        helpers: {                  // provide handlebars helper functions
            someHelper: function (value) {
                return '<strong>' + value + '</strong>';
            }
        },
        paths: {                    // provide directory contents to template
            someFiles: '/path/to/**/some/files.*',
            otherFiles: {
                cwd: 'path/base/',
                src: '**/other/files.*'
            }
        }
    },
    main: {
        files: [{
            expand: true,
            cwd: 'path/base/',
            src: 'templates/**/*.html.hbs',
            dest: 'public/',
        }]
    }
  }
});
```

#### Real-World Example

This example illustrates how to use the plugin for writing files for different environments.

*If you use the `paths` object, you probably want to run the writefile task after all other file manipulating tasks (like [less](https://www.npmjs.org/package/grunt-contrib-less) or [uglify](https://www.npmjs.org/package/grunt-contrib-uglify)) to make sure you get the right directory contents.*

```js
grunt.initConfig({
    less: {
        dev: { /* ... */ },
        prod: { /* ... */ }
    },
    uglify: {
        dev: { /* ... */ },
        prod: { /* ... */ }
    },
    writefile: {
        options: {
            data: {
                title: 'My Page Title'
            },
            paths: {
                stylesheets: 'assets/styles/*.css',
                scripts: 'assets/scripts/*.js'
            }
        }
        index: {
            src: 'templates/index.html.hbs',
            dest: 'public/index.html'
        }
    }
});

// ...

grunt.registerTask('dev', ['less:dev', 'uglify:dev', 'writefile:index']);
grunt.registerTask('prod', ['less:prod', 'uglify:prod', 'writefile:index']);

```


The `index.html.hbs` template file could look like this:

```html
<!DOCTYPE html>
<html>
    <head>
        <title>{{title}}</title>

        {{#each paths.stylesheets}}
        <link href="{{this}}" rel="stylesheet" type="text/css">
        {{/each}}
    </head>
    <body>
        <!-- content -->

        {{#each paths.scripts}}
        <script src="{{this}}"></script>
        {{/each}}
    </body>
</html>
```


## Contributing

Thanks to the [grunt](http://gruntjs.com/) project, the [handlebars](http://handlebarsjs.com) template engine and all people that are somehow involved in all that.


## Release History

| Release | Description
|:--------|:------------
| 0.1.0   | Initial release.
| 0.1.1   | Fixed bug related to `preserveExtension` option.
| 0.1.2   | Updated library versions.
