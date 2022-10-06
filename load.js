const pantryid = "f131829c-6c79-4bc7-8451-ef4bbe7cccac";

function redirect(link) {
    window.location.href = link;
}

function load() {
    loadMain();
    loadSpotify();
}

function loadMain() {
    callApi("GET",`https://getpantry.cloud/apiv1/pantry/${pantryid}/basket/main`,null,function() {
        if (this.status === 200) {
            replaceMain(JSON.parse(this.responseText));
        } else {
            console.error(`> Error ${this.status}: ${this.responseText}`);
        }
    });
}

function replaceMain(json) {
    document.title = json.title;
    document.getElementById("title").innerHTML = json.header_main;
    document.getElementById("subtitle").innerHTML = json.header_sub;
}

/*
    LIGHT / DARKMODE
 */

function loadDarkmode() {
    const darkmode = localStorage.getItem("darkmode");
    if (darkmode === null) {
        localStorage.setItem("darkmode","true");
        return;
    } else if (darkmode === "true") {
        const light1 = document.documentElement.style.getPropertyValue('--light1');
        const light2 = document.documentElement.style.getPropertyValue('--light2');
        const dark1 = document.documentElement.style.getPropertyValue('--dark1');
        const dark2 = document.documentElement.style.getPropertyValue('--dark2');
        document.documentElement.style.setProperty('--light1',dark1);
        document.documentElement.style.setProperty('--light2',dark2);
        document.documentElement.style.setProperty('--dark1',light1);
        document.documentElement.style.setProperty('--dark2',light2);
    }
}

/*
    SPOTIFY FEATURE
 */

function loadSpotify() {
    callApi("GET",`https://getpantry.cloud/apiv1/pantry/${pantryid}/basket/spotify`,null,function() {
        if (this.status === 200) {
            replaceSpotify(JSON.parse(this.responseText));
        } else {
            console.error(`> Error ${this.status}: ${this.responseText}`);
        }
    });
}

function replaceSpotify(json) {
    json = json.songdata;
    document.getElementById("spotifyArtist").innerHTML = json.artists[0].name;
    const titleObj = document.getElementById("spotifyTitle");
    titleObj.innerHTML = json.name.split("(")[0];
    titleObj.href = json.external_urls.spotify;
    document.getElementById("spotifyImg").src = json.album.images[0].url;
    const albumname = json.album.name;
    if (json.name !== albumname)
        document.getElementById("spotifyAlbum").innerHTML = ` on ${albumname}`;
    else
        document.getElementById("spotifyAlbum").style.display = "none";
    document.getElementById("spotify").style.display = "flex";
}

function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    xhr.onload = callback;
}