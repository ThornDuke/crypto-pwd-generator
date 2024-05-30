'use strict';

const crypto = require('node:crypto');

const $_DEBUG = false;

let defaults = {
  PASSWORD_LENGTH: 12,
  PASSWORD_QUANTITY: 10,
  UPPERCASES: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  UPPERCASES_OCCURRENCES: 1,
  LOWERCASES: 'abcdefghijklmnopqrstuvwxyz',
  LOWERCASES_OCCURRENCES: 1,
  DIGITS: '0123456789',
  DIGITS_OCCURRENCES: 1,
  SYMBOLS: '£$%&+*/-@#',
  SYMBOLS_OCCURRENCES: 1,
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
  const uc = shuffleString(defaults.UPPERCASES);
  const lc = shuffleString(defaults.LOWERCASES);
  const d = shuffleString(defaults.DIGITS);
  const s = shuffleString(defaults.SYMBOLS);

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
 * @example checkPassword('fT5s@hjJ', 2, defaults.UPPERCASES) // true
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
    !checkPassword(pwd, defaults.UPPERCASES_OCCURRENCES, defaults.UPPERCASES) ||
    !checkPassword(pwd, defaults.LOWERCASES_OCCURRENCES, defaults.LOWERCASES) ||
    !checkPassword(pwd, defaults.DIGITS_OCCURRENCES, defaults.DIGITS) ||
    !checkPassword(pwd, defaults.SYMBOLS_OCCURRENCES, defaults.SYMBOLS)
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
    for (let i = 1; i <= defaults.PASSWORD_LENGTH; i++) {
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
  const spins = defaults.PASSWORD_QUANTITY;

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

  if (isConform(params.passwordQuantity, 'number', 1, 100))
    defaults.PASSWORD_QUANTITY = params.passwordQuantity;
  if (isConform(params.passwordLength, 'number', 8, 128))
    defaults.PASSWORD_LENGTH = params.passwordLength;
  if (isConform(params.uppercases, 'string', 1, 260)) defaults.UPPERCASES = params.uppercases;
  if (isConform(params.uppercasesOccurrences, 'number', 1, 2))
    defaults.UPPERCASES_OCCURRENCES = params.uppercasesOccurrences;
  if (isConform(params.lowercases, 'string', 1, 260)) defaults.LOWERCASES = params.lowercases;
  if (isConform(params.lowercasesOccurrences, 'number', 1, 2))
    defaults.LOWERCASES_OCCURRENCES = params.lowercasesOccurrences;
  if (isConform(params.digits, 'string', 1, 100)) defaults.DIGITS = params.digits;
  if (isConform(params.digitsOccurrences, 'number', 1, 2))
    defaults.DIGITS_OCCURRENCES = params.digitsOccurrences;
  if (isConform(params.symbols, 'string', 1, 100)) defaults.SYMBOLS = params.symbols;
  if (isConform(params.symbolsOccurrences, 'number', 1, 2))
    defaults.SYMBOLS_OCCURRENCES = params.symbolsOccurrences;

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
