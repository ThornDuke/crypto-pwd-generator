# crypto-pwd-generator

<!--
![npms.io](https://img.shields.io/npms-io/maintenance-score/crypto-pwd-generator?style=plastic&logo=npm&label=maintenance)
![npms.io](https://img.shields.io/npms-io/quality-score/crypto-pwd-generator?style=plastic&logo=npm&label=quality)
![npms.io](https://img.shields.io/npms-io/popularity-score/crypto-pwd-generator?style=plastic&logo=npm&label=popularity)
[![NPM Downloads](https://img.shields.io/npm/d18m/crypto-pwd-generator?style=plastic&logo=npm)](https://www.npmjs.com/package/crypto-pwd-generator)
-->

[![NPM Version](https://img.shields.io/npm/v/crypto-pwd-generator?style=plastic&logo=npm&label=version)](https://www.npmjs.com/package/crypto-pwd-generator)
[![NPM License](https://img.shields.io/npm/l/crypto-pwd-generator?style=plastic&logo=GNU)](https://www.gnu.org/licenses/gpl-3.0.html)
![Node Current](https://img.shields.io/node/v/crypto-pwd-generator?style=plastic&logo=nodedotjs&logoColor=white&logoSize=auto)
![npm bundle size](https://img.shields.io/bundlephobia/min/crypto-pwd-generator?style=plastic&logo=webpack)

A simple, configurable library for generating rock-solid passwords.

## Overview

**crypto-pwd-generator** allows you to generate password lists of any length and composed of any
group of characters. The mechanism is as simple as calling a single function even without any
parameters. It can be used in Node.js CLI applications, WEB applications or VSCode extensions.

The randomization engine is based on the [Crypto](https://nodejs.org/api/crypto.html) library, which
ensures a level of security suitable for industrial or military applications.

## Features

The generator, by default, produces a list of 10 passwords, each of them 12 characters long and
containing at least one uppercase character, at least one lowercase character, at least one number
and at least one special character. It is possible to pass to the generator a list of parameters
with which every aspect of the password list structure can be configured.

## Requirements

`Node` version 8 or later.

## Installation

```bash
npm install crypto-pwd-generator
```

## How to use

```javascript
const pwds = require('crypto-pwd-generator');

// generate passwords with default parameters
const pwdListA = pwds.generate();
pwdListA.forEach(pw => console.log('default', pw));

// generate passwords with custom parameters
const pwdListB = pwds.generate({ quantity: 21, pwLength: 16 });
pwdListB.forEach(pw => console.log('custom', pw));

// I need just ONE password
const password = pwds.generate({ pwLength: 1 })[0];
console.log('one pw', password);
```

## Managing settings

The generator can be invoked without any parameters (in this case the default parameters are used)
or with a parameter consisting of an object containing one or more of the following parameters:

```javascript
const pwds = require('crypto-pwd-generator');

const pwdsList = pwds.generate({
  //////
  // the length of every generated password;
  // type: number; min: 8 chars; max: 128 chars; default: 12 chars;
  pwLength: 12,
  //////
  // the length of the generated list;
  // type: number; min: 1; max: 100; default: 10;
  quantity: 10,
  //////
  // A string containing the uppercase characters used to construct the passwords;
  // type: string; minLength: 8; maxLength: 260; default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  uppercases: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  //////
  // Minimum amount of uppercase characters contained in each password;
  // type: number; min: 1; max: 2; default: 1;
  uppercasesQty: 1,
  //////
  // A string containing the lowercase characters used to construct the passwords;
  // type: string; minLength: 1; maxLength: 260; default: 'abcdefghijklmnopqrstuvwxyz';
  lowercases: 'abcdefghijklmnopqrstuvwxyz',
  //////
  // Minimum amount of lowercase characters contained in each password;
  // type: number; min: 1; max: 2; default: 1;
  lowercasesQty: 1,
  //////
  // A string containing the numbers used to construct the passwords;
  // type: string; minLength: 1; maxLength: 100; default: '0123456789';
  digits: '0123456789',
  //////
  // Minimum amount of digits contained in each password;
  // type: number; min: 1; max: 2; default: 1;
  digitsQty: 1,
  //////
  // A string containing the symbols used to construct the passwords;
  // type: string; minLength: 1; maxLength: 100; default: '£$%&+*/-@#';
  symbols: '£$%&+*/-@#',
  //////
  // Minimum amount of special characters contained in each password;
  // type: number; min: 1; max: 2; default: 1;
  symbolsQty: 1,
});
```

## Contributing

Contributions to this project are welcomed!

Whether you have

- questions, concerns, or suggestions for improving this library
- want to report a bug
- submit a fix
- propose new features

please don't hesitate to reach out to me on GitHub and
[open an issue](https://github.com/ThornDuke/crypto-pwd-generator/issues).

## Disclaimer

This program is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not,
see <https://www.gnu.org/licenses/>.
