//-------------------------------------------------------------------------------------------------------
// Copyright (C) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE.txt file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------
var path = require('path');

module.exports = function (context) {
    var fs = require('fs');
    
    // Do not allow theme with no action bar
    var dest = path.join(__dirname, '../../../../platforms/android/app/src/main/AndroidManifest.xml');
    var manifest = fs.readFileSync(dest, 'utf8');
    manifest = manifest.replace('android:theme="@android:style/Theme.DeviceDefault.NoActionBar"', '');
    fs.writeFileSync(dest, manifest);
};
