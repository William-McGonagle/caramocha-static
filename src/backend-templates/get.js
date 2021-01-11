function getRoute(websiteData, model, path) {

    return `
// ${path}.js

function route(req, res) {

    if (req.params.id == undefined) return res.status(400).send("Not All Parameters Provided.");

    ${model}.findOne({
        where: {
            id: req.params.id
        }
    }).then(function (data) {

        if (data == null) return res.status(404).send("${model} could not be found.");

    }).catch(function (error) {

        console.log(error);
        return res.status(500).send("Internal Server Error.");

    });

}

module.exports = route;`;

}