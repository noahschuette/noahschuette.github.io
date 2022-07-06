const redirect_uri = "https://noahschuette.github.io/crawlspotifyartist/index.html";
const client_id = "d1cc5a453d334f8f968e03fb6ba1be00";
const client_secret = "ef56b93808c24a91bda1f2ee35b78c85";
const authorize = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
let access_token = "";
let refresh_token = "";

/*----------------------------------------------------------------------------------------------------------------------
MAIN
----------------------------------------------------------------------------------------------------------------------*/

window.onPageLoad = function (){
    const location = window.location.href.split("?")[0];
    if (location !== redirect_uri) {
        console.log("wrong uri", location, redirect_uri);
        return;
    }

    //document.getElementById("app").style.display = 'none';
    if ( window.location.search.length > 0 ){
        handleRedirect();
    } else {
        access_token = localStorage.getItem("access_token");
        if ( access_token == null ){
            // we don't have an access token so present token section
            document.getElementById("authorize").style.display = 'block';
            document.getElementById("app").style.display = 'none';
        }
        else {
            // present app section
            document.getElementById("app").style.display = 'block';
            document.getElementById("authorize").style.display = 'none';
        }
    }
}

/*----------------------------------------------------------------------------------------------------------------------
SPOTIFY-API
----------------------------------------------------------------------------------------------------------------------*/

const collectionDiv = document.getElementById("collection");
const featDiv = document.getElementById("collectionFeat");
const variousDiv = document.getElementById("collectionsVarious");
const counterP = document.getElementById("counter");
const artistP = document.getElementById("artistInfo");
let songlist = [];
let albumlist = [];
let counter = 0;
let counterWithVarious = 0;

window.findArtist = function () {
    const input = document.getElementById("search").value;
    if (input === "")
        return;
    const string = input.replaceAll(" ","%20");
    const search = `https://api.spotify.com/v1/search?type=artist&q=${string}`;
    callApi("GET", search, null, handleSearch);
}

function handleSearch() {
    if ( this.status === 200 ){
        let data = JSON.parse(this.responseText).artists;
        console.log(data);
        if (data.total == 0) {
            artistInfo.innerHTML = "No artist found";
            return;
        }
        const artist = data.items[0];
        artistInfo.innerHTML = `Searching for <a href="${artist.external_urls.spotify}">${artist.name}</a>`;
        artist_id = artist.id;
        initGetArtists();
    } else if ( this.status === 401 ){
        refreshToken();
    } else {
        console.error(this.responseText);
    }
}

function initGetArtists() {
    counter = 0;
    counterWithVarious = 0;
    songlist = [];
    albumlist = [];
    const html = `<tr>
                <th>Main Artist</th>
                <th>Name</th>
                <th>Album Type</th>
                <th>Date</th>
            </tr>
            `;
    collectionDiv.innerHTML = html;
    featDiv.innerHTML = html;
    variousDiv.innerHTML = html;
    getArtistsSongs(0);
}

let artist_id = "";

window.getArtistsSongs = function(offset) {
    const artist = `https://api.spotify.com/v1/artists/${artist_id}/albums?limit=50&offset=${offset}`;
    callApi("GET", artist, null, handleAlbums);
}

function handleAlbums() {
    if ( this.status === 200 ){
        let data = JSON.parse(this.responseText);
        console.log(data);
        let items = data.items;
        for (let item in items) {
            if (albumlist.includes(items[item].name))
                continue;
            albumlist.push(items[item].name);
            const content = `<tr><th>${items[item].artists[0].name}</th>
                <th><b><a target="_blank" href="${items[item].external_urls.spotify}">${items[item].name}</a></b></th>
                <th>${items[item].album_type}</th>
                <th>${items[item].release_date}</th>
                </th>`;
            if (items[item].artists[0].name === "Verschiedene Interpreten" || items[item].album_type === "compilation") {
                variousDiv.innerHTML += content;
                counterWithVarious++;
                continue;
            }
            counter++;
            counterP.innerHTML = `Found: ${counter} albums/singles, and ${counterWithVarious} compilations: `;
            if (items[item].album_group === "appears_on") {
                featDiv.innerHTML += content;
            } else {
                collectionDiv.innerHTML += content;
            }
            //getAlbumTracks(items[item].id);
        }
        if (data.total > data.offset + data.limit) {
            getArtistsSongs(data.offset + data.limit);
        }
    } else if ( this.status === 401 ){
        refreshToken();
    } else {
        console.error(this.responseText);
    }
}

function getAlbumTracks(id) {
    const album = `https://api.spotify.com/v1/albums/${id}/tracks?limit=50`;
    callApi("GET", album, null, handleAlbum);
}

function handleAlbum() {
    if ( this.status === 200 ){
        let data = JSON.parse(this.responseText);
        console.log("album:", data);
    } else if ( this.status === 401 ){
        refreshToken();
    } else {
        console.error(this.responseText);
    }
}

/*
    Authorization & Login Section
 */

function handleRedirect() {
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code;
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshToken() {
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status === 200 ) {
        let data = JSON.parse(this.responseText);
        if ( data.access_token !== undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  !== undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        location.reload();
    } else {
        console.error(this.responseText);
        console.log(this.status, this.responseText);
        logout();
    }
}

function getCode() {
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

//Authorize user to app
window.requestAuthorization = function (){
    let url = authorize;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-follow-read user-read-private";
    //url += "&scope=user-follow-read user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

window.logout = function () {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    location.reload();
}

/*
    Spotify Api Call Function
 */

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}