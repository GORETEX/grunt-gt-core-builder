/*
 * grunt-gt-core-builder
 * https://github.com/GORETEX/grunt-gt-core-builder
 *
 * Copyright (c) 2015 Timothy Groves
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    /**
     * @param {String}
     * @return {Array}
     */
    function getBaseJSFiles(srcpath) {
        var files = [
            srcpath + '/js-vendor/Dispatcher.js',
            srcpath + '/js/gt.foundation.Foundation.js',
            srcpath + '/js/gt.util.*',
            srcpath + '/js/gt.ui.RowWrapper.js'
        ];
        return files;
    }

    /**
     * @param {String}
     * @return {String}
     */
    function getRequiredJSFilesForModule(mod, srcpath) {

        var multimods = {
            'CardGroup':        ['Card', 'CardGroup'],
            'AutoAccordion':    ['AutoAccordionBackground', 'AutoAccordionLayer', 'AutoAccordionSection', 'AutoAccordion'],
            'ImageHotspot':     ['ImageHotspot', 'ImageHotspotGroup'],
            'ThumbnailTabs':    ['ThumbnailTab', 'ThumbnailTabs'],
            'ImageDetailsList': ['ImageDetailsListItem', 'ImageDetailsList'],
            'Lightbox':         ['/js-vendor/jquery.colorbox.js', 'Lightbox', 'LightboxLink', 'LightboxLinkGroup'],
            'Slider':           ['/js-vendor/fotorama.js', 'Slider'],
            'SideBarContent':   ['ToggleContent', 'SideBarContent'],
            'Tabs':             ['TabSection', 'Tabs'],
            'Forms':            ['/js-vendor/parsley.js', 'Forms'],
            'HasTooltip':       ['/js-vendor/tooltipster.js', 'Tooltip']
        };

        if (multimods.hasOwnProperty(mod)) {
            var paths = [];
            multimods[mod].forEach(function(m) {
                paths.push(getJsPath(m, srcpath));
            });
            return paths.join('",\n  "');
        }

        return getJsPath(mod, srcpath);
    }

    /**
     * @param {String}
     * @param {String}
     * @return {String}
     */
    function getJsPath(mod, srcpath) {
        if (mod.indexOf('.js') !== -1) {
            return srcpath + mod;
        }
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

        // JS --------

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
        src += '\n]\n';

        grunt.file.write(options.dir + '/uglify-files.json', src);
        grunt.log.writeln('File "' + options.dir + '/uglify-files.json' + '" created.');

        // SASS --------

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
