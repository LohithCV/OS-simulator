
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

$(document).ready(function () {
  $("#noOfPartitionsBtn").click(function () {
    displayPartSize();
  });
});

function displayPartSize() {
  noOfPartitions = Number($("#noOfPartitions").val());
  var htmlText = '';
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
      addProcess(process_size, currProcessId, 0);
    });
  });
}

function addProcess(process_size, currProcessId, fromQ) {
  var i;
  var found = 0;
  for (i = 0; i < noOfPartitions; i++) {
    if (partitionOccupied[i] == 0 && found == 0) {
      if (process_size <= partition_size[i]) {
        //Indicating the it is Occupied
        partitionOccupied[i] = 1;
        partition_process_id[i] = currProcessId;
        found = 1;
        drawProcess(process_size, currProcessId, i);
      }
    }
  }
  if (found == 0 && fromQ == 0) {
    alert('New process could not be added. Process added to Input Queue');
    addToQueue(process_size, currProcessId);
  }
  if (found == 1 && fromQ == 1) {
    removeFromQUeue(pro_id);
    alert('Process ' + currProcessId + ' of size ' + process_size + ' added to memory.');
  }
  drawInputQTable();
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

  ctx.font =  "20px Arial bold";
  ctx.fillStyle = "#FF55BB";
  ctx.fillText("P-" + String(currProcessId), canvasWidth / 2, partitionStart[index] + process_size * (500 / total_mem_size) / 2);
}
