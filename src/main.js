const ZONE_LEN = 56;

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
        let temperatue = dam.solve();
        dam.draw(temperatue);
    }
};
ourRequest.send();

function getValue (id) {
    text = document.getElementById(id).value; //value of the text input
    
    for (let i = 0; i < ZONE_LEN; i++) {
        dam.elemNodes[3][i] = Number(text);
    }

    dam.draw(dam.solve());
    return false;
}

