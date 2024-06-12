/**
 * @fileoverview password generator engine
 *
 * @description
 * This file contains the password creation engine. The internal
 * state consists of the characters used to construct passwords
 * and related restrictions. The module exports two functions:
 * 1) `generate`: returns an array of strings/passwords;
 * 2) `password`: returns a single string/password
 *
 * @author Thorn Duke
 * @copyright 2024
 * @license GPL-3.0-or-later
 */
'use strict';

const crypto = require('node:crypto');

const $_DEBUG = false;

let defaults = {
  pwLength: { type: 'number', min: 8, max: 128, value: 12 },
  quantity: { type: 'number', min: 1, max: 100, value: 10 },
  uppercases: { type: 'string', min: 4, max: 128, value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  uppercasesQty: { type: 'number', min: 1, max: 2, value: 1 },
  lowercases: { type: 'string', min: 4, max: 128, value: 'abcdefghijklmnopqrstuvwxyz' },
  lowercasesQty: { type: 'number', min: 1, max: 2, value: 1 },
  digits: { type: 'string', min: 4, max: 128, value: '1234567890' },
  digitsQty: { type: 'number', min: 1, max: 2, value: 1 },
  symbols: { type: 'string', min: 4, max: 128, value: '£$%&+*/-@#' },
  symbolsQty: { type: 'number', min: 1, max: 2, value: 1 },
};

function resetDefaults() {
  defaults.pwLength.value = 12;
  defaults.quantity.value = 10;
  defaults.uppercases.value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  defaults.uppercasesQty.value = 1;
  defaults.lowercases.value = 'abcdefghijklmnopqrstuvwxyz';
  defaults.lowercasesQty.value = 1;
  defaults.digits.value = '1234567890';
  defaults.digitsQty.value = 1;
  defaults.symbols.value = '£$%&+*/-@#';
  defaults.symbolsQty.value = 1;
}

/**
 * Produces a random integer between `minInteger` (inclusive)
 * and `maxInteger` (inclusive), using the `crypto` library
 *
 * @param {integer} minInteger
 * @param {integer} maxInteger
 * @returns {integer} An integer between `minInteger` and `maxInteger`
 *
 * @example getRandomInt(7, 23) // 14
 */
function getRandomInt(minInteger, maxInteger) {
  const result = crypto.randomInt(minInteger, maxInteger + 1);

  if ($_DEBUG) console.log('| DEBUG | <getRandomInt> =>', { minInteger, maxInteger, result });

  return result;
}

/**
 * Takes an array of elements and returns an array with
 * the same elements, but in random order.
 * Uses the [Fisher-Yates Shuffle Algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 * applied three times.
 *
 * @param {Array} arr - An array of elements
 * @returns {Array} A shuffled array of elements
 */
function shuffleArray(arr) {
  let result = [...arr];

  if (arr.length > 1) {
    for (let k = 1; k <= 3; k++) {
      for (let i = result.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i);
        [result[i], result[j]] = [result[j], result[i]];
      }
    }

    if ($_DEBUG) console.log('| DEBUG | <shuffleArray> =>', { arr, result });

    return result;
  }
}

/**
 * Takes a string and returns another string
 * with the same chars, but in random order.
 *
 * @param {string} str A string
 * @returns {string} A shuffled string
 *
 * @example shuffleString('shuffle this') // 'uhsfh istfle'
 */
function shuffleString(str) {
  const result = str.length <= 1 ? str : shuffleArray(str.split('')).join('');

  if ($_DEBUG) console.log('| DEBUG | <shuffleString> =>', { str, result });

  return result;
}

/**
 * Creates the string to use to construct the password.
 * The string consists of all uppercase and lowercase characters,
 * digits and symbols mixed together in various ways.
 *
 * @returns {string}
 *
 * @example createPool() // '5%k#BC1j2Fm3GEiADh6l@&0'
 */
function createPool() {
  const uc = shuffleString(defaults.uppercases.value);
  const lc = shuffleString(defaults.lowercases.value);
  const d = shuffleString(defaults.digits.value);
  const s = shuffleString(defaults.symbols.value);

  const result = shuffleString(uc + lc + d + s);

  if ($_DEBUG) {
    console.log('| DEBUG | <createPool> =>', {
      consts: { uc, lc, d, s },
      result,
    });
  }

  return result;
}

/**
 * Takes a string and checks if it contains at
 * least `occurrences` characters among those
 * contained in a given string
 *
 * @param {string} str the password to check
 * @param {number} occurrences how many chars in `str` are contained in `refStr`
 * @param {string} refStr the string used to check the password
 * @returns {boolean}
 *
 * @example checkPassword('fT5s@hjJ', 2, defaults.uppercases.value) // true
 */
function checkPassword(str, occurrences, refStr) {
  let result = false;
  let stack = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (refStr.includes(char)) {
      stack += char;
    }
    if (stack.length >= occurrences) {
      result = true;
      break;
    }
  }

  if ($_DEBUG)
    console.log('| DEBUG | <checkPassword> =>', { str, occurrences, refStr, stack, result });

  return result;
}

/**
 * Takes a password (a string) and checks that it contains
 * at least `occurrences` uppercase character, `occurrences`
 * lowercase character, `occurrences` number and
 * `occurrences` special character.
 *
 * @param {string} pwd the password to check
 * @returns {boolean} true if the password is valid, false otherwise.
 */
function isValidPassword(pwd) {
  let result = true;

  if (
    !checkPassword(pwd, defaults.uppercasesQty.value, defaults.uppercases.value) ||
    !checkPassword(pwd, defaults.lowercasesQty.value, defaults.lowercases.value) ||
    !checkPassword(pwd, defaults.digitsQty.value, defaults.digits.value) ||
    !checkPassword(pwd, defaults.symbolsQty.value, defaults.symbols.value)
  )
    result = false;

  if ($_DEBUG) console.log('| DEBUG | <isValidPassword> =>', { pwd, result });

  return result;
}

/**
 * Creates a password
 *
 * @returns {string} the password
 */
function createPassword() {
  let result;
  const pool = createPool();

  do {
    result = '';
    for (let i = 1; i <= defaults.pwLength.value; i++) {
      const index = getRandomInt(0, pool.length - 1);
      result += pool[index];
    }
  } while (!isValidPassword(result));

  result = shuffleString(result);

  if ($_DEBUG) console.log('| DEBUG | <createPassword> =>', { result });

  return result;
}

/**
 * Produces an array containing passwords of length equal
 * to _defaults.pwLength.value_ characters.
 *
 * @returns {string[]} An array of strings
 */
function createPasswordList() {
  let result = [];
  const spins = defaults.quantity.value;

  for (let i = 1; i <= spins; i++) {
    const password = createPassword();
    result.push(password);
  }

  if ($_DEBUG) console.log('| DEBUG | <createPasswordList> =>', { result });

  return result;
}

/**
 * Check if the passed parameters conform to certain
 * characteristics. It does not raise errors; if a
 * parameter does not comply, the default parameter
 * is used. It returns no value.
 *
 * @param {object} [params] An object containing parameters
 */
function checkParams(params) {
  function isConform(val, { type, min, max }) {
    return (
      val !== undefined &&
      typeof val === type &&
      (type === 'number' ? Number.isInteger(val) === true : true) &&
      (type === 'number' ? val >= min && val <= max : val.length >= min && val.length <= max)
    );
  }

  if (isConform(params.quantity, defaults.quantity)) defaults.quantity.value = params.quantity;

  if (isConform(params.pwLength, defaults.pwLength)) defaults.pwLength.value = params.pwLength;

  if (isConform(params.uppercases, defaults.uppercases))
    defaults.uppercases.value = params.uppercases;

  if (isConform(params.uppercasesQty, defaults.uppercasesQty))
    defaults.uppercasesQty.value = params.uppercasesQty;

  if (isConform(params.lowercases, defaults.lowercases))
    defaults.lowercases.value = params.lowercases;

  if (isConform(params.lowercasesQty, defaults.lowercasesQty))
    defaults.lowercasesQty.value = params.lowercasesQty;

  if (isConform(params.digits, defaults.digits)) defaults.digits.value = params.digits;

  if (isConform(params.digitsQty, defaults.digitsQty)) defaults.digitsQty.value = params.digitsQty;

  if (isConform(params.symbols, defaults.symbols)) defaults.symbols.value = params.symbols;

  if (isConform(params.symbolsQty, defaults.symbolsQty))
    defaults.symbolsQty.value = params.symbolsQty;

  if ($_DEBUG)
    console.log('| DEBUG | <checkParams> =>', {
      params,
      defaults,
    });
}

module.exports.generate = function (params) {
  if (params) checkParams(params);
  const passwordList = createPasswordList();
  resetDefaults();
  return passwordList;
};

module.exports.password = function (params) {
  if (params) checkParams(params);
  const pwd = createPassword();
  resetDefaults();
  return pwd;
};

module.exports.generateAsync = function (params) {
  return new Promise((resolve, reject) => {
    try {
      if (params) checkParams(params);
      const passwordList = createPasswordList();
      resetDefaults();
      resolve(passwordList);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.passwordAsync = function (params) {
  return new Promise((resolve, reject) => {
    try {
      if (params) checkParams(params);
      const pwd = createPassword();
      resetDefaults();
      resolve(pwd);
    } catch (error) {
      reject(error);
    }
  });
};
