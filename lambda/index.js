'use strict';
exports.handler = async (event, context) => {
  // Extract the request from the CloudFront event that is sent to Lambda@Edge
  const request = event.Records[0].cf.request;
  let host = request.headers.host[0].value

  const apex_redirect_body = `
<\!DOCTYPE html>
<html lang="en">
<head><title>301 Moved Permanently</title></head>
<body bgcolor="white">
<center><h1>301 Moved Permanently</h1></center>
<hr><center>CloudFront Lambda@Edge</center>
</body>
</html>
`;

  if ( process.env.APEX_REDIRECT == "true" ) {
    if (host.split('.').length == 2) {
      return {
        status: '301',
        statusDescription: `Redirecting to www domain`,
        headers: {
          location: [{
            key: 'Location',
            value: `https://www.${host}${request.uri}`
          }]
        },
        body: apex_redirect_body
      };
    }
  }

  if ( process.env.INDEX_REWRITE == "true") {
    // Extract the URI from the request
    var olduri = request.uri;

    // Match any '/' that occurs at the end of a URI. Replace it with a default index
    var newuri = olduri.replace(/\/$/, '\/index.html');

    // Log the URI as received by CloudFront and the new URI to be used to fetch from origin
    console.log("Old URI: " + olduri + " New URI: " + newuri);

    // Replace the received URI with the URI that includes the index page
    request.uri = newuri;
  }

  return request;

};