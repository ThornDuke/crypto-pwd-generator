const pwds = require('./index');

// // generate passwords with default parameters
// pwds.generate().forEach(pw => console.log('default', pw));

// // generate passwords with custom parameters
// const params = {
//   quantity: 20,
//   pwLength: 32,
//   uppercases: 'abcdef0123456789',
//   lowercases: 'abcdef0123456789',
//   symbols: 'abcdef0123456789',
//   digits: 'abcdef0123456789',
// };
// pwds.generate(params).forEach(pw => console.log('custom', pw));

// // generate one password with default parameters
// const password = pwds.password();
// console.log('one pwd', password);

// // generate passwords with custom parameters
// const customParPassword = pwds.password(params);
// console.log('one custom pwd', customParPassword);

// user names for playok
params = {
  pwLength: 8,
  uppercases: 'abcdefghijklmnopqrstuvwxyz',
  symbols: '1234567890',
};
pwds.generate(params).forEach(pw => console.log('playok =>', pw));
