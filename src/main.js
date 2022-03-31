
var dam = new Dam();

$.ajax({
      url: "elem_nodes.txt",
      dataType: "text",
      async: true,
      success: dam.readElemNodes
  });

$.ajax({
        url: "nodes.txt",
        dataType: "text",
        async: true,
        success: dam.readNodes
    });


console.log("firstw will be here");
//dam.draw();