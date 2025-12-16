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

function getFile(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        //xhr.responseType = 'document';
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.responseText);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
}

async function getSettings() {
    fileLocation = "environments.json"
    settings = await getFile(fileLocation)

    console.log(`settings: ` + settings);

    return JSON.parse(settings)
}

function loadEnvironments() {
    fileLocation = "environments.json"
    settings = loadFile(fileLocation, false, function(response) {
        //console.log('found file with content' + response);

        json = JSON.parse(response);
        baseUrl = json.baseUrl

        envSelect = document.getElementById("environment")
        if (envSelect) {
            for(var i = 0; i < json.environments.length; i++) {
                environment = json.environments[i]
                
                option = document.createElement("option")
                option.value = environment
                option.textContent = environment
                envSelect.appendChild(option)
            }
             // make sure we have set the postback url:
            updateFormUrl(); 
        }

        return { baseUrl: json.baseUrl, apiUrl: json.apiUrl }
    });

    return settings
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

function showAppInfo(xhr, settings) {
    console.log(`Return status: ` + xhr.status);
    console.log(`Return text:` + xhr.responseText);

    appName = document.getElementById("name")
    appId = document.getElementById("appId")
    pemKey = document.getElementById("pemKey")
    
    response = JSON.parse(xhr.responseText)

    appName.innerHTML = response.slug;
    appId.innerHTML = response.id;
    pemKey.value = response.pem;

    waiting = document.getElementById("waiting")
    waiting.style.display = "none";

    installationUrl = getAppInstallationUrl(settings)
    document.getElementById("installLink").href = installationUrl
}

function getAppInstallationUrl(settings) {
    return settings.baseUrl + "/organizations/" + response.owner.login + "/settings/apps/" + response.slug + "/installations"
}

async function loadRedirectPageInfo() {

    settings = await getSettings()    
    console.log(`settings.apiUrl: ` + settings.apiUrl);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    console.log(`Found this code: [${code}] with this state: [${state}]`);

    // post to github and retrieve appId and PEM key
    const apiUrl = settings.apiUrl + "/app-manifests/"+ code + "/conversions";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            const timeout = setTimeout(showAppInfo(xhr, settings), 7500);
        }
        else {
            waiting = document.getElementById("waiting")
            waiting.innerHTML = "Error retrieving the information: " + xhr.status + " - " + xhr.responseText;
        }
    };
    xhr.open("POST", apiUrl);        
    xhr.send();    
}