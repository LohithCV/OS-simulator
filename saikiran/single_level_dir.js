const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let nf = 0;
let fname = [];
let mdname = '';

function createFile() {
  rl.question('Enter file name to be created:', (name) => {
    if (fname.includes(name)) {
      console.log(`There is already a file named ${name}`);
      createFile();
    } else {
      fname.push(name);
      nf++;
      rl.question('Do you want to enter another file? (yes - 1 or no - 0):', (ch) => {
        if (ch == '1') {
          createFile();
        } else {
          console.log(`Directory name is: ${mdname}`);
          console.log('Files names are:');
          for (let i = 0; i < nf; i++) {
            console.log(fname[i]);
          }
          rl.close();
        }
      });
    }
  });
}

rl.question('Enter the directory name:', (name) => {
  mdname = name;
  createFile();
});