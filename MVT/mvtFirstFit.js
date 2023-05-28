
var total_mem_size = 0;
var numberOfPartition = 0;
  var part_size = [];

  var myCanvas_width = 150;
  var myCanvas_height = 500;
  var myCanvas_x_start = 10;
  var myCanvas_y_start = 10;
  var part_myCanvas_start = [];
  var part_myCanvas_end = [];
  var part_start = [];
  var part_end = [];
  var part_pro_id = [];

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

    if (numberOfPartition == 0) {
      addPart(0, process_size, process_id);
      found = 1;
    }
    else {
      for (i = 0; i < numberOfPartition; i++) {

        if (i == 0) {
          if (part_start[0] >= process_size) {
            addPart(0, process_size, process_id);
            found = 1;
            break;
          }
        }
        else if (found == 0) {
          if ((part_start[i] - part_end[i - 1]) >= process_size) {
            addPart(i, process_size, process_id);
            found = 1;
            break;
          }
        }
      }
      if (found == 0) {
        if ((total_mem_size - part_end[numberOfPartition - 1]) >= process_size) {
          addPart(numberOfPartition, process_size, process_id);
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
