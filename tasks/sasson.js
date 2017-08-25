/*
 * grunt-sasson
 * https://github.com/laurenhamel/grunt-sasson
 *
 * Copyright (c) 2017 Lauren Hamel
 * Licensed under the MIT license.
 */

'use strict';

var PATH = require('path');

module.exports = function (grunt) {

  grunt.registerMultiTask('sasson', 'Convert JSON to SASS with Grunt', function () {
    
    var options = this.options({
      useMap: true,
      varName: null,
      doubleQuotes: true,
      tabSpaces: 2
    });
    
    options.indent = " ".repeat(options.tabSpaces);
    
    this.files.map(function (file) {
      
      return {
        src: file.src.filter(function (src) {
          
          if ( !grunt.file.exists(src) ) {
            
            grunt.log.warn('Source file "' + src + '" not found.');
            
            return false;
            
          }
          
          return true;
          
        }),
        output: file.output,
        dest: file.dest
      };
      
    }).map(function (file) {
      
        return {
          src: file.src.map(function (path) {
            
              return toSass(path, grunt.file.read(path), options);
            
          }).join("\n"),
          output: file.output,
          dest: file.dest
        };
      
    }).forEach(function (file, index) {
      
      var dirname = PATH.dirname(file.dest),
          basename = PATH.basename(file.src, '.json'),
          filename = basename;
      
      if( file.output && isArray(file.output) && file.output[index] ) filename = file.output[index];
      
      var output = dirname + '_' + filename + '.scss';
      
        grunt.file.write(output, file.src);
      
        grunt.log.writeln('File "' + output + '" created.');
      
    });
    
  });
  
};

var toSass = function (path, src, options) {
      var json = JSON.parse(src),
          maps = [],
          basename = PATH.basename(path, '.json'),
          varName;
      
      if( options.useMap ){
        
        varName = options.varName || basename;
        
        maps.push('$' + varName + ': ' + toSassMap(json, options, 1) + ';' );
        
      }
      else {
        
        Object.keys(json).forEach(function (key) {
          
          var value = json[key];
          
          varName = options.varName ? options.varName + key : key; 
          
          maps.push('$' + varName + ': ' + toSassType(value, options, 1) + ';' );
          
        });
        
      }
      
      return maps.join("\n");
    },
    
    toSassType = function (json, options, indents) {
                                
      if( isObject(json) ) return toSassMap(json, options, indents);
      else if( isArray(json) ) return toSassList(json, options, indents);
      return toSassValue(json, options);
      
    },
    
    toSassMap = function(map, options, indents){
      var result = "(\n";
    
      for(var i = 0; i < Object.keys(map).length; i++) {
        
        var key = Object.keys(map)[i],
            value = map[key];

        result += options.indent.repeat(indents) + 
                  stringToSassString(key, options) + ': ' + toSassType(value, options, indents + 1);
        
        if( i != Object.keys(map).length - 1) result += ",\n";
      }
        
      result += "\n" + options.indent.repeat(indents - 1) + ")";
      
      return result;
    },
    
    toSassList = function(list, options, indents){
      var result = "(\n";
      
      for( var i = 0; i < list.length; i++ ) {
        
        result += options.indent.repeat(indents) + toSassType( list[i], options, indents + 1);
        
        if( i != list.length - 1) result += ",\n";
        
      }
      
      result += "\n" + options.indent.repeat(indents - 1) + ")";
      
      return result;
    },
    
    toSassValue = function(value, options){
      if( isString(value) ){
        if( stringIsColor(value) ) return stringToColor(value);
        else if( stringIsBoolean(value) ) return stringToBoolean(value);
        else if( stringIsNumber(value) ) return stringToNumber(value);
        else return stringToSassString(value, options);
      }
      return value;
    },
    
    isString = function(value) {
      return typeof value === 'string';
    },
    
    isArray = function(value) {
      return typeof value === 'object' && value instanceof Array === true;
    },
    
    isObject = function(value) {
      return typeof value === 'object' && value instanceof Array === false && value !== null;
    },
    
    isNumber = function(value) {
      return typeof value === 'object';
    },
    
    isBoolean = function(value) {
      return typeof value === 'boolean';
    },
    
    stringIsColor = function(string) {
      var regex = {
        rgb: /(rgb\( *[0-9]{1,3} *, *[0-9]{1,3} *, *[0-9]{1,3} *\))/gi,
        rgba: /(rgba\( *[0-9]{1,3} *, *[0-9]{1,3} *, *[0-9]{1,3} *, *[0-9.]+\))/gi,
        hex: /(#[0-9a-f]{3,6})/gi
      };
      for(var key in regex){
        if( regex[key].test(string) ) return true;
      }
      return false;
    },
    
    stringToColor = function(string) {
      var regex = {
        rgb: /(rgb\( *[0-9]{1,3} *, *[0-9]{1,3} *, *[0-9]{1,3} *\))/gi,
        rgba: /(rgba\( *[0-9]{1,3} *, *[0-9]{1,3} *, *[0-9]{1,3} *, *[0-9.]+\))/gi,
        hex: /(#[0-9a-f]{3,6})/gi
      };
      for(var key in regex){
        string = string.replace(regex[key], "$1");
      }
      return string;
    },
    
    stringIsBoolean = function(string) {
      return string === 'true' || string === 'false';
    },
    
    stringToBoolean = function(string) {
      if( string === 'true' ) return true;
      else if( string === 'false' ) return false;
      return string;
    },
    
    stringIsNumber = function(string) {
      return Number(string).toString() === string;
    },
    
    stringToNumber = function(string) {
      if( Number(string).toString() === string ) return +string;
      return string;
    },
    
    stringToSassString = function(string, options){
      if( options.doubleQuotes ) return '"' + string.replace(/\"/g, '\"') + '"';
      return "'" + string.replace(/\'/g, "\'") + "'";
    };
