/*
  File: credential.resolver.ts
  Author: yrfonfria@gmail.com
  Created at: 09/10/2024 04:36
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

const username = process.env.GITLAB_USERNAME
const pat = process.env.GITLAB_PAT;

export interface IAuthorization {
  authorization: string;
}

export const authorize = (): IAuthorization => {
  const token = btoa(`${username}:${pat}`);
  console.log(token);
  return { authorization: `Basic ${token}` };
}
