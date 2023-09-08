/*

WRITER

*/

var ftype = ".txt";

function download(){
    var text = document.getElementById("my-textarea").value;
    var title = document.getElementById("title").value;

    text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.download = title + ftype;
    anchor.href = window.URL.createObjectURL(blob);
    anchor.target ="_blank";
    anchor.style.display = "none"; // just to be safe!
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
 }

 /*

FONT

 */

var i = 0;
var max = 1;
let root = document.documentElement.style;
var fonts = ['"Roboto Mono", monospace', '"Roboto", sans-serif','"Newsreader", serif'];
var fontNames = ['Roboto Mono','Roboto','Newsreader'];
//var fonts = ['"Roboto Mono", monospace', '"Roboto", sans-serif','"Newsreader", serif', '"Indie Flower", cursive', '"Seaweed Script", cursive', '"DotGothic16", sans-serif'];
//var fontNames = ['Roboto Mono','Roboto','Newsreader','Indie Flower','Seaweed','Dot Gothic'];

var size = 36;
var maxsize = 48;
var minsize = 6;

/*
function loadPrefs(){
  i = localStorage['font'] || 0;
  size = localStorage['size'] || 35;
  document.getElementById("fontName").innerHTML = fontNames[i];
  document.getElementById("fontSizeTxt").innerHTML = size;
  console.log("Load " + fontNames[i] + " , " + size);
}*/

function changeFont(){
  i = i + 1;
  if (i >= fonts.length){
    i = 0;
  }

  document.getElementById("fontName").innerHTML = fontNames[i];
  document.documentElement.style.setProperty('--font', fonts[i]);
  localStorage['font'] = i;
  console.log(fonts[i]);

}

function changeSizeUp(){
  size += 2;
  if (size > maxsize){
    size = maxsize;
  }
  applySize(size);
}

function changeSizeDown(){
  size -= 2;
  if (size < minsize){
    size = minsize;
  }
  applySize(size);
}

function applySize(size){

    var newSize = size + 'px'
    document.documentElement.style.setProperty('--size', newSize);
    document.getElementById("fontSizeTxt").innerHTML = size;
    localStorage['size'] = size;
}

/*

READER

*/


function setFile(elemId) {
   var elem = document.getElementById(elemId);
   if(elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
      load();
   }
}

function fileType() {
  var input = document.getElementById("myFile").files[0];
  var label = document.getElementById("fileLabel");
  load();
}

function load(){

  var file = document.getElementById("myFile").files[0];

  var reader = new FileReader();
  reader.onload = function (e) {
      var textArea = document.getElementById("my-textarea");
      var title = document.getElementById("title");
      textArea.value = e.target.result;

      var realTitle = file.name;
      var titleArray = Array.from(realTitle);
      for (i = titleArray.length-1; i>=0;i--){
        if (titleArray[i]=='.'){
          realTitle = titleArray.join('');
          ftype = realTitle.slice(i, titleArray.length);
          console.log("type " + ftype);
          realTitle = realTitle.slice(0, i);
          console.log("title " + realTitle);
          break;
        }
      }
      title.value = realTitle;

  };
  reader.readAsText(file);
}

/* new */

function hide(){
  document.getElementById("newTooltip").style.display = "none";
}
