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
        },
        movies : {
            self: document.getElementById("irl_movies")
        },
        books : {
            self: document.getElementById("irl_books")  
        },
        avatar : document.getElementById("char"),
        aboutme : document.getElementById("aboutme"),
        mid : document.getElementById("midContent"),
    }
    loadIRL();
    setChar("idle");
}

/*
    CHARACTER FEATURE
*/

function setChar(state) {
    if (state === "idle") {
        const date = new Date();
        const hour = date.getHours();
        if (hour >= 2 && hour <= 11) {
            html.avatar.src = "images/emotes/state_sleep.png"
        } else {
            html.avatar.src = "images/emotes/state_uwu.png"
        } 
    } else if (state === "music") {
        html.avatar.src = "images/emotes/state_music.png"
    } else {
        console.warn("Unknown state: " + state);
        html.avatar.src = "images/emotes/state_uwu.png"
    }
}

/*
    SPOTIFY FEATURE
 */

const backend = "https://noahschuette-api.onrender.com/api/"
//const backend = 'http://127.0.0.1:8081/api/'

let inloop = 0;

function loadIRL() {
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
                loadIRL();
            }, 5000);
        } else {
            inloop = 0;
            console.error(`> Error: Timed out several times`);
        }
    }
    xhr.onload = function () {
        if (this.status === 200) {
            inloop = 0;
            replaceIRL(JSON.parse(this.responseText));
        } else if (this.status === 401 && inloop < 10) {
            inloop++;
            console.log("Auth code expired, trying again in 1 sec");
            setTimeout(function() {
                loadIRL();
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

let noneActive = true;
let islistening = false;

function activate(name) {
    noneActive = false;
    if (name === "spotify" && islistening) {
        html.spotify.self.style.display = "flex";
        html.movies.self.style.display = "none";
        html.books.self.style.display = "none";
    } else if (name === "movies") {
        html.spotify.self.style.display = "none";
        html.movies.self.style.display = "flex";
        html.books.self.style.display = "none";
    } else if (name === "books") {
        html.spotify.self.style.display = "none";
        html.movies.self.style.display = "none";
        html.books.self.style.display = "flex";
    } 
}

let showSide = true;
function toggle() {
    html.mid.style.transition = "opacity 1s";
    html.aboutme.style.transition = "opacity 1s";
    if (showSide) {
        html.mid.style.opacity = 0;
        html.aboutme.style.opacity = 1;
        html.mid.style.zIndex = 0;
        html.aboutme.style.zIndex = 1;
    } else {
        html.mid.style.opacity = 1;
        html.aboutme.style.opacity = 0;
        html.mid.style.zIndex = 1;
        html.aboutme.style.zIndex = 0;
    }
    showSide = !showSide;
}

function replaceIRL(json) {
    islistening = json.islistening;
    if (islistening === false) {
        setChar("idle");
        html.spotify.self.style.display = "none"; 
        setTimeout(function() {
            loadIRL();
        }, 120000);
        return;
    }
    setChar("music");
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
        loadIRL();
    }, 120000);
}

function toRGBString(color) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}
