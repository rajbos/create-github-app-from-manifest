function updateFormUrl() {
    environment = document.getElementById("environment").value
    document.getElementById("form").action = baseUrl + "/organizations/" + environment + "/settings/apps/new?state=newlycreated"
}

function loadFile(url, isJson, callback) {
    var xobj = new XMLHttpRequest();                
    if (isJson) {
        xobj.overrideMimeType("application/json");                    
    }

    xobj.open('GET', url, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

var baseUrl = "";

function loadEnvironments() {
    fileLocation = "environments.json"
    loadFile(fileLocation, false, function(response) {
        //console.log('found file with content' + response);

        json = JSON.parse(response);
        
        for(var i = 0; i < json.environments.length; i++) {
            environment = json.environments[i]
            
            option = document.createElement("option")
            option.value = environment
            option.innerHTML = environment
            document.getElementById("environment").appendChild(option)
        }
        
        // make sure we have set the postback url:
        baseUrl = json.baseUrl
        updateFormUrl();   
    });
}

function initPage() {
    loadEnvironments()

    // load the manifest
    jsonFileToUrl = "manifest1.json"
    loadFile(jsonFileToUrl, false, function(response) {
        //console.log('found file with content' + response);
        
        // remove everything behind the last "/""
        url = window.location.href
        lastSlash = url.lastIndexOf("/");
        url = url.substring(0, lastSlash);
        redirectUrl = url + "/redirect.html";        

        // replace the parameter in the manifest
        manifest = response.replace(/__redirectUrl__/g, redirectUrl);
        manifest = JSON.parse(manifest)

        // show the manifest on the page
        input = document.getElementById("manifest")
        input.value = JSON.stringify(manifest, null, 2)
    })
}