var fs = require('fs'),
    path = require('path')

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}



var createIndexHtml = function (repo){
    var htmlTemplateInit = "<!DOCTYPE html><html><head><title>Repo RPM PCLinuxOSBr</title></head><body>";
    var htmlLinks = "";
    var htmlTemplateDone = "</body></html>";
    var list = repo.children; 
    //console.log(list)
    for(i in list){
        var href = list[i].path + "";
        var name = list[i].name;
        if(list[i].type=='folder'){
            createIndexHtml(list[i]);
        }
        if(name != "index.html"){
            href = href.replace("./apt/","/apt/");
            htmlLinks += "<a href='"+href+"'>"+name+"</a><br>";
        }
    }
    if(htmlLinks){
        fs.writeFile(repo.path+"/index.html", htmlTemplateInit+htmlLinks+htmlTemplateDone, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }
}

if (module.parent == undefined) {
    // node dirTree.js ~/foo/bar
    var util = require('util');
    //console.log(util.inspect(dirTree(process.argv[2]), false, null));
    var repo = dirTree("./apt")
    createIndexHtml(repo);

}