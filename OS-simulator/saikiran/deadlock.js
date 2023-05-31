const prompt = require ("prompt-sync")
({sigint: true})
const MAX_R = 10;
const MAX_P = 10;
let num_r, num_p;
let visited = new Array(MAX_P).fill(0);
let cycle = 0;

function cyclic(adj, node) {
  visited[node] = 1;
  for (let i = 0; i < num_p; i++) {
    if (adj[node][1] == 1 && visited[i] == 0) {
      cyclic(adj, i);
    } else if (adj[node][i] == 1 && visited[i] == 1) {
      cycle = 1;
      return;
    }
    if (cycle == 1) break;
  }
  visited[node] = -1;
}

function main() {
  let resources = new Array(MAX_R);
  console.log("Enter number of processes: ");
  // use prompt() function to read input in the browser environment
  num_p = parseInt(prompt());
  console.log("Enter number of resources: ");
  num_r = parseInt(prompt());
  let rag = new Array(MAX_P).fill(0).map(() => new Array(MAX_R).fill(0));
  for (let i = 0; i < num_r; i++) {
    console.log(`Enter the number of instances of resource ${i + 1}: `);
    resources[i] = parseInt(prompt());
  }
  for (let i = 0; i < num_p; i++) {
    console.log(`Enter the resources ${i + 1} process is waiting for: `);
    wh
    {
      let k = parseInt(prompt());
      rag[i][k - 1]++;
      let c = prompt();
      if (c === '\n' || c === '') break;
    }
  }
  for (let i = 0; i < num_r; i++) {
    console.log(`Enter processes resource ${i + 1} is allocated to: `);
    while (true) {
      let k = parseInt(prompt());
      rag[k - 1][i]--;
      let c = prompt();
      if (c === '\n' || c === '') break;
    }
  }
  let wfg = new Array(MAX_P).fill(0).map(() => new Array(MAX_R).fill(0));
  for (let i = 0; i < num_p; i++) {
    for (let j = 0; j < num_r; j++) {
      if (rag[i][j] == 1) {
        for (let k = 0; k < num_p; k++) {
          if (rag[k][j] == -1) {
            wfg[i][k] = 1;
            break;
          }
        }
      }
    }
  }
  cyclic(wfg, 0);
  if (cycle == 1) {
    let deadlock = 0;
    for (let i = 0; i < num_r; i++) {
      let requests = 0,
        allocations = 0;
      for (let j = 0; j < num_p; j++) {
        if (rag[j][i] >= 1) requests += rag[j][i];
        else if (rag[j][i] <= -1) allocations -= rag[j][i];
      }
      if (resources[i] - allocations < requests) {
        console.log("Deadlock detected");
        deadlock = 1;
        break;
      }
    }
    if (deadlock == 0) {
      console.log("No deadlock detected");
    }
  } else console.log("No deadlock detected");
}

main();
