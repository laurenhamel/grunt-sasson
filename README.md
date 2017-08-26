# grunt-sasson

> Convert JSON to SASS with Grunt



## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-sasson --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-sasson');
```




## Sasson task
_Run this task with the `grunt sasson` command._


### Options


#### useMap

Type: `Boolean`  
Default: `true`

Output the Sass in maps instead of variables.


#### varName

Type: `String`  
Default: `null`

Set the map name when `options.useMap` is `true`, or use it to add a namespace prefix to variable names.


#### doubleQuotes

Type: `Boolean`  
Default: `true`

Use double quotes for escaping string values and map keys when `true` or single quotes when `false`.


#### tabSpaces

Type: `Integer`  
Default: `2`

The number of spaces to use when applying indentation.

### Examples

Add a section named `sasson` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  sasson: {            
    target: {            
      options: {   
        useMap: true,
        varName: 'config',
        doubleQuotes: true,
        tabSpaces: 2
      },
      files: [{         
        src: ['input.json'],          
        dest: 'scss/'
      ]}
    }
  }
});

grunt.loadNpmTasks('grunt-sasson');

grunt.registerTask('default', ['sasson']);
```

Sass files will be stored in your `dest` folder and formatted as partials (e.g., `_output.scss`), and the input file name will be applied to the output file.