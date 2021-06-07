var index = 0;
var coloramount = 0;
var addBtn = '\n<a href="#" onclick="enableAddColor()" id="addColor"><i class="fas fa-plus"></i></a>';
var addInput = '<a href="#" id="inputPalette"><span class="tagspan" id="tagWhite">#</span><input class="colorInput" id="colorInput" type="text" placeholder="000000" autocomplete="off" maxLength=6></a>'
var newPalette = '\n<p onclick="enableAddColor()" id="newPalette">START BY ADDING A FRESH COLOR</p>'
var copyTA = '<textarea id="copyTA" rows="1" cols="1"></textarea>';
var resp = '<p id="responseTrue">COPIED!</p>';
var title = "";
var author = "";

function setPalette(){
  document.getElementById('copyURL').style.display = "none";
  const urlParams = new URLSearchParams(window.location.search);
  const palette = urlParams.get('p');
  if (palette == null){
    console.log("No palette entered in URL query string");
    document.getElementById("title").innerHTML = "Unnamed Palette";
    document.getElementById("author").style.display = "none";
    return;
  }
  document.getElementById('copyURL').style.display = "flex";
  var colors = palette.split('|');
  var toAppend = "";
  for (color in colors){
    var current = colors[color].toUpperCase();
    if (isHEX(current)){
      if (isSingleHEX(current)){
        current = doubleHexify(current);
      }
      index += 1;
      coloramount++;
      if (pickBlackColor(current)){
        toAppend += '<a href="#colorInfo" class="palette" onclick="showColor(c'+color+',\''+current+'\')" id="c'+color+'" style="background-color:#'+ current +';"><p class="tagcodeBlack"><span class="tagspan">#</span>'+ current +'</p></a>\n'
      } else {
          toAppend += '<a href="#colorInfo" class="palette" onclick="showColor(c'+color+',\''+current+'\')" id="c'+color+'" style="background-color:#'+ current +';"><p class="tagcode"><span class="tagspan">#</span>'+ current +'</p></a>\n'
      }
    } else {
      console.log("#" + current + " is not a valid HEX color");
    }

  }
  document.getElementById("palettes").innerHTML = toAppend + addBtn;

  const ptitle = urlParams.get('t');
  if (ptitle == null){
    document.getElementById("title").innerHTML = "Empty Palette";
  } else {
    document.getElementById("title").innerHTML = '<span class="mark">"</span>'+ ptitle +'<span class="mark">"</span>';
    title = ptitle;
  }

  const pauthor = urlParams.get('a');
  if (pauthor == null){
    document.getElementById("author").style.display = "none";
  } else {
    document.getElementById("author").innerHTML = 'by ' + pauthor;
    author = pauthor;
  }
  //setTitleColors();
}

function showColor(id, color){
  var r = parseInt(color.substring(0, 2), 16);
  var g = parseInt(color.substring(2, 4), 16);
  var b = parseInt(color.substring(4, 6), 16);
  var hsl = rgbToHsl(r,g,b);
  var h = Math.round(hsl[0]);
  var s = Math.round(hsl[1]) + "%";
  var l = Math.round(hsl[2]) + "%";
  var identifier = id.id;
  var inner = '<p class="colorPreview" style="background-color:#'+color+'"></p>';
  var currentNTC = ntc.name(color);
  var colorname = currentNTC[1].toUpperCase();
  inner += '<p class="color">"<span class="subColor">'+colorname+'</span>"</p>';
  inner += '<p class="color" onclick="copyRGBHSL(\'RGB\')">RGB: <span id="RGB" class="subColor">'+ r +', '+ g +', '+ b +'</span></p><p class="color" onclick="copyRGBHSL(\'HSL\')">HSL: <span class="subColor" id="HSL">'+h+', '+s+', '+l+'</span></p><p class="colorBtn" onclick="copyColor(\''+color+'\')" id="colorCopy" ><i class="fas fa-clipboard"></i></p><p class="colorBtn" onclick="deleteColor('+identifier+')" id="colorDel"><i class="fas fa-trash"></i></p>';
  document.getElementById("colorInfo").innerHTML = inner;

  //document.getElementById("colorInfo").innerHTML ='<p class="colorPreview" style="background-color:#'+color+'"></p><p class="nameColor">'+colorname+'</p><p class="color" onclick="copyRGBHSL(\'RGB\')">RGB: <span id="RGB" class="subColor">'+ r +', '+ g +', '+ b +'</span></p><p class="color" onclick="copyRGBHSL(\'HSL\')">HSL: <span class="subColor" id="HSL">'+h+', '+s+', '+l+'</span></p><p class="colorBtn" onclick="copyColor(\''+color+'\')" id="colorCopy" ><i class="fas fa-clipboard"></i></p><p class="colorBtn" onclick="deleteColor('+identifier+')" id="colorDel"><i class="fas fa-trash"></i></p>'
}

function enableAddColor(){
  document.getElementById("addColor").remove();
  var inner = document.getElementById("palettes").innerHTML;
  document.getElementById("palettes").innerHTML = inner + addInput;
  document.getElementById("colorInput").value = "";
  if (coloramount == 0){
    document.getElementById("newPalette").remove();
  }
  document.getElementById("colorInput")
      .addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.keyCode === 13) {
          addColor();
      }
  });
}

function addColor(){
  var color = document.getElementById("colorInput").value;
  color = color.toUpperCase();
  var toAppend = "";
  if (isHEX(color)){
    index++;
    coloramount++;
    if (isSingleHEX(color)){
      color = doubleHexify(color);
    }
    if (pickBlackColor(color)){
      toAppend += '\n<a href="#colorInfo" class="palette" onclick="showColor(c'+index+',\''+color+'\')" id="c'+index+'" style="background-color:#'+ color +';"><p class="tagcodeBlack"><span class="tagspan">#</span>'+ color +'</p></a>'
    } else {
        toAppend += '\n<a href="#colorInfo" class="palette" onclick="showColor(c'+index+',\''+color+'\')" id="c'+index+'" style="background-color:#'+ color +';"><p class="tagcode"><span class="tagspan">#</span>'+ color +'</p></a>'
    }
    document.getElementById("inputPalette").remove();
    var previous = document.getElementById("palettes").innerHTML;
    //setTitleColors();
    document.getElementById("palettes").innerHTML = previous + toAppend + addBtn;
    document.getElementById('copyURL').style.display = "flex";
  } else {
    document.getElementById("inputPalette").style.border = "solid 1px red";
    setTimeout(function() {
      document.getElementById("inputPalette").style.border = "solid 1px white";
    }, 200);
  }
}

function deleteColor(id){
  coloramount--;
  id.remove();
  document.getElementById("colorInfo").innerHTML = "";
  //setTitleColors();
  if (coloramount == 0){
    var previous = document.getElementById("palettes").innerHTML;
    document.getElementById("palettes").innerHTML = previous + newPalette;
  } else {
    document.getElementById('copyURL').style.display = "flex";
  }
}

function copy(item){
  var inner = document.getElementById("colorInfo").innerHTML;
  document.getElementById("colorInfo").innerHTML = inner + copyTA;
  var area = document.getElementById("copyTA");
  //area.style.display = "none";
  area.value = item;
  area.select();
  var response = document.execCommand("copy");
  area.remove();
  return (response == true);
}

function copyColor(color){
  if (copy(color)){
    document.body.innerHTML = document.body.innerHTML + resp;
    document.getElementById('responseTrue').innerHTML = "COPIED #" + color;
    setTimeout(function() {
      document.getElementById('responseTrue').remove();
    }, 2000);
  }
}

function copyRGBHSL(id){
  color = document.getElementById(id).innerHTML;
  if (copy(color)){
    document.body.innerHTML = document.body.innerHTML + resp;
    if (id === "RGB"){
      document.getElementById('responseTrue').innerHTML = "COPIED RGB";
    } else {
      document.getElementById('responseTrue').innerHTML = "COPIED HSL";
    }
    setTimeout(function() {
      document.getElementById('responseTrue').remove();
    }, 2000);
  }
}

//TODO: ALSO COPY TITLE AND AUTHOR
function copyURL(){
  var url = window.location.href.split('#')[0];
  url = url.split('?')[0];
  var colors = "";
  for (var i=0; i<=index; i++){
    var obj = document.getElementById("c"+i);
    if (obj != undefined){
      var color = obj.childNodes[0].innerHTML.substr(obj.childNodes[0].innerHTML.length - 6);
      colors += color + "|";
    }
  }
  if (colors != ""){
    colors = colors.substring(0, colors.length - 1);
    url = url + "?p=" + colors;
    if (title != ""){
      url += "&t=" + title;
    }
    if (author != ""){
      url += "&a=" + author;
    }
    console.log(url);
    if (copy(url)){
      document.body.innerHTML = document.body.innerHTML + resp;
      document.getElementById('responseTrue').innerHTML = "COPIED URL";
      setTimeout(function() {
        document.getElementById('responseTrue').remove();
      }, 2000);
    }
  }
  document.getElementById('copyURL').style.display = "none";
}

function pickBlackColor(bgColor){
  var r = parseInt(bgColor.substring(0, 2), 16);
  var g = parseInt(bgColor.substring(2, 4), 16);
  var b = parseInt(bgColor.substring(4, 6), 16);
  return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 160)
}

function isHEX(color){
  var pattern = new RegExp('^(([0-9]|[A-F]|[a-f]){6})$|^(([0-9]|[A-F]|[a-f]){3})$');
  return !!pattern.test(color);
}

function isSingleHEX(color){
  var pattern = new RegExp('^([0-9]|[A-F]|[a-f]){3}$');
  return !!pattern.test(color);
}

function doubleHexify(color){
  var r = color.substring(0, 1);
  var g = color.substring(1, 2);
  var b = color.substring(2, 3);
  var newcolor = r + r + g + g + b + b;
  return newcolor;
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s=0, l=0;
  if (delta == 0)
    h = 0;
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  else if (cmax == g)
    h = (b - r) / delta + 2;
  else
    h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0)
      h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [ h, s, l ];
}

function reset(){
  var url = window.location.href.split('?')[0];
  window.location.href = url;
}

function rename(){
  var ptitle = "test";
  title = ptitle;
  document.getElementById("title").innerHTML = '<span class="mark">"</span>'+title+'<span class="mark">"';
}

function setauthor(){
  var pauthor = "test";
  author = pauthor;
  document.getElementById("title").innerHTML = '<span class="mark">"</span>'+author+'<span class="mark">"';
}

/*
function setTitleColors(){
  var count = 0;
  for (var i=0; i<=index && count<7; i++){
    var obj = document.getElementById("c"+i);
    if (obj != undefined){
      count++;
      var color = obj.childNodes[0].innerHTML.substr(obj.childNodes[0].innerHTML.length - 6);
      document.getElementById("x"+count).style.color = "#" + color;
    }
  }
  for (var i=count+1; i<=8; i++){
    document.getElementById("x"+count).style.color = "#8b9bb4";
  }
}*/
