//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
var path = require('path');
var fs = require('fs');

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (substring) {
        return (this.slice(substring.length * -1) == substring);
    };
}

function updateiOSProject() {
    var fsextra = require('fs-extra');
    var child_process = require("child_process");
    var xcode = require('xcode');

    var iosFolder = path.join(__dirname, '../../../../platforms/ios');

    // Find the path to the generated .xcodeproj folder
    var projectFolder = null;
    var items = fsextra.readdirSync(iosFolder);
    for (var i in items) {
        if (items[i].toLowerCase().endsWith(".xcodeproj")) {
            projectFolder = path.join(iosFolder, items[i]);
            break;
        }
    }

    if (projectFolder == null) {
        console.warn("Unable to find .xcodeproj");
        return;
    }

    console.info("Found xcode project at " + projectFolder);

    // Now edit the .pbxproj file inside the project folder
    var pbxFilePath = path.join(projectFolder, 'project.pbxproj');
    var project = new xcode.project(pbxFilePath);

    project.parse(function(error) {
        if (error) {
            console.warn("Unable to parse xcode project:");
            console.warn(error);
        }
        else {
            var frameworkSearchPaths = project.getBuildProperty("FRAMEWORK_SEARCH_PATHS") || "";

            if (frameworkSearchPaths.indexOf("$(inherited)") < 0) {
                frameworkSearchPaths = "\"$(inherited) " + frameworkSearchPaths.replace(/"/g, "") + "\"";
                project.updateBuildProperty("FRAMEWORK_SEARCH_PATHS", frameworkSearchPaths);
            }

            var ldRunpathSearchPaths = project.getBuildProperty("LD_RUNPATH_SEARCH_PATHS") || "";

            if (ldRunpathSearchPaths.indexOf("$(inherited)") < 0) {
                ldRunpathSearchPaths = "\"$(inherited) " + ldRunpathSearchPaths.replace(/"/g, "") + "\"";
                project.updateBuildProperty("LD_RUNPATH_SEARCH_PATHS", ldRunpathSearchPaths);
            }

            // Replace the file
            fsextra.writeFileSync(pbxFilePath, project.writeSync());
        }
    });

    console.info("Xcode build settings updated.");

    var nativeProjectDir = path.join(iosFolder, "../../native/ios");
    var projectName = path.basename(projectFolder, path.extname(projectFolder));

    try {
        var iosPodFile = path.join(nativeProjectDir, 'Podfile');
        var data = fs.readFileSync(iosPodFile).toString();
        data = data.replace(/\${PROJECT_NAME}/g, projectName);
        fs.writeFileSync(iosPodFile, data);
    } catch (err) {
        console.error("Failed to update Podfile:");
        console.error(err);
        throw new Error("pods_failed");
    }

    console.info("Podfile updated.");

    try {
        child_process.execSync("pod install", {
            cwd: nativeProjectDir,
            stdio: "inherit"
        });
    } catch (err) {
        console.error("Failed to install pods.");
        throw new Error("pods_failed");
    }

    console.info("Pods installed.");

    updateiOSXcConfig(path.join(iosFolder, "pods-debug.xcconfig"),
        "#include \"../../native/ios/Pods/Target Support Files/Pods-" + projectName + "/Pods-" + projectName + ".debug.xcconfig\"");
    updateiOSXcConfig(path.join(iosFolder, "pods-release.xcconfig"),
        "#include \"../../native/ios/Pods/Target Support Files/Pods-" + projectName + "/Pods-" + projectName + ".release.xcconfig\"");

    console.info("Xcode build configs updated.");
}

function updateiOSXcConfig(configFile, contentToAdd) {
    var data = fs.readFileSync(configFile);

    if (data.indexOf(contentToAdd) < 0) {
        data += "\n" + contentToAdd + "\n";

        fs.writeFileSync(configFile, data);
    }
}

module.exports = function (context) {
    updateiOSProject();
};
