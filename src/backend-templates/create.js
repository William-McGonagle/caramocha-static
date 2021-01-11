function createRoute(websiteData, model, path) {

    var output = `
// ${path}.js

function route(req, res) {

    res.json({
        data: "something"
    });

}

module.exports = route;`;

    return output;

}