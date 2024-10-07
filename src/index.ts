/*
  File: index.ts
  Author: yrfonfria@gmail.com
  Created at: 07/10/2024 10:17
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import express, { Express, Request, Response } from 'express';
import httpClient, { IFetchOptions } from './util/httpClient';


const base = 'https://gitlab.com';
const username = process.env.GITLAB_USERNAME
const pat = process.env.GITLAB_PAT;

const AUTHORIZATION = /^authorization$/;

const forward = async (req: Request, res: Response) => {
  const options: IFetchOptions = {
    method: req.method,
    headers: new Map<string, string>()
  }

  for (const k in req.headers) {
    if (!AUTHORIZATION.test(k.toLowerCase().trim())) {
      options.headers.set(k, req.headers[k]);
    }
  }

  options.headers.set('authorization', `Basic ${btoa(`${username}:${pat}`)}`);

  const originalUrl = req.originalUrl;
  const url = new URL(originalUrl, base);
  const response = await httpClient.fetch(url, options);

  for (const h in response.headers) {
    res.set(h, response.headers[h]);
  }

  res.send(response.data);

}

const app: Express = express();

app.all('*', (req: Request, res: Response) => {
  forward(req, res);
});


app.listen(3000, () => console.log('Server listening on port 3000'));
