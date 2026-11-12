'use strict';

const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..', 'public');
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.txt': 'text/plain; charset=utf-8' };

const server = http.createServer(async (request, response) => {
	try {
		const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
		const filename = path.resolve(root, `.${pathname.endsWith('/') ? `${pathname}index.html` : pathname}`);
		if (!filename.startsWith(root + path.sep)) {
			response.writeHead(403).end('Forbidden');
			return;
		}
		const content = await fs.readFile(filename);
		response.writeHead(200, {
			'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
			'Cache-Control': 'no-store',
			'X-Content-Type-Options': 'nosniff'
		}).end(content);
	} catch (error) {
		if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
			response.writeHead(404).end('Not found');
		} else if (error instanceof URIError) {
			response.writeHead(400).end('Invalid URL');
		} else {
			console.error(error);
			response.writeHead(500).end('Unable to serve this file.');
		}
	}
});

server.on('error', error => {
	console.error(error);
	process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
	console.log(`Pet Personality Quiz: http://127.0.0.1:${server.address().port}`);
});
