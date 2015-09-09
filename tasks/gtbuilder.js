/*
 * gore-core-builder
 * https://github.com/groves/grunt-plugin-test
 *
 * Copyright (c) 2015 Timothy Groves
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    /*
    'bower_components/gwa-event-dispatcher/dist/Dispatcher.js',
    'bower_components/colorbox/jquery.colorbox.js',
    'src/js/gt.foundation.Foundation.js',
    'src/js/gt.util.*',
    'src/js/gt.ui.RowWrapper.js',
    'src/js/gt.ui.Card.js',
    'src/js/gt.ui.CardGroup.js',
    'src/js/gt.ui.AutoAccordionBackground.js',
    'src/js/gt.ui.AutoAccordionLayer.js',
    'src/js/gt.ui.AutoAccordionSection.js',
    'src/js/gt.ui.AutoAccordion.js',
    'src/js/gt.ui.ImageHotspot.js',
    'src/js/gt.ui.ImageHotspotGroup.js',
    'src/js/gt.ui.ThumbnailTab.js',
    'src/js/gt.ui.ThumbnailTabs.js',
    'src/js/gt.ui.ImageDetailsListItem.js',
    'src/js/gt.ui.ImageDetailsList.js',
    'src/js/gt.ui.Lightbox',
    'src/js/gt.ui.LightboxLink',
    'src/js/gt.ui.LightboxLinkGroup',
    'src/js/gt.ui.TabSection.js',
    'src/js/gt.ui.Tabs.js',
    'src/js/gt.*.js'
    */

    function getBaseJSFiles(srcpath) {
        var files = [
            'bower_components/gwa-event-dispatcher/dist/Dispatcher.js',
            'bower_components/colorbox/jquery.colorbox.js',

            srcpath + '/js/gt.foundation.Foundation.js',
            srcpath + '/js/gt.util.*',
            srcpath + '/js/gt.ui.RowWrapper.js'
        ];
        return files;
    }

    function getRequiredJSFilesForModule(mod, srcpath) {

        var multimods = {
            'CardGroup':        ['Card', 'CardGroup'],
            'AutoAccordion':    ['AutoAccordionBackground', 'AutoAccordionLayer', 'AutoAccordionSection', 'AutoAccordion'],
            'ImageHotspot':     ['ImageHotspot', 'ImageHotspotGroup'],
            'ThumbnailTabs':    ['ThumbnailTab', 'ThumbnailTabs'],
            'ImageDetailsList': ['ImageDetailsListItem', 'ImageDetailsList'],
            'Lightbox':         ['Lightbox', 'LightboxLink', 'LightboxLinkGroup'],
            'Tabs':             ['TabSection', 'Tabs']
        };

        if (multimods.hasOwnProperty(mod)) {
            var paths = [];
            multimods[mod].forEach(function(m) {
                paths.push(getJsPath(m, srcpath));
            });
            return paths.join('", "');
        }

        return getJsPath(mod, srcpath);
    }

    function getJsPath(mod, srcpath) {
        return srcpath + '/js/gt.ui.' + mod + '.js';
    }

    grunt.registerMultiTask('gtbuilder', 'Builds required modules for Gore Core projects.', function() {

        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            dir: '.gtbuilder_cache',
            srcpath: 'bower_components/gore-tex-core/dist/src',
            modules: []
        });

        // create directory
        grunt.file.mkdir(options.dir);

        var src = '',
            paths = [];

        // basic files
        getBaseJSFiles(options.srcpath).forEach(function(file) {
            paths.push('  "' + file + '"');
        });

        // modules
        options.modules.forEach(function(m) {
            paths.push('  "' + getRequiredJSFilesForModule(m, options.srcpath) + '"');
        });
        src += '[\n';
        src += paths.join(',\n');
        src += '\n]';

        grunt.file.write(options.dir + '/uglify-files.json', src);
        grunt.log.writeln('File "' + options.dir + '/uglify-files.json' + '" created.');

        src = '';

        var flags = [];
        options.modules.forEach(function(m) {
            flags.push('$gore-include-gt-ui-' + m + ': true;');
        });
        src += '// Automagically generated module flags for Core SASS build\n';
        src += flags.join('\n');
        src += '\n';

        grunt.file.write(options.dir + '/moduleflags.scss', src);
        grunt.log.writeln('File "' + options.dir + '/moduleflags.scss' + '" created.');

    });

};
