function server () {
	this.setup = function () {}

	this.datatypes = {};

	this.datatype_checks = {};

	this.templates = {
		"create a new server" : {
			docs : "Use this line to start your server. You can define when blocks for each route before this line, but no synchonous server code should be run before this line. Use when blocks to define your routes using the pattern, \"{{name}}: when ((the:a:an:)) {{method}} request matches {{path}}\". You can also leave the method out if you would like. The when block will be run any time that endpoint gets a request. If no registered endpoint is found, then the event \"no endpoint is found\" will be triggered (this allows you to set a custom 404).",
			func : function () {
				var http_module = require("http");
				var url_module = require("url");
				let port = process.env.PORT;
				if (port == null || port == "") {
					port = 8000;
				}
				http_module.createServer(function (request, response) {
					var url_object = url_module.parse(request.url, true);
					var endpoint_event_names = [
						request.method.toLowerCase()+" request matches "+url_object.pathname.replace(/^\/+|\/+$/g, ''),
						request.method.toUpperCase()+" request matches "+url_object.pathname.replace(/^\/+|\/+$/g, '')
					];
					if (endpoint_event_names.filter(function(x){return event_is_registered(x);}).length == 0) {
						if (event_is_registered("no endpoint is found")) {
							trigger_event("no endpoint is found"); //404
						} else {
							response.writeHead(404);
						}
					} else {
						endpoint_event_names.forEach(function(x){
							trigger_event(x);
						});
					}
					response.end();
				}).listen(port);
			}
		},

		/*"send" : {
			docs : "",
			func : function () {
				response.writeHead(200, {"Content-Type": "text/html"});
			}
		}*/
	}
}
