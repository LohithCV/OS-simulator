
var total_mem_size = 0;

//Canvas Dimentions
  var canvasWidth = 150;
  var canvasHeight = 500;
  var xstart = 10;
  var ystart = 10;

  var part_myCanvas_start = [];
  var part_myCanvas_end = [];

  //Partition Details
  var numberOfPartition = 0;
  var partition_size = [];
  var partition_start = [];
  var partation_end = [];
  var partition_process_id = [];

  //Process Details
  var current_process_id = 0;

  var part_occupied = [];
  var input_q_pro_id = [];
  var input_q_pro_size = [];
  var input_q_size = 0;

  $(document).ready(function () {
    $("#memorySizeBtn").click(function () {
      total_mem_size = Number($("#memorySize").val());
      processController();
    });
  });

  function processController() {
    var htmlText =
      `
    <button type="submit" class="btn btn-primary mt-3" id="addProcessBtn">Add process</button>
    <button type="submit" class="btn btn-primary mt-3" id="endProcessBtn">Remove process</button>
    `;
    $("#controllers").html(htmlText);
    var htmlText =
      `
    <canvas id="myCanvas" width="170" height="520" style="border:1px solid #d3d3d3;">
                </canvas>
    `;
    $("#canvas").html(htmlText);
    drawMemory();
    $(document).ready(function () {
      $("#addProcessBtn").click(function () {
        addProcessSize();
      });
      $("#endProcessBtn").click(function () {
        endProcessId();
      });
    });
  }

  function addProcessSize() {
    var htmlText =
      `
    <div class="form-group">
        <label>Size of process to be added: </label>
        <input type="text" class="form-control" id="addProcessSize" placeholder="Enter size of process to be added">      
    </div>
    <button type="submit" class="btn btn-primary" id="add-btn">Add</button>
    `;
    $("#addProcess").html(htmlText);
    $(document).ready(function () {
      $("#add-btn").click(function () {
        var process_size = Number($("#addProcessSize").val());
        current_process_id += 1;
        addProcess(process_size, current_process_id, 0);
      });
    });
  }

  function addProcess(process_size, process_id, fromQ) {
    var i;
    var found = 0;

    //1st Process
    if (numberOfPartition == 0) {
        addPartition(0, process_size, process_id);
      found = 1;
    }
    else {
      for (i = 0; i < numberOfPartition; i++) {

        if (i == 0) {
            //Space Above 1st Partition
          if (partition_start[0] >= process_size) {
            addPartition(0, process_size, process_id);
            found = 1;
            break;
          }
        }
        else if (found == 0) {
            //Finding Space in Between 2 Partitions
          if ((partition_start[i] - partition_end[i - 1]) >= process_size) {
            addPartition(i, process_size, process_id);
            found = 1;
            break;
          }
        }
      }
      if (found == 0) {
        //If no Space in Between, insertion at end
        if ((total_mem_size - partition_end[numberOfPartition - 1]) >= process_size) {
            addPartition(numberOfPartition, process_size, process_id);
          found = 1;
        }
      }
    }

    if (found == 0 && fromQ == 0) {
      alert('New process could not be added. Process added to Input Queue');
      //calcExtFrag(process_size);
      addToQ(process_size, process_id);
    }
    if (found == 1 && fromQ == 1) {
      removeFromQ(process_id);
      alert('Process ' + process_id + ' of size ' + process_size + ' added to memory.');
    }
    drawInputQTable();
  }

  //Adding a Process
  
  function addPartition(index, process_size, process_id) {

    //Partition Id and Partition Size
    partition_process_id[numberOfPartition] = process_id;
    partition_size[numberOfPartition] = process_size;

    //1st Partition or Adding 1 st Process

    if (index == 0) {
      partition_start[numberOfPartition] = 0;
      partition_end[numberOfPartition] = process_size;
    }

    //Adding a Process Inbetween 2 existing Process
    else if (index < numberOfPartition) {
      partition_start[numberOfPartition] = partition_end[index - 1];
      partition_end[numberOfPartition] = partition_start[numberOfPartition] + process_size;
    }

    //Adding Partition / Process at end
    else {
      partition_start[numberOfPartition] = partition_end[numberOfPartition - 1];
      partition_end[numberOfPartition] = partition_start[numberOfPartition] + process_size;
    }

    numberOfPartition += 1;
    sortPart();
    drawPart();
  }

  function sortPart() {
    var i;
    var j;
    for (i = 0; i < noOfPartitions; i++) {
      for (j = 0; j < (noOfPartitions - i - 1); j++) {
        if (partition_start[j] > partition_start[j + 1]) {
          var temp = partition_start[j];
          partition_start[j] = partition_start[j + 1];
          partition_start[j + 1] = temp;

          temp = partition_end[j];
          partition_end[j] = partition_end[j + 1];
          partition_end[j + 1] = temp;

          temp = partition_size[j];
          partition_size[j] = partition_size[j + 1];
          partition_size[j + 1] = temp;

          temp = partition_process_id[j];
          partition_process_id[j] = partition_process_id[j + 1];
          partition_process_id[j + 1] = temp;
        }
      }
    }
  }


  //Drawing Partition

  function drawPart() {
    var ctx = document.getElementById("myCanvas").getContext("2d");
    ctx.beginPath();
    ctx.rect(xstart,ystart,canvasWidth, canvasHeight);
    ctx.fillStyle = "white";
    ctx.fill();
    var i;
    for (i = 0; i < noOfPartitions; i++) {
      ctx.beginPath();
      ctx.rect(xstart,ystart + partition_start[i] * (500 / total_mem_size), canvasWidth, partition_size[i] * (500 / total_mem_size));
      ctx.fillStyle = "#79E0EE";
      ctx.fill();

      ctx.font = "14px Arial bold";
      ctx.fillStyle = "#F2BED1";
      ctx.fillText("P-" + String(partition_process_id[i]) + ", size: " + String(partition_size[i]), 50, ystart + partition_start[i] * (500 / total_mem_size) + partition_size[i] * (500 / total_mem_size) / 2);
    }
  }

  //Drawing Memory
  function drawMemory() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.rect(xstart, ystart, canvasWidth, canvasHeight);
    ctx.stroke();
  }