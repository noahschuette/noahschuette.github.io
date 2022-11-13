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
        console.log("loading main");
        if (this.status === 200) {
            const json = JSON.parse(this.responseText);
            replaceMain(json.title, json.header_main, json.header_sub);
        } else {
            console.error(`> Error ${this.status}: ${this.responseText}`);
            replaceMain(":(","Hello There!","Fehler beim laden :/");
        }
    });
}

function replaceMain(title, main, sub) {
    document.title = title;
    document.getElementById("title").innerHTML = main;
    document.getElementById("subtitle").innerHTML = sub;
    document.getElementById("title").style.display = "flex";
    document.getElementById("subtitle").style.display = "flex";
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
        console.log("load spotify");
        if (this.status === 200) {
            replaceSpotify(JSON.parse(this.responseText));
        } else {
            console.error(`> Error ${this.status}: ${this.responseText}`);
        }
    });
}

function replaceSpotify(json) {
    json = json.songdata;
    console.log(json);
    const diff = compareDate(json);
    console.log(diff);
    if (diff > 10)
        return;
    document.getElementById("spotifyArtist").innerHTML = json.artists[0].name;
    const albumObj = document.getElementById("spotifyAlbum");
    albumObj.innerHTML = (json.album.name).split("(")[0];
    albumObj.href = json.album.external_urls.spotify;
    document.getElementById("spotifyImg").src = json.album.images[0].url;
    document.getElementById("spotifyImgSmall").src = json.album.images[0].url;
    document.getElementById("spotifyTitle").innerHTML = `<i class="fa-solid fa-music"></i> ` + json.name.split("(")[0];
    document.getElementById("spotify").style.display = "flex";
}

function compareDate(songdata) {
    let current = new Date(Date.now());
    let last = new Date(songdata.date);
    console.log(current.getHours(), current.getMinutes(), last.getHours(), last.getMinutes());
    let diff = current.getMinutes()-last.getMinutes();
    if (current.getHours() > last.getHours())
        diff += 60;
    return diff;
}

function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    xhr.onload = callback;
}