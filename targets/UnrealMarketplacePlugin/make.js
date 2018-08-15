var path = require("path");
var cppMakeJsPath = require("./makeCpp.js");
var commonMakeJsPath = require("./makeCommon.js");
var bpMakeJsPath = require("./makebp.js");

// Making resharper less noisy - These are defined in Generate.js
if (typeof (generateApiSummaryLines) === "undefined") generateApiSummaryLines = function () { };
if (typeof (getCompiledTemplate) === "undefined") getCompiledTemplate = function () { };
if (typeof (templatizeTree) === "undefined") templatizeTree = function () { };

var copyright =
`//////////////////////////////////////////////////////
// Copyright (C) Microsoft. 2018. All rights reserved.
//////////////////////////////////////////////////////
`;

exports.makeCombinedAPI = function (apis, sourceDir, apiOutputDir) {

    // Create the Source folder in the plugin with all the modules
    bpMakeJsPath.makeBpCombinedAPI(apis, copyright, sourceDir, apiOutputDir);
    cppMakeJsPath.makeCppCombinedAPI(apis, copyright, sourceDir, apiOutputDir);
    commonMakeJsPath.makeCommonCombinedAPI(apis, copyright, sourceDir, apiOutputDir);

    var locals = {
        apis: apis,
        ueTargetVersion: "4.20.0"
    };

    // Copy the resources, content and the .uplugin file
    templatizeTree(locals, path.resolve(sourceDir, "source/PlayFab/Content"), path.resolve(apiOutputDir, "PlayFabPlugin/PlayFab/Content"));
    templatizeTree(locals, path.resolve(sourceDir, "source/PlayFab/Resources"), path.resolve(apiOutputDir, "PlayFabPlugin/PlayFab/Resources"));
    templatizeTree(locals, path.resolve(sourceDir, "source/PlayFab/PlayFab.uplugin.ejs"), path.resolve(apiOutputDir, "PlayFabPlugin/PlayFab/PlayFab.uplugin.ejs"));

    // Create the Example project folder
    templatizeTree(locals, path.resolve(sourceDir, "examplesource"), apiOutputDir);

    // Copy the PlayFabPlugin folder just created into the ExampleProject
    templatizeTree(locals, path.resolve(apiOutputDir, "PlayFabPlugin"), path.resolve(apiOutputDir, "ExampleProject/Plugins"));
}