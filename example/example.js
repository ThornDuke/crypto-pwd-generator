const pwds = require('../index.js');

//////
// Generate a list of passwords with default parameters
const pwList = pwds.generate();
pwList.forEach(pw => console.log('default', pw));

// ... or just a single password
const pw = pwds.password();
console.log('one default', pw);

//////
// Generate 20 passwords 32 characters long in the
// format of hexadecimal numbers
let params = {
  quantity: 20,
  pwLength: 32,
  uppercases: 'abcdef0123456789',
  lowercases: 'abcdef0123456789',
  symbols: 'abcdef0123456789',
  digits: 'abcdef0123456789',
};

const hexPwList = pwds.generate(params);
hexPwList.forEach(pw => console.log('hexadecimal', pw));

// one password with the same requirements
const custPw = pwds.password(params);
console.log('one hexadecimal', custPw);

//////
// Generate 10 passwords 8 characters long without
// uppercase characters or symbols; only numbers
// and lowercase characters.
params = {
  pwLength: 8,
  uppercases: 'abcdefghijklmnopqrstuvwxyz',
  symbols: '1234567890',
};

const noUpCasePwList = pwds.generate(params);
noUpCasePwList.forEach(pw => console.log('no uppercases', pw));

// one password with the same requirements
const noUpCasePw = pwds.password(params);
console.log('one no uppercases', noUpCasePw);

pwds
  .generateAsync()
  .then(pws => console.log('async:', pws))
  .catch(error => console.error(error));

pwds
  .passwordAsync()
  .then(pw => console.log('one async:', pw))
  .catch(error => console.error(error));
