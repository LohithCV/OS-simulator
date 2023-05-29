
var total_mem_size = 0;

//Canvas Dimentions
  var canvasWidth = 150;
  var canvasHeight = 500;
  var xstart = 10;
  var ystart = 10;

  //Partition Details
  var numberOfPartition = 0;
  var partition_size = [];
  var partition_start = [];
  var partition_end = [];
  var partition_process_id = [];

  //Process Details
  var current_process_id = 0;

  //Queue details
  var input_queue_process_id = [];
  var input_queue_process_size = [];
  var input_queue_size = 0;

    //Fragmentation
    var externalFragments=0;
    var processMap = new Map();

  $(document).ready(function () {
    $("#memorySizeBtn").click(function () {
      total_mem_size = Number($("#memorySize").val());
      externalFragments=total_mem_size;
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
        $("#addProcessSize").val("");
        addProcess(process_size, current_process_id, 0);
      });
    });
  }

  function addProcess(process_size, process_id, fromQ) {
    var i;
    var found = 0;
    var best_ind = -1;
    var best_size = total_mem_size;
    if(numberOfPartition == 0) {
        best_ind = 0;
        best_size = total_mem_size;
        processMap.set(process_id,process_size)
        externalFragments-=process_size
        drawFragmentations();
        addPartition(0, process_size, process_id);
        found = 1;
    }
    else {
        for(i = 0; i < numberOfPartition; i++) {

            if(i == 0) {
                if(partition_start[0] >= process_size) {
                    best_ind = 0;
                    best_size = partition_start[0];
                    found = 1;
                }
            }
            else {
                if((partition_start[i] - partition_end[i-1]) >= process_size) {
                    if((partition_start[i] - partition_end[i-1]) < best_size) {
                        best_ind = i;
                        best_size = partition_start[i] - partition_end[i-1];  
                        found = 1;
                    }
                }
            }
        }
        if((total_mem_size - partition_end[numberOfPartition-1]) >= process_size) {
            console.log(best_size);
            if((total_mem_size - partition_end[numberOfPartition-1]) < best_size) {
                best_ind = numberOfPartition;
                best_size = total_mem_size - partition_end[numberOfPartition-1];  
                found = 1;
            }
        }
        if(found == 1) {
            processMap.set(process_id,process_size)
            externalFragments-=process_size;
            drawFragmentations();
            addPartition(best_ind, process_size, process_id);
        }
    }

    if(found == 0 && fromQ == 0) {
        alert('New process could not be added. Process added to Input Queue');
        addToQ(process_size, process_id);
    }
    if(found == 1 && fromQ == 1) {
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
    for (i = 0; i < numberOfPartition; i++) {
      for (j = 0; j < (numberOfPartition - i - 1); j++) {
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

  //Ending an Process
  function endProcessId() {
    var htmlText =
      `
    <div class="form-group">
        <label>Id of process to be removed: </label>
        <input type="text" class="form-control" id="rem-pro-id" placeholder="Enter id of process to be removed">      
    </div>
    <button type="submit" class="btn btn-primary" id="rem-btn">Remove</button>
    `;
    $("#addProcess").html(htmlText);
    $(document).ready(function () {
      $("#rem-btn").click(function () {
        var id_pro = Number($("#rem-pro-id").val());
        $("#rem-pro-id").val("");
        endProcess(id_pro);
      });
    });
  }

  function endProcess(process_id) {
    var i;
    var found = 0;
    for (i = 0; i < numberOfPartition; i++) {
      if (partition_process_id[i] == process_id && found == 0) {

        var j;
        for (j = i + 1; j < numberOfPartition; j++) {
            //Shifting for deleting process related Details
          partition_process_id[j - 1] = partition_process_id[j];

          partition_start[j - 1] = partition_start[j];

          partition_end[j - 1] = partition_end[j];

          partition_size[j - 1] = partition_size[j];
        }
        found = 1;
        numberOfPartition -= 1;
        externalFragments+=(processMap.get(process_id))
        processMap.delete(process_id)
        drawFragmentations();
        break;
      }
    }
    if (found == 1) {
      drawPart();
      var i;
      for (i = 0; i < input_queue_size; i++) {
        addProcess(input_queue_process_size[i], input_queue_process_id[i], 1);
      }
    }
    else {
      alert("Process-" + String(process_id) + " not found in memory");
    }
    drawInputQTable();
  }

  //Queue Operations

  function addToQ(process_size, process_id) {
    input_queue_size += 1;
    input_queue_process_id[input_queue_size - 1] = process_id;
    input_queue_process_size[input_queue_size - 1] = process_size;
  }

  function removeFromQ(process_id) {
    var i;
    for (i = 0; i < input_queue_size; i++) {
      if (input_queue_process_id[i] == process_id) {
        for (j = i + 1; j < input_queue_size; j++) {

            //Shifting the Contents of the Array
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
    <button type="submit" class="btn btn-primary md-3 mt-3" id="compact-btn">Compact</button> 
    <table class = 'mt-3 table table-bordered border-primary
    '>
    <h3>Input Queue</h3>
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
    $(document).ready(function () {
      $("#compact-btn").click(function () {
        Compact();
      });
    });
  }

  //For Compaction
  function Compact() {
    var i;
    for (i = 0; i < numberOfPartition; i++) {
      if (i == 0) {
        partition_start[i] = 0;
        partition_end[i] = partition_start[i] + partition_size[i];
      }
      else {
        partition_start[i] = partition_end[i - 1];
        partition_end[i] = partition_start[i] + partition_size[i];
      }
    }
    drawPart();
    for (i = 0; i < input_q_size; i++) {
      addProcess(input_q_pro_size[i], input_queue_process_id[i], 1);
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
    for (i = 0; i < numberOfPartition; i++) {
      ctx.beginPath();
      ctx.rect(xstart,ystart + partition_start[i] * (500 / total_mem_size), canvasWidth, partition_size[i] * (500 / total_mem_size));
      ctx.stroke()
      ctx.fillStyle = "#79E0EE";
      ctx.fill();

      ctx.font = "14px Arial bold";
      ctx.fillStyle = "#DB005B";
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

  function drawFragmentations() {
    var htmlText =
      `
    <table class='table table-bordered border-primary'>
    <h2>Fragmentation</h2>
    `;
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
  