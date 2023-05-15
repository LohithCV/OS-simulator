let max = [], allocation = [], need = [];
let np, nr;
let available = [];
const prompt = require ("prompt-sync")
({sigint: true})

function readmatrix(m) {
  for (let i = 0; i < np; i++) {
    for (let j = 0; j < nr; j++) {
      m[i][j] = parseInt(prompt(`Enter value of m[${i}][${j}]: `));
    }
  }
}

function displaymatrix(m) {
  for (let i = 0; i < np; i++) {
    let row = `P${i}\t`;
    for (let j = 0; j < nr; j++) {
      row += m[i][j];
    }
    console.log(row);
  }
}

function cneed() {
  for (let i = 0; i < np; i++) {
    for (let j = 0; j < nr; j++) {
      need[i][j] = max[i][j] - allocation[i][j];
    }
  }
}

function banker() {
  let i, j, k, flag;
  let finished = [], seq = [];

  for (i = 0; i < np; i++) finished[i] = 0;

  for (i = 0; i < np; i++) {
    flag = 0;
    if (finished[i] == 0) {
      for (j = 0; j < nr; j++) {
        if (need[i][j] > available[j]) {
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        finished[i] = 1;
        seq[k++] = i;

        for (let l = 0; l < np; l++) {
          available[j] += allocation[l][j];
        }
        i = -1;
      }
    }
  }
  flag = 0;
  for (i = 0; i < np; i++) {
    if (finished[i] == 0) {
      console.log("the system is in deadlock");
      flag = 1;
      return 0;
    }
  }
  console.log("the system is in safe state \n the safe sequence is :");
  for (i = 0; i < np; i++) {
    console.log(`P-${seq[i]}`);
  }
}

function main() {
  let j;
  np = parseInt(prompt("Enter the number of processes:"));
  nr = parseInt(prompt("Enter the number of resources:"));

  for (let i = 0; i < np; i++) {
    max[i] = new Array(nr);
    allocation[i] = new Array(nr);
    need[i] = new Array(nr);
  }

  console.log("Enter the initial allocation:");
  readmatrix(allocation);

  console.log("Enter the Max requirement:");
  readmatrix(max);

  console.log("Enter available resources:");
  for (j = 0; j < nr; j++) {
    available[j] = parseInt(prompt(`Enter available[${j}]: `));
  }

  cneed();
  console.log("\nNeed Matrix is:");
  displaymatrix(need);

  let x = banker();
}

main();