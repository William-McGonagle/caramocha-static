function updateRoute(websiteData, model, path) {

    return `
    // ${path}.js
    
    function route(req, res) {
    
        res.json({
            data: "something"
        });
    
    }
    
    module.exports = route;`;

}