/*
  File: index.ts
  Author: yrfonfria@gmail.com
  Created at: 07/10/2024 10:17
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import https, { Server } from 'node:https';
import httpProxy from 'http-proxy';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { IncomingMessage, ServerResponse } from 'node:http';
import { authorize } from './utils/credential.resolver';
import { Socket } from 'node:net';
import { inspect } from 'node:util';

const UPSTREAM_URL = 'https://gitlab.com';

const proxy = httpProxy.createProxyServer({ secure: false });

proxy.on('error', (e, _req: IncomingMessage, res: ServerResponse | Socket) => {
  console.error('Error from proxy:', e);
  (res as ServerResponse).statusCode = 500;
  res.end();
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  proxyReq.setHeader('authorization', authorize().authorization );
  console.log(req.headers);
});

const key = readFileSync(join(__dirname, '../certs/key.pem'));
const cert = readFileSync(join(__dirname, '../certs/cert.pem'));

const server: Server = https.createServer(
  {
    key,
    cert
  }
  , (req: IncomingMessage, res: ServerResponse) => {
    console.log('Received request', req.url);
    proxy.web(req, res, { target: UPSTREAM_URL });
});

server.listen(3000, () => console.info('Proxy listening on port 3000'));
