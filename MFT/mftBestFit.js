
var noOfPartitions = 0;
var currProcessId = 0;
var partitionOccupied = [];
var partition_size = [];
var partition_process_id = [];

var total_mem_size = 0;

//Variables Defining Canvas
var xstart = 10
var ystart = 10
var canvasWidth = 150
var canvasHeight = 500

//Partition Canvas
var partitionStart=[]
var partitionEnd=[]

//Ready Input Queue
var input_queue_process_size= []
var input_queue_process_id= []
var input_queue_size = 0

//Calculating Fragmentation
var internalFragments=0;
var externalFragments=0;
var processMap = new Map();

$(document).ready(function () {
  $("#noOfPartitionsBtn").click(function () {
    displayPartSize();
  });
});

function displayPartSize() {
  noOfPartitions = Number($("#noOfPartitions").val());
  var htmlText = '<h2>Partition Sizes</h2>';
  var i;
  for (i = 1; i <= noOfPartitions; i++) {
    htmlText +=
      `
      <div class="form-group">
          <label>Size of partition ` + String(i) + ` : </label>
          <input type="text" class="form-control" id="part-size-` + String(i) + `" placeholder="Enter size of partitition ` + String(i) + `">
          <br>
      </div>
      `;
  }
  htmlText +=
    `
  <button type="submit" class="btn btn-primary" id="parts-size-btn">Submit</button>
  `;
  $("#partitionSizeForm").html(htmlText);
  $(document).ready(function () {
    $("#parts-size-btn").click(function () {
      processController();
    });
  });
}

function processController() {
  var htmlText =
    `
  <h2 class = "mt-5"> Process Controller </h2>
  <button type="submit" class="btn btn-primary" id="addProcessButton">Add process</button>
  <button type="submit" class="btn btn-primary" id="endProcessButton">End process</button>
  `;
  $("#processControllerBtns").html(htmlText);
  var htmlText =
    `<h3>Physical(User) Memory</h3>
  <canvas id="myCanvas" width="170" height="520" style="border:2px solid red;"></canvas>
  `;
  $("#canvas").html(htmlText);
  drawMemory();
  $(document).ready(function () {
    $("#addProcessButton").click(function () {
      addProcessSize();
    });
    $("#endProcessButton").click(function () {
      endProcessId();
    });
  });
}

function addProcessSize() {
  var htmlText =
    `
  <div class="form-group">
      <label>Enter the Size of process to be added: </label>
      <input type="text" class="form-control" id="processSize" placeholder="Enter size of process to be added">      
  </div>
  <button type="submit" class="btn btn-primary mt-3" id="add-btn">Add</button>
  `;
  $("#processDetailsForm").html(htmlText);
  $(document).ready(function () {
    $("#add-btn").click(function () {
      var process_size = Number($("#processSize").val());
      currProcessId += 1;
      $("#processSize").val("");
      addProcess(process_size, currProcessId, 0);
    });
  });
}

function addProcess(process_size, currProcessId, fromQ) {

    var i;
    var found = 0;
    var best_ind = -1;
    var best_size;
    for (i = 0; i < noOfPartitions; i++) {
      if (partitionOccupied[i] == 0) {
        if (process_size <= partition_size[i]) {
          if (best_ind == -1 || (partition_size[i] < best_size)) {
            found = 1;
            best_ind = i;
            best_size = partition_size[i];
          }
        }
      }
    }
    if (found == 1) {
        partitionOccupied[best_ind] = 1;
        partition_process_id[best_ind] = currProcessId;
        processMap.set(currProcessId,process_size)
        drawProcess(process_size, currProcessId, best_ind);
        internalFragments+=partition_size[best_ind]-process_size
        externalFragments-=partition_size[best_ind]
    }
    if (found == 0 && fromQ == 0) {
        alert('New process could not be added. Process added to Input Queue');
        addToQueue(process_size, currProcessId);
    }
    if (found == 1 && fromQ == 1) {
        removeFromQueue(currProcessId);
        alert('Process ' + currProcessId + ' of size ' + process_size + ' added to memory.');
    }
    drawInputQTable();
    drawFragmentations();
    drawLegend();
}


function endProcessId() {
  var htmlText =
    `
  <div class="form-group">
      <label>Id of process to be removed: </label>
      <input type="text" class="form-control" id="endProcessId" placeholder="Enter id of process to be removed">      
  </div>
  <button type="submit" class="btn btn-primary mt-3" id="rem-btn">End</button>
  `;
  $("#processDetailsForm").html(htmlText);
  $(document).ready(function () {
    $("#rem-btn").click(function () {
      var process_id = Number($("#endProcessId").val());
      $("#endProcessId").val("");
      endProcess(process_id);
    });
  });
}

function endProcess(process_id) {
  var i;
  var found = 0;
  for (i = 0; i < noOfPartitions; i++) {
    if (partition_process_id[i] == process_id && found == 0) {

      //Deallocating the Process Making Occupied as 0
      partitionOccupied[i] = 0;
      partition_process_id[i] = -1;
      internalFragments-=(partition_size[i]-processMap.get(process_id))
      externalFragments+=(partition_size[i])
      processMap.delete(process_id)
      found = 1;
      var ctx = document.getElementById("myCanvas").getContext("2d");
      ctx.beginPath();
      ctx.rect(xstart, partitionStart[i], canvasWidth, partition_size[i] * (500 / total_mem_size));
      ctx.fillStyle = "white";
      ctx.fill();

      ctx.rect(xstart, partitionStart[i], canvasWidth, partition_size[i] * (500 / total_mem_size))
      ctx.stroke();
      break;
    }
  }
  if (found == 1) {
    var i;
    for (i = 0; i < input_queue_size; i++) {
      addProcess(input_queue_process_size[i], input_queue_process_id[i], 1);
    }
  }
  else {
    alert("Process-" + String(process_id) + " not found in memory");
  }
  drawInputQTable();
  drawFragmentations();
}

//Drawing the Main Memory Partitions

function drawMemory() {

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.rect(xstart, ystart, canvasWidth, canvasHeight);

  var i;

  //Creating an Array For Storing all Partition Sizes
  for (i = 0; i < noOfPartitions; i++) {
    var size = Number($("#part-size-" + String(i + 1)).val());
    partition_size[i] = size;
    total_mem_size += size;
    partitionOccupied[i] = 0;
  }

  externalFragments=total_mem_size

  //Draw Partitions
  for (i = 0; i < noOfPartitions; i++) {
    if (i == 0) {
      partitionStart[i] = ystart;
      partitionEnd[i] = partitionStart[i] + partition_size[i] * (500 / total_mem_size);
    }
    else {
      partitionStart[i] = partitionEnd[i - 1];
      partitionEnd[i] = partitionStart[i] + partition_size[i] * (500 / total_mem_size);
    }
    ctx.rect(xstart, partitionStart[i], canvasWidth, partition_size[i] * (500 / total_mem_size));
    //console.log(partitionStart[i], partitionEnd[i], total_mem_size);
    //console.log(partition_size[i] * (500 / total_mem_size));
  }

  ctx.stroke();
}

//Draw the Process

function drawProcess(process_size, currProcessId, index) {
  var ctx = document.getElementById("myCanvas").getContext("2d");

  ctx.beginPath();
  ctx.rect(xstart+1, partitionStart[index]+1, canvasWidth-2, partition_size[index] * (500 / total_mem_size)-2);
  ctx.fillStyle = "#FEFF86";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(xstart+1, partitionStart[index]+1, canvasWidth-2, process_size * (500 / total_mem_size)-2);
  ctx.fillStyle = "#B0DAFF";
  ctx.fill();

  ctx.font =  String((process_size * (500 / total_mem_size)-2)*0.2)+"px Arial bold";
  ctx.fillStyle = "#FF55BB";
  ctx.fillText("P-" + String(currProcessId), canvasWidth / 3, partitionStart[index] + process_size * (500 / total_mem_size) / 2);
}



function addToQueue(process_size, process_id) {
  input_queue_size += 1;
  input_queue_process_id[input_queue_size - 1] = process_id;
  input_queue_process_size[input_queue_size - 1] = process_size;
}

function removeFromQueue(process_id) {
  var i;
  for (i = 0; i < input_queue_size; i++) {
    if (input_queue_process_id[i] == process_id) {
      for (j = i + 1; j < input_queue_size; j++) {
        //Shifting After Removal
        input_queue_process_id[j - 1] = input_queue_process_id[j];
        input_queue_process_size[j - 1] = input_queue_process_size[j];
      }
    }
  }
  input_queue_size -= 1;
}

function drawInputQTable() {
  var htmlText =
    `
  <table class='table table-bordered border-primary'>
  <h2> Input Queue </h2>
  <tr>
      <th>Process Id</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_id[i] + `</td>
      `;
  }

  htmlText +=
    `
  <tr>
      <th>Process Size</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_size[i] + `</td>
      `;
  }

  htmlText +=
    `
  </tr>
  </table>
  `;
  $("#input-q-table").html(htmlText);
}

function drawInputQTable() {
  var htmlText =
    `
  <table class='table table-bordered border-primary'>
  <h2> Input Queue </h2>
  <tr>
      <th>Process Id</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_id[i] + `</td>
      `;
  }

  htmlText +=
    `
  <tr>
      <th>Process Size</th>
  `;
  for (var i = 0; i < input_queue_size; i++) {
    htmlText +=
      `
      <td>` + input_queue_process_size[i] + `</td>
      `;
  }

  htmlText +=
    `
  </tr>
  </table>
  `;
  $("#input-q-table").html(htmlText);
}

function drawFragmentations() {
  var htmlText =
    `
  <table class='table table-bordered border-primary'>
  <h2>Fragmentation</h2>
  <tr>
      <th>Internal Fragemntation</th>
  `;
  htmlText+=
      `
      <td>` + internalFragments + `</td>`
  htmlText +=
    `
  <tr>
      <th>External Fragmentation</th>
  `;

  htmlText+=
    `<td>` + externalFragments + `</td>
      `; 

  htmlText +=
    `
  </tr>
  </table>
  `;
  $("#fragmentation").html(htmlText);
}


function drawLegend(){
  var htmlText = '<canvas id="l" width="250" height="200"></canvas>'
  $("#legend").html(htmlText);
  helper();
}
function helper() {
  var divElement = $("#legend");

  var ctx = document.getElementById("l").getContext("2d");
  ctx.beginPath();
  ctx.rect(10, 10, 40, 40);
  ctx.fillStyle = "#B0DAFF";
  ctx.fill();

  ctx.beginPath();
  ctx.rect(10, 70, 40, 40);
  ctx.fillStyle = "#FEFF86";
  ctx.fill();    

  ctx.font =  "14px Arial bold";
  ctx.fillStyle = "#FF55BB";
  ctx.fillText("Process Used Memory",70,20);

  ctx.font =  "14px Arial bold";
  ctx.fillStyle = "#FF55BB";
  ctx.fillText("Process Unused Memory",70,80);
}
