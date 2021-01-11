// N ode
// E xpress
// R eact
// D ocker
// S equelize

jQuery.loadScript = async function (url, callback) {
    return jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}

$(function () {
    
    function generateOpenAPIFile(websiteData) {

        var paths = {};

        for (var model in websiteData.models) {
            
            var modelData = websiteData.models[model].paths;

            for (var path in modelData.paths) {
                
                var pathData = modelData.paths[path];

                paths[`/${model}/${path}`] = {
                    get: {
                        summary: "REST PROTOCOL"
                    }
                };

            }

        }

        var template = {
            "openapi": "3.0.0",
            "info": {
                "title": websiteData.name,
                "description": websiteData.description,
                "termsOfService": `https://www.${websiteData.domain}/terms`,
                "contact": {
                    "name": `${websiteData.name} Support`,
                    "url": `https://www.${websiteData.domain}/support`,
                    "email": `support@${websiteData.domain}`
                },
                "license": {
                    "name": "UNLICENSED",
                    "url": ""
                },
                "servers": [
                    {
                        "description": "Development Server",
                        "url": `http://localhost:8000/`
                    },
                    {
                        "description": "Production Server",
                        "url": `https://www.${websiteData.domain}/`
                    }
                ],
                "version": websiteData.version
            },
            paths: paths
        };

        return JSON.stringify(template, null, 4);

    }

    function npmFile(websiteData) {

        var npmData = {
            "name": websiteData.name,
            "version": websiteData.version,
            "description": websiteData.description,
            "author": websiteData.author,
            "keywords": websiteData.keywords,
            "homepage": `https://www.${websiteData.domain}/`,
            "bugs": {
                "url" : `https://www.${websiteData.domain}/bugs`, 
                "email" : `bugs@${websiteData.domain}`
            },
            "scripts": {
                "start": "node src/main.js",
                "test": "echo \"No Test Script Exists\";",
                "react-start": "webpack-dev-server --open",
                "build": "webpack"
            },
            "license": websiteData.license.toUpperCase(),
            "dependencies": {
                "express": "^4.17.1",
                "sequelize": "^6.3.5",
                "bcrypt": "^5.0.0",
                "jsonwebtoken": "^8.5.1",
                "react": "17.0.1",
                "react-dom": "17.0.1"
            },
            "devDependencies": {
                "webpack": "^5.12.2", 
                "webpack-dev-server": "^3.11.1", 
                "html-webpack-plugin": "^4.5.1", 
                "@babel/core": "^7.12.10",
                "babel-loader": "^8.2.2", 
                "@babel/preset-env": "^7.12.11", 
                "@babel/preset-react": "^7.12.10"
            }
        };

        return JSON.stringify(npmData, null, 4);

    }

    function HTMLFile(websiteData, data) {

        return `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8"> 
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>${websiteData.name}</title>
                </head>
                <body>
                    <p>${data}</p>
                </body>
                </html>`;

    }

    $('#download').click(function () {

        getLicenseData({
            "name": $("#name").val(),
            "author": $("#author").val(),
            "description": $("#description").val(),
            "version": $("#version").val(),
            "license": $("#license").val(),
            "keywords": [],
            "domain": $("#domain").val(),
            "models": {
                "user": {
                    "params": {
                        "name": "STRING",
                        "description": "TEXT"
                    },
                    "paths": {
                        "createUser": {
                            "protocol": "post",
                            "url": "create",
                            "template": "create"
                        },
                        "getUser": {
                            "protocol": "get",
                            "url": ":id",
                            "template": "get"
                        },
                        "updateUser": {
                            "protocol": "post",
                            "url": "update",
                            "template": "update"
                        },
                        "deleteUser": {
                            "protocol": "delete",
                            "url": "delete",
                            "template": "delete"
                        },
                        "login": {
                            "protocol": "post",
                            "url": "login",
                            "template": "get"
                        },
                        "signup": {
                            "protocol": "post",
                            "url": "signup",
                            "template": "get"
                        }
                    }
                }
            }
        });

    });

    function dockerFile(websiteData) {

        // For Proper Formatting
        var output = "FROM node:12\n";
        output += "WORKDIR /app\n";
        output += "COPY package*.json ./\n";
        output += "RUN npm install\n";
        output += "COPY . .\n";
        output += "ENV PORT=8080\n";
        output += "EXPOSE 8080\n";
        output += "CMD [ \"npm\", \"start\" ]";

        return output;

    }

    function readmeFile(websiteData) {

        var output = `# ${websiteData.name}\n`;
        output += `### ${websiteData.author}\n`;
        output += `${websiteData.description}\n`;
        output += "\n";
        output += "## Todo\n";
        output += " - [X] Everything\n"
        output += "\n";
        return output;

    }

    function gitDirectory(websiteData, zip) {

        var git = zip.folder('.git');
        var HEAD = git.file('HEAD', 'ref: refs/heads/master');
        var config = git.file('config', `[core]
    repositoryformatversion = 0
    filemode = true
    bare = false
    logallrefupdates = true
    ignorecase = true
    precomposeunicode = true`);
        var description = git.file('description', websiteData.name);
        var hooks = git.folder('hooks');
        var info = git.folder('info');
        var objects = git.folder('objects');
        var refs = git.folder('refs');

        var exclude = info.file('exclude', '# exclude file');

        var objectsInfo = objects.folder('info');
        var objectsPack = objects.folder('pack');

        var refsHead = objects.folder('heads');
        var refsTags = objects.folder('tags');

        return git;

    }

    function getLicenseData(websiteData) {
    
        if (websiteData.license == "unlicensed") {

            return generateZipFile(websiteData);

        } else {

            $.ajax({
                url: 'https://api.github.com/licenses/' + websiteData.license,
                type: 'GET',
            }).then(function (data) {
    
                var licenseBody = data.body;
                licenseBody = licenseBody.replace("[year]", new Date().getFullYear());
                licenseBody = licenseBody.replace("[fullname]", websiteData.author);
    
                websiteData.licenseBody = licenseBody;
                generateZipFile(websiteData);
    
            });

        }

    }

    function generateZipFile(websiteData) {

        var zip = new JSZip();

        var license = zip.file("License.md", websiteData.licenseBody || `UNLICENSED; ALL PROPERTY OWNED BY ${websiteData.author.toUpperCase()}; MADE WITH CARAMOCHA;`);
        var readme = zip.file("Readme.md", readmeFile(websiteData));
        var openApi = zip.file("OpenAPI.json", generateOpenAPIFile(websiteData));
        var packageJson = zip.file("package.json", npmFile(websiteData));
        var dockerfile = zip.file("Dockerfile", dockerFile(websiteData));

        var git = gitDirectory(websiteData, zip);
        var src = generateBackend(websiteData, zip);
        var public = generateFrontend(websiteData, zip);
        
        var termsOfService = public.folder("terms").file("index.html", HTMLFile(websiteData, "Insert Terms of Service Here"));
        var support = public.folder("support").file("index.html", HTMLFile(websiteData, "Insert Support Page Here"));
        var bugs = public.folder("bugs").file("index.html", HTMLFile(websiteData, "Insert Bug Page Here"));

        zip.generateAsync({type:"blob"}).then(function (blob) {
            
            window.saveAs(blob, `${websiteData.name.toLowerCase().replace(/ /g, "-")}.zip`);

        }, function (err) {
            
            // jQuery("#blob").text(err);

        });

    }

});