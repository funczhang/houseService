var sys = require('sys'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    mime = {
       "css": "text/css",
       "gif": "image/gif",
       "html": "text/html",
       "ico": "image/x-icon",
       "jpeg": "image/jpeg",
       "jpg": "image/jpeg",
       "js": "text/javascript", 
       "json": "application/json",
       "pdf": "application/pdf",
       "png": "image/png",
       "txt": "text/plain",
       "xml": "text/xml",
       "swf": "application/x-shockwave-flash",
       "wav": "audio/x-wav",
       "wma": "audio/x-ms-wma",
       "wmv": "video/x-ms-wmv",
       "svg": "image/svg+xml"
    },
    config = {
        Expires: {
            fileMatch: /^(gif|png|jpg|js|css)$/ig,
            maxAge: 60 * 60 * 24 * 365
        },
        Compress: {
            match: /css|js|html/ig
        }
    },
    zlib = require('zlib'),
    utils = {
        parseRange: function (str, size) {
            if (str.indexOf(",") != -1) {
               return;
            }

            var range = str.split("-");
                start = parseInt(range[0], 10),
                end = parseInt(range[1], 10);

            // Case: -100
            if (isNaN(start)) {
                start = size - end;
                end = size - 1;
            }
            else if (isNaN(end)) {
                // Case: 100-
                end = size - 1;
            }

            // Invalid
            if (isNaN(start) || isNaN(end) || start > end || end > size) {
                return;
            }

            return {start: start, end: end};
        }
    };

http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;
    
    var filename = path.join(__dirname, uri == '/' ? '/index.html' : uri);

    var compressHandle = function (raw, compressMatched, statusCode, reasonPhrase) {
        var stream = raw;
        var acceptEncoding = request.headers['accept-encoding'] || "";
        var matched = compressMatched; // ext.match(config.Compress.match);

        if (matched && acceptEncoding.match(/\bgzip\b/)) {

            response.setHeader("Content-Encoding", "gzip");
            stream = raw.pipe(zlib.createGzip());

        } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {

            response.setHeader("Content-Encoding", "deflate");
            stream = raw.pipe(zlib.createDeflate());
        }

        response.writeHead(statusCode, reasonPhrase);
        stream.pipe(response);
    };

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        var ext = path.extname(filename);
        ext = ext ? ext.slice(1) : 'unknow';
        var contentType = mime[ext] || 'text/plain';
        response.setHeader('Content-Type', contentType);

        fs.stat(filename, function (err, stat) {
            var lastModified = stat.mtime.toUTCString();
            var ifModifiedSince = "If-Modified-Since".toLowerCase();

            response.setHeader("Last-Modified", lastModified);
            response.setHeader("Server", "Node/V2");

            // add cache control
            if (ext.match(config.Expires.fileMatch)) {
                var expires = new Date();
                expires.setTime(expires.getTime() + config.Expires.maxAge * 1000);
                response.setHeader("Expires", expires.toUTCString());
                response.setHeader("Cache-Control", "max-age=" + config.Expires.maxAge);
            }

            if (request.headers[ifModifiedSince] && lastModified == request.headers[ifModifiedSince]) {
                response.writeHead(304, 'Not Modified');
                response.end();
                return;
            }

            var compressMatched = ext.match(config.Compress.match);

            if (request.headers["range"]) {
                var range = utils.parseRange(request.headers["range"], stat.size);
                if (range) {
                    response.setHeader("Content-Range", "bytes " + range.start + "-" + range.end + "/" + stat.size);
                    response.setHeader("Content-Length", (range.end - range.start + 1));
                    var raw = fs.createReadStream(filename, { "start": range.start, "end": range.end });
                    compressHandle(raw, compressMatched, 206, "Partial Content");
                }
                else {
                    response.removeHeader("Content-Length");
                    response.writeHead(416, "Request Range Not Satisfiable");
                    response.end();
                }
            }
            else {
                var raw = fs.createReadStream(filename);
                compressHandle(raw, compressMatched, 200, "OK");
            }
        });
    });
}).listen(8008);

console.log('server running at http://localhost:8008/');
