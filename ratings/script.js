function loadMainPage() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        console.log(xmlhttp.responseText);
        console.log(xmlhttp.status);
        if (xmlhttp.status === 200) {
            const json = JSON.parse(xmlhttp.responseText);
            console.log(json);
            const albums = json.albums;
            for (let k in albums) {
                addAlbumToMain(albums[k]);
            }
        }
    }
    xmlhttp.open("GET", `https://raw.githubusercontent.com/n0j0games/ratings/main/router.json`, false);
    xmlhttp.send();
}

function addAlbumToMain(albumString) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        console.log(xmlhttp.responseText);
        console.log(xmlhttp.status);
        if (xmlhttp.status === 200) {
            const json = JSON.parse(xmlhttp.responseText);
            console.log(json);
            document.getElementById("ratings").innerHTML +=
                `<a href="rating.html?v=${albumString}" class="album">
                    <div class="albumOverlay">
                        <p>${json.title}</p>
                    </div>
                    <img src="${json.image}" alt="">
                 </a>`
        }
    }
    xmlhttp.open("GET", `https://raw.githubusercontent.com/n0j0games/ratings/main/${albumString}.json`, false);
    xmlhttp.send();
}

function loadReviewPage() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const albumURL = urlParams.get('v');
    if (albumURL == null || albumURL === "router") {
        console.log("geht nicht lol");
        return 0;
    }

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange=function() {
        console.log(xmlhttp.responseText);
        console.log(xmlhttp.status);
        if (xmlhttp.status === 200) {
            const json = JSON.parse(xmlhttp.responseText);
            console.log(json);
            buildReview(json);
        } else if (xmlhttp.status === 404) {
            window.location.href = '404.html'; //one level up
        }
    }
    xmlhttp.open("GET", `https://raw.githubusercontent.com/n0j0games/ratings/main/${albumURL}.json`, false);
    xmlhttp.send();
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

    for (let i=0; i<songs.length; i++) {
        let paragraph = "";
        const artist = songs[i].artist;
        const name = songs[i].name;
        const rating = songs[i].rating;
        const feature = songs[i].ft;

        paragraph += `<div class="song"><p class="songCredits"><b class="songName">${name}</b>`

        if (artist != null) {
            paragraph += `<br>${artist}`;
        }
        if (feature != null) {
            paragraph += `<br>(ft. ${feature})`;
        }

        paragraph += `</p><p class="songRating">${rating}</p></div>`;
        newHtml += `<p class="song">${paragraph}</p>`;
    }
    actualRating.innerHTML = newHtml;
}