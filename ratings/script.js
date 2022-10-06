let sections = [ { "type" : "default" , "contentTag" : "default" , "label" : "Alle Reviews" , "content" : ""} ];

function loadMainPage() {
    request("GET", `https://raw.githubusercontent.com/n0j0games/ratings/main/router.json`, function (status, err, resp) {
        console.log(status);
        if (err) {
            console.log(err);
            return;
        }
        const json = JSON.parse(resp);
        console.log(json);

        const structure = json.structure;

        for (let i in structure) {
            sections.push({ "type" : structure[i].type , "contentTag" : structure[i].content , "label" : structure[i].label , "content" : ""});
        }

        const albums = json.albums;
        for (let k in albums) {
            addAlbumToMain(albums[k]);
        }
    });
}

function addAlbumToMain(albumString) {
    request("GET", `https://raw.githubusercontent.com/n0j0games/ratings/main/${albumString}.json`, function (status, err, resp) {
        console.log(status);
        if (err) {
            console.log(err);
            return;
        }
        const json = JSON.parse(resp);
        console.log(json);
        for (let k in sections) {
            if (sections[k].type === "artist" && sections[k].contentTag === )
            sections[k].content += `
            <a href="rating.html?v=${albumString}" class="album">
                    <div class="albumOverlay">
                        <p>${json.title}</p>
                    </div>
                    <img src="${json.image}" alt="">
                 </a>`;
        }
        /*document.getElementById("ratings").innerHTML +=
            `<a href="rating.html?v=${albumString}" class="album">
                    <div class="albumOverlay">
                        <p>${json.title}</p>
                    </div>
                    <img src="${json.image}" alt="">
                 </a>`*/
    });
}

function loadReviewPage() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const albumURL = urlParams.get('v');
    if (albumURL == null || albumURL === "router") {
        window.location.href = '404.html';
        return 0;
    }

    request("GET", `https://raw.githubusercontent.com/n0j0games/ratings/main/${albumURL}.json`, function (status, err, resp) {
        if (status === 404) {
            window.location.href = '404.html';
        }
        if (err) {
            console.log(err);
            return;
        }
        const json = JSON.parse(resp);
        console.log(json);
        buildReview(json);
    });
}

function buildReview(json) {
    const albumTitleObj = document.getElementById("albumTitle");
    const albumArtistObj = document.getElementById("albumArtist");
    const albumDateObj = document.getElementById("albumDate");
    const fullRatingObj = document.getElementById("fullRating");
    const actualRating = document.getElementById("actualRating");
    const albumImg = document.getElementById("albumImg");

    albumTitleObj.innerHTML = json.title;
    albumArtistObj.innerHTML = json.artist;
    albumDateObj.innerHTML = json.year;
    fullRatingObj.innerHTML = json.rating;
    albumImg.src = json.image;
    albumImg.alt = json.title;

    document.title = json.title + " - RateNowCryLater";
    document.body.style.backgroundColor = json.color;

    let newHtml = "";
    const songs = json.songs;

    let tags = [];

    for (let i=0; i<songs.length; i++) {
        let paragraph = "";
        const artist = songs[i].artist;
        const name = songs[i].name;
        const rating = songs[i].rating;
        const feature = songs[i].ft;
        const tag = songs[i].tag;

        paragraph += `<div class="song"><p class="songCredits"><b class="songName">${name}</b>`

        if (artist != null && feature != null) {
            paragraph += `<br>${artist} (feat. ${feature})`;
        } else if (artist != null) {
            paragraph += `<br>${artist}`;
        } else if (feature != null) {
            paragraph += `<br>(feat. ${feature})`;
        }

        paragraph += `</p><p class="songRating">${rating}</p></div>`;
        //paragraph = `<p class="songName">${paragraph}</p>`;
        let foundTag = false;
        for (let j in tags) {
            if (tags[j].tag === tag) {
                tags[j].content += paragraph;
                foundTag = true;
                break;
            }
        }
        if (!foundTag) {
            tags.push({"tag" : tag, "content" : paragraph});
        }
    }
    
    for (let j in tags) {
        if (tags[j].tag == null) {
            newHtml += `${tags[j].content}`
        } else {
            newHtml += `<div class="tag"><hr><p>${tags[j].tag}</p><hr></div> ${tags[j].content}`
        }
    }
    actualRating.innerHTML = newHtml;
}

function request(method, url, done) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(xhr.status, null, xhr.response);
    };
    xhr.onerror = function () {
        done(xhr.status, xhr.response);
    };
    xhr.send();
}

/*async function request(header) {
    console.log("req");
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState === 4) {
            console.log(xmlhttp.status);
            return { "response" : xmlhttp.responseText, "status" : xmlhttp.status};
        }
    }
    xmlhttp.open("GET", header);
    xmlhttp.send();
}*/