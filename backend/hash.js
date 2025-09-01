// hash_generator.js
const bcrypt = require("bcrypt");

const password = process.argv[2]; // get password from command line
const saltRounds = 10;

if (!password) {
  console.log("Usage: node hash_generator.js <password>");
  process.exit(1);
}

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log(`Plain: ${password}`);
  console.log(`Hash:  ${hash}`);
});
