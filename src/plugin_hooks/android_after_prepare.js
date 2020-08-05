var fs = require('fs');
var fsextra = require('fs-extra');
var path = require('path');

function createApplicationClass(context) {
    var configXml = path.join(context.opts.projectRoot, 'config.xml');
    var parser = require('elementtree');

    var configData = fs.readFileSync(configXml).toString();
    var configs = parser.parse(configData);

    var packageName = configs.getroot().attrib.id;

    var androidSrcRootPath = path.join(context.opts.projectRoot, "native/android/src");
    var pkgPath = path.join(androidSrcRootPath, packageName.replace(/\./g, "/"));
    fsextra.ensureDirSync(pkgPath);

    var appName = packageName.replace(/\./g, "_") + "_Application";

    var pluginSrcRootPath = path.join(__dirname, "..");
    var androidApplicationClassSrcPath = path.join(pluginSrcRootPath, "android/build/CustomApplication.java");
    var androidApplicationClassDstPath = path.join(pkgPath, appName + ".java");

    try {
        fs.accessSync(androidApplicationClassDstPath);
    } catch (err) {
        var data = fs.readFileSync(androidApplicationClassSrcPath).toString();

        data = data.replace(/\${PACKAGE_NAME}/g, packageName)
            .replace(/\${APP_NAME}/g, appName);

        fs.writeFileSync(androidApplicationClassDstPath, data);
    }

    var manifestXml = path.join(context.opts.projectRoot, "platforms/android/app/src/main/AndroidManifest.xml");
    var manifestData = fs.readFileSync(manifestXml).toString();
    var manifest = parser.parse(manifestData);

    var appNode = manifest.getroot().findall("./application")[0];

    if (!appNode) {
        throw new Error("No application tag found in manifest!");
    }

    appNode.set("android:name", packageName + "." + appName);

    var newManifest = manifest.write();
    fs.writeFileSync(manifestXml, newManifest);
}

module.exports = function (context) {
    createApplicationClass(context);
};
