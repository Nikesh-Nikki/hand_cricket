import bcrypt from "bcrypt"

const hash = await bcrypt.hash("hey",0);
console.log(hash);
const rehash = await bcrypt.hash("hey",0)
console.log(rehash);

const temp = await bcrypt.compare("heyy",hash)
console.log(temp);