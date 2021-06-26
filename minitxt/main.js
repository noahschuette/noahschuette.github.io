
/*

WRITER

*/

var ftype = ".txt";

function download(){
    var text = document.getElementById("my-textarea").value;
    var title = document.getElementById("title").value;

    if (title === ""){
      title = "unnamed";
    }


    text = text.replace(/\n/g, "\r\n"); // To retain the Line breaks.
    var blob = new Blob([text], { type: "text/plain"});
    var anchor = document.createElement("a");
    var titleArray = Array.from(title);
    for (i = titleArray.length-1; i>=0;i--){
      if (titleArray[i]=='.'){
        realTitle = titleArray.join('');
        ftype = realTitle.slice(i, titleArray.length);
        realTitle = realTitle.slice(0, i);
        break;
      }
    }
    anchor.download = title;
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

 /*
 function loadPrefs(){
   i = localStorage['font'] || 0;
   size = localStorage['size'] || 35;
   document.getElementById("fontName").innerHTML = fontNames[i];
   document.getElementById("fontSizeTxt").innerHTML = size;
   console.log("Load " + fontNames[i] + " , " + size);
 }*/

/*
var i = 0;
var max = 1;
let root = document.documentElement.style;
var fonts = ['"Barlow", sans-serif','"Roboto Mono", monospace', '"Roboto", sans-serif','"Benne", serif'];
var fontNames = ['Barlow','Roboto Mono','Roboto','Benne'];
var weight = [100, 300, 400, 500, 700];
//var fonts = ['"Roboto Mono", monospace', '"Roboto", sans-serif','"Newsreader", serif', '"Indie Flower", cursive', '"Seaweed Script", cursive', '"DotGothic16", sans-serif'];
//var fontNames = ['Roboto Mono','Roboto','Newsreader','Indie Flower','Seaweed','Dot Gothic'];

var size = 24;
var maxsize = 48;
var minsize = 6;



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
}*/

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
      title.value = realTitle;
      var titleArray = Array.from(realTitle);
      for (i = titleArray.length-1; i>=0;i--){
        if (titleArray[i]=='.'){
          realTitle = titleArray.join('');
          ftype = realTitle.slice(i, titleArray.length);
          realTitle = realTitle.slice(0, i);
          break;
        }
      }
      setLineView();

  };
  reader.readAsText(file);
}

/*

SCROLL HANDLER

*/


var lineViewDiv = document.getElementById("lineViewDiv");

lineViewDiv.onmouseover = function(){
   document.getElementById("lineViewDiv").style.overflowY = "hidden";
};

lineViewDiv.onmouseout = function(){
   document.getElementById("lineViewDiv").style.overflowY = "scroll";
};

function handleScroll(){
    document.getElementById("lineViewDiv").scrollTop=document.getElementById("my-textarea").scrollTop;
}

function setLineView(){
  var textarea = document.getElementById("my-textarea");
  var lines = textarea.value.split('\n');
  var left = "";
  for(var i = 0;i < lines.length;i++){
    if (lines[i] === "") {
      left += `<span class="darkerLine">${(i+1)}</span><br>`
    } else {
      left += (i+1) + '<br>'
    }
  }

  document.getElementById("lineView").innerHTML = left;
  document.getElementById("lineView").style.height = textarea.style.height;
  handleScroll();
}

/*
var area = document.getElementById("my-textarea");
area.addEventListener('input', function() {
  setLineView();
}, false);
*/
/*

Parenthesis

*/

const SINGLE_QUOTE = "'";
const DOUBLE_QUOTE = '"';
const LPAREN = "(";
const RPAREN = ")";
const LBRACK = "[";
const RBRACK = "]";
const LX = "{";
const RX = "}";

const CHARS_REQUIRE_PAIR = {
    //[SINGLE_QUOTE]: SINGLE_QUOTE,
    //[DOUBLE_QUOTE]: DOUBLE_QUOTE,
    [LPAREN]: RPAREN,
    [LBRACK]: RBRACK,
    [LX]: RX
};

new Vue({
    el: '#my-textarea',
    data: {
        title: 'The VueJS instance'
    },

    methods: {
        smartTyper(evt) {
            let keyTyped = evt.key;
            let inputElement = evt.target;
            if (!Object.keys(CHARS_REQUIRE_PAIR).includes(keyTyped)) {
                return
            }
            let caretPosition = inputElement.selectionStart;
            let closingChar = CHARS_REQUIRE_PAIR[keyTyped];

            inputElement.value =
                inputElement.value.substr(0, caretPosition) +
                closingChar +
                inputElement.value.substr(caretPosition);
            inputElement.setSelectionRange(caretPosition, caretPosition);
        },
        lineView(evt) {
          setLineView();
        }
    }

});

/*

Allow Tabs

*/

HTMLTextAreaElement.prototype.getCaretPosition = function () { //return the caret position of the textarea
    return this.selectionStart;
};
HTMLTextAreaElement.prototype.setCaretPosition = function (position) { //change the caret position of the textarea
    this.selectionStart = position;
    this.selectionEnd = position;
    this.focus();
};
HTMLTextAreaElement.prototype.hasSelection = function () { //if the textarea has selection then return true
    if (this.selectionStart == this.selectionEnd) {
        return false;
    } else {
        return true;
    }
};
HTMLTextAreaElement.prototype.getSelectedText = function () { //return the selection text
    return this.value.substring(this.selectionStart, this.selectionEnd);
};
HTMLTextAreaElement.prototype.setSelection = function (start, end) { //change the selection area of the textarea
    this.selectionStart = start;
    this.selectionEnd = end;
    this.focus();
};

var textareas = document.getElementsByTagName('textarea')[0];
var tabspace = "  ";

textareas.onkeydown = function(event) {

    //support tab on textarea
    if (event.keyCode == 9) { //tab was pressed
        var newCaretPosition;
        newCaretPosition = textareas.getCaretPosition() + tabspace.length;
        textareas.value = textareas.value.substring(0, textareas.getCaretPosition()) + tabspace + textareas.value.substring(textareas.getCaretPosition(), textareas.value.length);
        textareas.setCaretPosition(newCaretPosition);
        return false;
    }
    if(event.keyCode == 8){ //backspace
        if (textareas.value.substring(textareas.getCaretPosition() - 4, textareas.getCaretPosition()) == tabspace) { //it's a tab space
            var newCaretPosition;
            newCaretPosition = textareas.getCaretPosition() - 3;
            textareas.value = textareas.value.substring(0, textareas.getCaretPosition() - 3) + textareas.value.substring(textareas.getCaretPosition(), textareas.value.length);
            textareas.setCaretPosition(newCaretPosition);
        }
    }
    if(event.keyCode == 37){ //left arrow
        var newCaretPosition;
        if (textareas.value.substring(textareas.getCaretPosition() - 4, textareas.getCaretPosition()) == tabspace) { //it's a tab space
            newCaretPosition = textareas.getCaretPosition() - 3;
            textareas.setCaretPosition(newCaretPosition);
        }
    }
    if(event.keyCode == 39){ //right arrow
        var newCaretPosition;
        if (textareas.value.substring(textareas.getCaretPosition() + 4, textareas.getCaretPosition()) == tabspace) { //it's a tab space
            newCaretPosition = textareas.getCaretPosition() + 3;
            textareas.setCaretPosition(newCaretPosition);
        }
    }
}
