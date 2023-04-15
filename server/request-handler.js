/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

 // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // These headers will allow Cross-Origin Resource Sharing (CORS).
  // This code allows this server to talk to websites that
  // are on different domains, for instance, your chat client.
  //
  // Your chat client is running from a url like file://your/chat/client/index.html,
  // which is considered a different domain.
  //
  // Another way to get around this restriction is to serve you chat
  // client from this domain by setting up static file serving.

**************************************************************/
const storage = require('./basic-server')

var requestHandler = function(request, response) {


  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  const {headers, method, url} = request;
  var statusCode = 200;
  var headers_res = defaultCorsHeaders;
  //add an api end point to recieve get and post requests /classes/messages
  debugger;
  if(request.method === 'POST' && request.url === '/classes/messages'){
    let body = [];
    // console.log("data inside request", request)
    console.log('POST')
    statusCode = 201//set status to 201
    // on error set status to 404
    // request.on('error', () => {
    //   statusCode = 404
    // })
    request.on('data', (message) => {

      var parsedMessage = String.fromCharCode(...message)
      var JSONMessage = JSON.parse(parsedMessage);
      var messageObj = JSONMessage.json;
      console.log(messageObj)
      if(!storage[messageObj.username]){
        storage[messageObj.username] = [messageObj];
      } else {
        storage[messageObj.username].unshift(messageObj);
      }
      body.push(JSONMessage);
    }).on('end', () => {
      //  body = Buffer.concat(body).toString();
    });
    headers_res['Content-Type'] = 'application/json'; //change!
    response.writeHead(statusCode, headers_res);
    response.write(JSON.stringify(body));
  } else if(request.method === 'GET' && request.url === '/classes/messages') {
    // look at request to get room name, if none specified, default lobby
    const responseBody = []
    request.on('data', (message) => {
      var parsedMessage = String.fromCharCode(...message)
      var JSONMessage = JSON.parse(parsedMessage);
      if (!message.roomname) {
        message.roomname = 'lobby';
      }
      storage[message.roomname].forEach((msg) => {
        responseBody.push(msg);
      })
    })
   //grab necesarry information from data-structure
   //for each message in storag[roomname]
     //push to response body
    headers_res['Content-Type'] = 'application/json'; //change!
    response.writeHead(statusCode, headers_res);
    // console.log(responseBody)
    response.write(JSON.stringify(responseBody));
  } else {
    response.writeHead(404);
    // console.log(response)
  }

  // See the note below about CORS headers.
  response.end();
};


var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;
