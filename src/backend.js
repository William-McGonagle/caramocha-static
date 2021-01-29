var backendTemplates = {
    "get": getRoute,
    "create": createRoute,
    "update": updateRoute,
    "delete": deleteRoute
};

async function generateBackend(websiteData, zip) {

    var src = zip.folder('src');
    var routes = src.folder('routes');
    var models = src.folder('models');

    var routesData = "";

    for (const model in websiteData.models) {
        
        var modelFolder = routes.folder(model);

        for (const path in websiteData.models[model].paths) {
            
            var pathData = websiteData.models[model].paths[path];

            var pathFile = modelFolder.file(`${path}.js`, backendTemplates[pathData.template](websiteData, model, path));
            routesData += `app.${pathData.protocol}("/${model}/${pathData.url}", require('./routes/${model}/${path}'));\n`;

        }

        routesData += "\n";

    }

    var indexData = `// Requires
const express = require('express');

// Initialize Express
const app = express();
const port = process.env.PORT || 8000;

// Routes
${routesData}

// Listen on the Port
app.listen(port, () => {
  console.log("${websiteData.name} is now live on Port: " + port + ".")
})`;

    var mainFile = src.file('index.js', indexData);
    var modelsFile = src.file('models.js', "// Models");

    return src;

}