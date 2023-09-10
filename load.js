const pantryid = "f131829c-6c79-4bc7-8451-ef4bbe7cccac";

function redirect(link) {
    window.location.href = link;
}

function load() {
    
    html = {
        spotify : {
        self : document.getElementById("spotify"),
        artist : document.getElementById("spotifyArtist"),
        album : document.getElementById("spotifyAlbum"),
        img : document.getElementById("spotifyImg"),
        imgSmall : document.getElementById("spotifyImgSmall"),
        divSmall : document.getElementById("spotifyDivSmall"),
        title : document.getElementById("spotifyTitle"),
        link : document.getElementById("spotifyLink")
        }
    }
    loadSpotify();
}


/*
    SPOTIFY FEATURE
 */

const backend = "https://noahschuette-api.onrender.com/api/"
//const backend = 'http://127.0.0.1:8081/api/'

let inloop = 0;

function loadSpotify() {
    console.log("Opening request");
    const method = "GET";
    const sub = "spotify/playback";
    const body = null;
    let xhr = new XMLHttpRequest();
    xhr.open(method, backend+sub, true);
    xhr.send(body);
    xhr.timeout = 4000;
    xhr.ontimeout = function () { 
        inloop++;
        if (inloop < 10) {
            console.log("Timed out, trying again in 5 sec");
            setTimeout(function() {
                loadSpotify();
            }, 5000);
        } else {
            inloop = 0;
            console.error(`> Error: Timed out several times`);
        }
    }
    xhr.onload = function () {
        if (this.status === 200) {
            inloop = 0;
            replaceSpotify(JSON.parse(this.responseText));
        } else if (this.status === 401 && inloop < 10) {
            inloop++;
            console.log("Auth code expired, trying again in 1 sec");
            setTimeout(function() {
                loadSpotify();
            }, 1000);
        } else {
            inloop = 0;
            console.error(`> Error ${this.status}: ${this.responseText}`);
        }
    }
}

let html = {}

const fontawesome = {
    solid : {
        music : `<i class="fa-solid fa-music"></i>`,
    }
}

function replaceSpotify(json) {
    if (json.islistening === false) {
        return;
    }
    json = json.json;
    html.spotify.artist.innerHTML = json.artist + "'s";
    let album = json.album.split("(")[0].split("[")[0].split("-")[0];
    let title = json.song.split("(")[0].split("[")[0].split("-")[0];
    if (json.isalbum) {
        html.spotify.title.style.display = "flex";
        if (title.length > 35) {
            html.spotify.title.innerHTML = fontawesome.solid.music + title.substring(0,32) + "...";
        } else {
            html.spotify.title.innerHTML = fontawesome.solid.music + title;
        }
    } else {
        album = title;
        html.spotify.title.style.display = "none";
    }
    if (album.length > 30) {
        html.spotify.album.innerHTML = album.substring(0,27) + "...";
    } else {
        html.spotify.album.innerHTML = album;
    }
    html.spotify.album.href = json.href;
    html.spotify.img.src = json.image;

    const rgb = json.album_colors;

    html.spotify.divSmall.style.backgroundColor = toRGBString(rgb.comp);
    
    
    //html.spotify.imgSmall.src = json.image;
    html.spotify.self.style.display = "flex";

    setTimeout(function() {
        loadSpotify();
    }, 120000);
}

function toRGBString(color) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}