'use strict';

const config = require('./config.json')

function isTrue(value) {
  if ( typeof value === 'boolean') {
    return value;
  }
  return value == 'true';
}

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

  const temp_redirect_body = `
<\!DOCTYPE html>
<html lang="en">
<head><title>307 Temporary Redirect </title></head>
<body bgcolor="white">
<center><h1>307 Temporary Redirect </h1></center>
<hr><center>CloudFront Lambda@Edge</center>
</body>
</html>
`;

  if ( isTrue(config.apex_redirect) ) {
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

  if ( isTrue(config.append_slash) ) {
    var olduri = request.uri;
    // Match any uri that ends with some combination of
    // [0-9][a-z][A-Z]_- and append a slash
    var endslashuri = olduri.replace(/(\/[\w\-]+)$/, '$1/');
    if(endslashuri != olduri) {
      // If we changed the uri, 301 to the version with a slash, appending querystring
      var params = '';
      if(('querystring' in request) && (request.querystring.length>0)) {
        params = '?'+request.querystring;
      }
      var newuri = endslashuri + params;

      //console.log("Params: " + params);
      //console.log("New URI: " + newuri);

      const response = {
        status: '301',
        statusDescription: 'Permanently moved',
        headers: {
          location: [{
            key: 'Location',
            value: `//${host}{newuri}`
          }]
        }
      };
      return response;
    }
  }

  // only need to check for trailing / as the directory checker above will add when needed.
  if (config.ghost_hostname.length > 0 &&
    ((request.uri.startsWith("/ghost/")
      || request.uri.endsWith("/edit/")))) {

    return {
      status: '307',
      statusDescription: `Redirecting domain`,
      headers: {
        location: [{
          key: 'Location',
          value: `https://${config.ghost_hostname}${request.uri}`
        }]
      },
      body: temp_redirect_body
    };
  }

  if ( isTrue(config.index_rewrite) ) {

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
