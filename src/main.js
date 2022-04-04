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
        dam.init();
        dam.solve();
    }
};
ourRequest.send();