// // // // // // // // // // // // // // //
// ALL BUILT-IN CORE MODULES
const coreModules = require("module").builtinModules;
// console.log(console); // global module

// // // // // // // // // // // // // // //
// IMPORT
const msg = require("./export");
// console.log(msg);

// // // // // // // // // // // // // // //
// process GLOBAL MODULE
// console.log(process);
// console.log(process.env);
// console.log(process.env.PWD);
// console.log(process.memoryUsage());
// console.log(process.memoryUsage().heapUsed);
// console.log(process.argv[2]);

// // // // // // // // // // // // // // //
// os CORE MODULE
const os = require("os");

const local = {
  "Operating System": os.type(), // computer's operating system
  "CPU architecture": os.arch(), // operating system CPU architecture
  "Network Interfaces": os.networkInterfaces(), // network interfaces (IP / MAC)
  "Home Directory": os.homedir(), // current user's home directory
  Hostname: os.hostname(), // the hostname of the operating system
  "Last Reboot": os.uptime(), //the system uptime (in seconds)
};

// console.log(local);
// console.log(local.Hostname);
// console.log(local["Operating System"]);

// // // // // // // // // // // // // // //
// util CORE MODULE
const util = require("util");

// const today = new Date();
// console.log(util.types.isDate(today));
