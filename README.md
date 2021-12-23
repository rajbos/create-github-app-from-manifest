# Create a GitHub App from a manifest
Example of a web app to create a GitHub App from a manifest, which can save you a lot of time when you need to create a lot of Apps with the same settings (for example webhook triggers for Jenkins)

# Files:
These are the files at play here:
1. index.html: setup of the manifest and posting that data to the organization api in this case: `https://github.com/organizations/rajbos-actions-demo/settings/apps/new`
2. redirect.html: receives the redirect after the app has been created and loads the AppId and PEM data for us.

 
# Explanation
[![Screenshot of the youtube video](/20211224_Video.png)](https://www.youtube.com/watch?v=PAR22TjG6Wg)

