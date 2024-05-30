const pwds = require('./index');

// generate passwords with default parameters
pwds.generate().forEach(pw => console.log('default', pw));

// generate passwords with custom parameters
pwds
  .generate({ passwordQuantity: 21, passwordLength: 16 })
  .forEach(pw => console.log('custom', pw));
