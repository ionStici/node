const fs = require("fs");
const readline = require("readline");

const interface = readline.createInterface({
  input: fs.createReadStream("./test"),
});

interface.on("line", (line) => console.log(line));
