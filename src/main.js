const ZONE_LEN = 56;
const WATER_LEN = 12;

var loadText = document.querySelector('#loadText');
loadText.textContent = 'Loading...';
$('#loadCircle').show();

let sourse = 'https://hikrento.github.io/data/';
var ourRequest = new XMLHttpRequest();
ourRequest.open('GET', sourse);
//console.log('1');
ourRequest.onload = function() {
    //console.log(ourRequest.readyState);
    if (ourRequest.readyState == 4 && ourRequest.status == 200) {
        //console.log(2);
        dam = new Dam();
        dam.read(ourRequest);
        dam.solve();
        dam.draw();
        loadText.color = 'green'
        loadText.textContent = 'Done';
        $('#loadCircle').hide();
    }
};
ourRequest.send();

function reDraw() {
    loadText.color = 'red';
    loadText.textContent = 'Loading...';
    $('#loadCircle').show();		
    dam.solve();
    dam.draw();
    loadText.color = 'green';
    loadText.textContent = 'Done';
    $('#loadCircle').hide();
}

function updateChanges() {
    var text = document.getElementById('coefB1').value;
    for (let i = 0; i < ZONE_LEN; i++) {
        dam.elemNodes[3][i] = Number(text);
    }

    text = document.getElementById('coefB2').value;
    for (let i = ZONE_LEN; i < dam.elemNodes[0].length; i++) {
        dam.elemNodes[3][i] = Number(text);
    }

    text = document.getElementById('tWater').value;  
    for (let i = 0; i < WATER_LEN; i++) {
        dam.bc[1][i] = Number(text);
    }

    text = document.getElementById('tAir').value; 
    for (let i = WATER_LEN; i < dam.bc[0].length; i++) {
        dam.bc[1][i] = Number(text);
    }
    reDraw();
}