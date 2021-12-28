# Create a GitHub App from a manifest
Example of a web app to create a GitHub App from a manifest, which can save you a lot of time when you need to create a lot of Apps with the same settings (for example webhook triggers for Jenkins)

## Repo setup:
This repo holds both a plain HTML setup (see the `html` folder) and a simple NodeJS setup that uses the same static files, but with a simple `node app.js` you can start it (make sure you are in the nodejs folder).

# HTML Files:
These are the files at play here:
1. index.html: setup of the manifest and posting that data to the organization api in this case: `https://github.com/organizations/rajbos-actions-demo/settings/apps/new`
2. redirect.html: receives the redirect after the app has been created and loads the AppId and PEM data for us.
3. manifest1.json: the manifest that we will post to the organization api, with an override of __redirectUrl__ based on the current url.
4. script.js: a separate file hosting the JavaScript that does the work

 
# Explanation
[![Screenshot of the youtube video](/20211224_Video.png)](https://www.youtube.com/watch?v=PAR22TjG6Wg)

