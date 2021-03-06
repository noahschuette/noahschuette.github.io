let allowCookies;

/* Removing Cookie banner on load if it has been removed once before */
function loadCookie(){
  var alreadyChecked = false;
  if (localStorage && 'alreadyChecked' in localStorage) {
    alreadyChecked = localStorage.alreadyChecked;
    if (alreadyChecked === 'true'){
      document.getElementById("cookieElem").remove();
    }
  }
  else {
    document.getElementById("cookieElem").style.opacity = 1;
  }
}

/* removing cookie banner smoothly */
function changeCookie(allowTemp) {
  allowCookies = allowTemp;
  localStorage.allowCookies = allowCookies;
  var x = document.getElementById("cookieElem");
  x.className = "cookies";
  x.style.opacity = 1;
  x.classList.toggle('active');
  x.style.opacity = 0;
  localStorage.alreadyChecked = true;
  location.reload();
}




