
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("partitionsNoBtn").addEventListener("click", function () {
        displayPartitionSize();
    });
});


  function displayPartitionSize() {
    var noOfPartitions = Number(document.getElementById("partitionsNo").value);
    var htmlText = "";
    
    for (var i = 1; i <= noOfPartitions; i++) {
      htmlText += `
        <div class="form-group">
          <label>Size of partition ${i}: </label>
          <input type="text" class="form-control" id="part-size-${i}" placeholder="Enter size of partition ${i}">
          <br>
        </div>
      `;
    }
    
    htmlText += `
      <button type="submit" class="btn btn-primary" id="parts-size-btn">Submit</button>
    `;
    
    document.getElementById("PartitionSizeForm").innerHTML = htmlText;
    
    document.addEventListener("DOMContentLoaded", function () {
      document.getElementById("parts-size-btn").addEventListener("click", function () {
        startColumn2();
      });
    });
  }
  

  