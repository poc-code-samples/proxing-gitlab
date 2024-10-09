/*
  File: httpClient.spec.ts
  Author: yrfonfria@gmail.com
  Created at: 08/10/2024 12:26
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import client from '../../src/util/httpClient';
import { URL } from 'node:url';
import { inspect } from 'node:util';

const STATUS_SUCCESS = /^2\d\d$/;

describe('Client: ', () => {

  it('must work for https', async () => {

    const url = 'https://www.google.com';
    const res = await client.fetch(new URL(url), { method: 'GET', headers: new Map() });

    console.log(inspect(res.headers));
    console.log(inspect(res.data.toString()));

    expect(`${res.status}`).toMatch(STATUS_SUCCESS);
    expect(res.data).toBeDefined();


  });
});
