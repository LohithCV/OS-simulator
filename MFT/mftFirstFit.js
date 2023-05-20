
var noOfPartitions = 0;

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
  <button type="submit" class="btn btn-primary" id="endProcessButton">Remove process</button>
  `;
  $("#processControllerBtns").html(htmlText);
  var htmlText =
    `<h3>Physical(User) Memory</h3>
  <canvas id="myCanvas" width="170" height="520" style="border:2px solid red;"></canvas>
  `;
  $("#canvas").html(htmlText);
  drawPartMemory();
  $(document).ready(function () {
    $("#addProcessButton").click(function () {
      addProcessSize();
    });
    $("#endProcessButton").click(function () {
      remProcessId();
    });
  });

}
