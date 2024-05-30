'use strict';

const crypto = require('node:crypto');

const $_DEBUG = false;

let defaults = {
  pwLength: { type: 'number', min: 8, max: 128, default: 12 },
  quantity: { type: 'number', min: 1, max: 100, default: 10 },
  uppercases: { type: 'string', min: 4, max: 128, default: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
  uppercasesQty: { type: 'number', min: 1, max: 2, default: 1 },
  lowercases: { type: 'string', min: 4, max: 128, default: 'abcdefghijklmnopqrstuvwxyz' },
  lowercasesQty: { type: 'number', min: 1, max: 2, default: 1 },
  digits: { type: 'string', min: 4, max: 128, default: '1234567890' },
  digitsQty: { type: 'number', min: 1, max: 2, default: 1 },
  symbols: { type: 'string', min: 4, max: 128, default: '£$%&+*/-@#' },
  symbolsQty: { type: 'number', min: 1, max: 2, default: 1 },
};

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
 * @param {Array} arr An array of elements
 * @returns {Array} A shuffled array of elements
 */
function shuffleArray(arr) {
  let result = [...arr];

  if (arr.length !== 0 && arr.length !== 1) {
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
  const result = str.length === 0 || str.length === 1 ? str : shuffleArray(str.split('')).join('');

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
  const uc = shuffleString(defaults.uppercases.default);
  const lc = shuffleString(defaults.lowercases.default);
  const d = shuffleString(defaults.digits.default);
  const s = shuffleString(defaults.symbols.default);

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
 * @example checkPassword('fT5s@hjJ', 2, defaults.uppercases.default) // true
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
    !checkPassword(pwd, defaults.uppercasesQty.default, defaults.uppercases.default) ||
    !checkPassword(pwd, defaults.lowercasesQty.default, defaults.lowercases.default) ||
    !checkPassword(pwd, defaults.digitsQty.default, defaults.digits.default) ||
    !checkPassword(pwd, defaults.symbolsQty.default, defaults.symbols.default)
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
    for (let i = 1; i <= defaults.pwLength.default; i++) {
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
 * to _length_ characters. the array has `getPwdListLength`
 * elements. It is the method called by the extension
 * to produce and print password lists.
 *
 * @returns {string[]} An array of strings
 */
function createPasswordList() {
  let result = [];
  const spins = defaults.quantity.default;

  for (let i = 1; i <= spins; i++) {
    const password = createPassword();
    result.push(password);
  }

  if ($_DEBUG) console.log('| DEBUG | <createPasswordList> =>', { result });

  return result;
}

/**
 * Check that the passed parameters conform to certain
 * characteristics. It does not raise errors; if a
 * parameter does not comply, the default parameter
 * is used. It returns no value.
 *
 * @param {object} [params] An object containing parameters
 */
function checkParams(params) {
  function isConform(val, reqType, min, max) {
    return (
      val !== undefined &&
      typeof val === reqType &&
      (reqType === 'number' ? Number.isInteger(val) === true : true) &&
      (reqType === 'number' ? val >= min && val <= max : val.length >= min && val.length <= max)
    );
  }

  if (
    isConform(
      params.pwQuantity,
      defaults.quantity.type,
      defaults.quantity.min,
      defaults.quantity.max
    )
  )
    defaults.quantity.default = params.pwQuantity;

  if (
    isConform(params.pwLength, defaults.pwLength.type, defaults.pwLength.min, defaults.pwLength.max)
  )
    defaults.pwLength.default = params.pwLength;

  if (
    isConform(
      params.uppercases,
      defaults.uppercases.type,
      defaults.uppercases.min,
      defaults.uppercases.max
    )
  )
    defaults.uppercases.default = params.uppercases;

  if (
    isConform(
      params.uppercasesQty,
      defaults.uppercasesQty.type,
      defaults.uppercasesQty.min,
      defaults.uppercasesQty.max
    )
  )
    defaults.uppercasesQty.default = params.uppercasesQty;

  if (
    isConform(
      params.lowercases,
      defaults.lowercases.type,
      defaults.lowercases.min,
      defaults.lowercases.max
    )
  )
    defaults.lowercases.default = params.lowercases;

  if (
    isConform(
      params.lowercasesQty,
      defaults.lowercasesQty.type,
      defaults.lowercasesQty.min,
      defaults.lowercasesQty.max
    )
  )
    defaults.lowercasesQty.default = params.lowercasesQty;

  if (isConform(params.digits, defaults.digits.type, defaults.digits.min, defaults.digits.max))
    defaults.digits.default = params.digits;

  if (
    isConform(
      params.digitsQty,
      defaults.digitsQty.reqType,
      defaults.digitsQty.min,
      defaults.digitsQty.max
    )
  )
    defaults.digitsQty.default = params.digitsQty;

  if (isConform(params.symbols, defaults.symbols.type, defaults.symbols.min, defaults.symbols.max))
    defaults.symbols.default = params.symbols;

  if (
    isConform(
      params.symbolsQty,
      defaults.symbolsQty.type,
      defaults.symbolsQty.min,
      defaults.symbolsQty.max
    )
  )
    defaults.symbolsQty.default = params.symbolsQty;

  if ($_DEBUG)
    console.log('| DEBUG | <checkParams> =>', {
      params,
      defaults,
    });
}

module.exports.generate = function (params) {
  if (params) checkParams(params);
  const passwordList = createPasswordList();
  return passwordList;
};
