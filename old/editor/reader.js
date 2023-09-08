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
          realTitle = realTitle.slice(0, i);
          break;
        }
      }
      title.value = realTitle;

  };
  reader.readAsText(file);
}
