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
    LIGHT / DARKMODE
 */

/*
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
*/

/*
    SPOTIFY FEATURE
 */

const backend = "https://noahschuette-api.onrender.com/api/"

let inloop = 0;

function loadSpotify() {
    const method = "GET";
    const sub = "spotify/playback";
    const body = null;
    let xhr = new XMLHttpRequest();
    xhr.open(method, backend+sub, true);
    xhr.send(body);
    xhr.onload = function () {
        if (this.status === 200) {
            inloop = 0;
            replaceSpotify(JSON.parse(this.responseText));
        } else if (this.status === 401 && inloop < 10) {
            inloop++;
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
    let album = json.album.split("(")[0].split("[")[0];
    let title = json.song.split("(")[0].split("[")[0];
    if (json.isalbum) {
        html.spotify.title.style.display = "flex";
        if (title.length > 23) {
            html.spotify.title.innerHTML = fontawesome.solid.music + title.substring(0,20) + "...";
        } else {
            html.spotify.title.innerHTML = fontawesome.solid.music + title;
        }
    } else {
        album = title;
        html.spotify.title.style.display = "none";
    }
    if (album.length > 35) {
        html.spotify.album.innerHTML = album.substring(0,32) + "...";
    } else {
        html.spotify.album.innerHTML = album;
    }
    html.spotify.album.href = json.href;
    html.spotify.img.src = json.image;

    let nearest = 255*3;
    let nearest_i = 0;
    const opt = 255*3/0.5;
    for (let i in json.palette) {
        const diff = Math.abs((json.palette[i][0]+json.palette[i][1]+json.palette[i][2])-opt);
        if (diff < Math.abs(nearest-opt)) {
            nearest = diff;
            nearest_i = i;
        }
    }
    html.spotify.divSmall.style.backgroundColor = 'rgb(' + json.palette[nearest_i][0] + ',' + json.palette[nearest_i][1] + ',' + json.palette[nearest_i][2] + ')';
    
    //html.spotify.imgSmall.src = json.image;
    html.spotify.self.style.display = "flex";

    /*setTimeout(function() {
        loadSpotify();
    }, 120000);*/

}