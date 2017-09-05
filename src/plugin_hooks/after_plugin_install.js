//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
var path = require('path');
var fs = require('fs');

//
// The user's project should contain a native folder, which is a place
// for them to add native code and resources.
//
// This creates the folder, with ios and android subfolders.
//
// On Android, the (empty) subfolders demonstrate where code and assets
// need to go in order to be compiled into the final result.
//
// On iOS, the header file explains how to #import custom native code
// so it will get compiled into the final result. The Resources subfolder
// is where any .xib files should go.
//
function copyInitialFiles () {
    var fsextra = require('fs-extra');
    var projectFolder = path.join(__dirname, '../../../..');

    try {
        // Place initial native folders
        fsextra.ensureDirSync(path.join(projectFolder, "native/android/src"));
        fsextra.ensureDirSync(path.join(projectFolder, "native/android/res"));
        fsextra.ensureDirSync(path.join(projectFolder, "native/android/libs"));
        fsextra.ensureDirSync(path.join(projectFolder, "native/ios"));
        fsextra.ensureDirSync(path.join(projectFolder, "native/ios/resources"));

        var androidGradleDestFile = path.join(projectFolder, 'native/android/build.gradle');

        try {
            fsextra.accessSync(androidGradleDestFile, fsextra.R_OK);
        } catch (ex1) {
            var androidGradleSrcFile = path.join(projectFolder, 'plugins/cordova-plugin-ace/src/android/build/build.gradle');
            fsextra.copySync(androidGradleSrcFile, androidGradleDestFile);
        }

        // Place initial iOS header file
        var iosProjectFile = path.join(projectFolder, 'native/ios/native.xcodeproj/project.pbxproj');

        try {
            fsextra.accessSync(iosProjectFile, fsextra.R_OK);
            // The file already exists, so do nothing
        }
        catch (ex1) {
            // The file must not exist, so copy it
            var iosProjectSrcDir = path.join(projectFolder, 'plugins/cordova-plugin-ace/src/ios/build');
            var iosProjectDstDir = path.join(projectFolder, 'native/ios');
            fsextra.copySync(iosProjectSrcDir, iosProjectDstDir);
        }
    }
    catch (ex2) {
        // This is for convenience, so it's not a problem if it fails.
    }
}

module.exports = function (context) {
    copyInitialFiles();
};
