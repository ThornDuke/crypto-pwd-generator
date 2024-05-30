const pwds = require('./index');

// generate passwords with default parameters
pwds.generate().forEach(pw => console.log('default', pw));

// generate passwords with custom parameters
pwds.generate({ quantity: 21, pwLength: 16 }).forEach(pw => console.log('custom', pw));
