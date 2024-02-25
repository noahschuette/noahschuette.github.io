function setLibrary(){
  var library = document.getElementById('library');
  //var content = ["0F0C0F|1B0417|37052E|550A3A|760F42|B7225A|AD1544|F8414E|FF868D, Maul, n0j0","FFFDC9|3992E6|295ACC|2037C1|1A219C|0D106C|060840|D059FF|9C2EE6|7120C1|40199F|251377|E6BA5C|CC933D|B36234|99352E|66222D|330D0F|B0D27C|82C120|1EAE42|137741|074F30|012820|0E0522, Hazy Glow, PixelDud"];

  var content = "";
  fetch('https://www.noahschuette.de/palettebin/library.txt')
  .then(response => response.text())
  .then(data => {
  	content = data.split('\n');
    console.log(content);
    var inner = "";
    for (let line in content){
      if (content[line].startsWith('#')){
        continue;
      }
      var tempinner = "";
      var temp = content[line].split(',');
      temp[0] = temp[0].trim();
      var url = "https://www.noahschuette.de/palettebin/index.html?p="+temp[0];
      if (temp.length > 1){
        temp[1] = temp[1].trim();
        tempinner += '<p class="libTitle">'+temp[1]+'</p>';
        url += "&t="+temp[1];
        if (temp.length > 2){
          temp[2] = temp[2].trim();
          tempinner += '<p class="libAuthor">'+temp[2]+'</p>';
          url += "&a="+temp[2];
        }
      }
      var colors = temp[0].split('|');
      for (color in colors){
        tempinner += '<div style="background-color: #'+colors[color]+';"class="libColor"></div>'
      }
      var head = '<a href="'+url+'" class="libEntry">';
      inner += head + tempinner;
    }
    library.innerHTML = inner;

  });
}
