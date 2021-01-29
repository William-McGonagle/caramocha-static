$(function () {

    setInterval(function () {

        var fillwords = [
            "Website",
            "Twitter Clone",
            "Better Reddit",
            "Blog",
            "New Life",
            "Company",
            "Million-Dollar Evaluation"
        ];

        $("#subtext").text(`Build a ${fillwords[Math.floor(fillwords.length * Math.random())]} in Minutes.`);

    }, 2000);

    setAndRememberValue("name");
    setAndRememberValue("author");
    setAndRememberValue("description");
    setAndRememberValue("version");
    setAndRememberValue("license");
    setAndRememberValue("domain");

});

function addModel() {

    var modelElement = $("<div></div>").height(0);
    $('#models').append(modelElement);

    setTimeout(function () {
        
        modelElement.height('');

    }, 50);

}

function addPage() {

    var pageElement = $("<div><iframe src='http://www.bing.com/'></iframe></div>").height(0);
    $('#pages').append(pageElement);

    setTimeout(function () {
        
        pageElement.height('');

    }, 50);

}

function setAndRememberValue(name) {

    $(`#${name}`).val(Cookies.get(name)); 

    $(`#${name}`).change(function () {
        
        Cookies.set(name, $(`#${name}`).val());

    });

}