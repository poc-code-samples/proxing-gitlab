/*
  File: httpClient.ts
  Author: yrfonfria@gmail.com
  Created at: 17/06/2024 07:15
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import http, { ClientRequest } from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_HTTPS_PORT = 443;
const HTTP_PROTO = 'http:';
const HTTPS_PROTO = 'https:';

export interface IFetchOptions {
  method: string;
  headers: Map<string, string | string[] | undefined>;
}

export interface IFetchResult {
  headers: any;
  data: any;
}

export interface IClient {
  fetch(uri: URL, options: IFetchOptions, data?: string): Promise<IFetchResult>;
}

class Client implements IClient {

  public async fetch(url: URL, options: IFetchOptions, data?: string): Promise<IFetchResult> {

    let cli = undefined;
    let agent: any;

    // Will handle only these protocols.
    switch (true) {
      case (url.protocol === HTTP_PROTO):
        cli = http;
        agent = new http.Agent({ keepAlive: true });
        break;
      case (url.protocol === HTTPS_PROTO):
        cli = https;
        agent = new https.Agent({ keepAlive: true});
        break;
      default:
        throw new Error(`Protocol ${url.protocol} not suported`)
    }

    return new Promise((resolve, reject) => {

      const headers = Object.fromEntries(options.headers);
      headers.host = url.hostname;

      console.log(headers);

      const opts = {
        hostname: url.hostname,
        port: url.port || url.protocol === HTTP_PROTO ? DEFAULT_HTTP_PORT : DEFAULT_HTTPS_PORT,
        headers,
        path: url.pathname + url.search || '',
        method: options.method,
        agent
      }

      if (!!process.env.HTTP_CLIENT_VERBOSE) {
        console.log(`Request url: ${url.toString()}`);
        console.log('Options', opts );
      }

      const req: ClientRequest = cli?.request(opts, (res) => {

        let acc: Buffer[] = [];
        res.on('data', (chunk: Buffer) => {
          acc.push(chunk);
        });

        res.on('end', () => {

          const result = Buffer.concat(acc);

          if (!!process.env.HTTP_CLIENT_VERBOSE) {
            console.log(`>>> Data Received:`, result);
          }

          resolve({headers: res.headers, data: result })

        });

      });

      req.on('error', (e: Error) => {
        console.log(e);
        reject(new Error('upstream server responded with error'));
      });

      if (['POST', 'PUT', 'PATCH'].includes(options.method.toUpperCase()) && data) {
        req.write(data);
      }

      req.end();
    });
  }
}

export default new Client();
