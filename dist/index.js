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

function getRandomInt(minInteger, maxInteger) {
  let arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  const seed = arr[0] / (0xffffffff + 1);
  return Math.round(seed * (maxInteger - minInteger) + minInteger);
}

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

function shuffleString(str) {
  const result = str.length === 0 || str.length === 1 ? str : shuffleArray(str.split('')).join('');

  if ($_DEBUG) console.log('| DEBUG | <shuffleString> =>', { str, result });

  return result;
}

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

function generate(params) {
  if (params) checkParams(params);
  const passwordList = createPasswordList();
  resetDefaults();
  return passwordList;
}

function password(params) {
  if (params) checkParams(params);
  const pwd = createPassword();
  resetDefaults();
  return pwd;
}
