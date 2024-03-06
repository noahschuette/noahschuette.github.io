function redirect(link) {
    window.location.href = link;
}

let isOnMobile = false;

function load() {

    if (window.screen && window.screen.width < 1100) {
        isOnMobile = true;
    }
    console.log(isOnMobile);
    
    html = {
        leftcontent : document.getElementById("leftContent"),
        rightcontent : document.getElementById("rightContent"),
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
            self: document.getElementById("irl_movies"),
            title : document.getElementById("irlMoviesTitle"),
            year : document.getElementById("irlMoviesYear"),
            director : document.getElementById("irlMoviesBy"),
            rating: document.getElementById("irlMoviesRating"),
            stars : document.getElementById("irlMoviesStars"),
            image : document.getElementById("irlMoviesImage")
        },
        music : document.getElementById("irl_music"),
        books : {
            self: document.getElementById("irl_books")  
        },
        avatar : document.getElementById("char"),
        aboutme : document.getElementById("aboutme"),
        current : document.getElementById("current"),
        projectPage : {
            self : document.getElementById("projectPage"),
            main : document.getElementById("project"),
        },
        mid : document.getElementById("midContent"),
        togglemid_enabled : document.getElementById("toggleMidEnabled"),
        togglemid_disabled : document.getElementById("toggleMidDisabled"),
    }
    html.spotify.self.style.display = "none"; 
    html.movies.self.style.display = "none";
    html.music.style.display = "none";
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
            html.avatar.src = "images/chars/state_sleep.png"
        } else {
            html.avatar.src = "images/chars/state_uwu.png"
        } 
    } else if (state === "music") {
        html.avatar.src = "images/chars/state_music.png"
    } else {
        console.warn("Unknown state: " + state);
        html.avatar.src = "images/chars/state_uwu.png"
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
    const body = null;
    let xhr = new XMLHttpRequest();
    xhr.open(method, backend+"spotify/playback", true);
    xhr.send(body);
    xhr.timeout = 4000;
    xhr.ontimeout = function () { 
        inloop++;
        if (inloop < 20) {
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
            loadMovies(JSON.parse(this.responseText));
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

function loadMovies(dataFromSpotify) {
    const method = "GET";
    const body = null;
    let xhr = new XMLHttpRequest();
    xhr.open(method, backend+"letterboxd/recent", true);
    xhr.send(body);
    xhr.onload = function () {
        if (this.status === 200) {
            inloop = 0;
            replaceIRL(dataFromSpotify, JSON.parse(this.responseText));
        } else {
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

function loadProject(name) {

    /*if (window.screen && window.screen.width < 1100) {
        if (name === "releasr") {
            window.location.href = "https://releasr.noahschuette.de";
        } else if (name === "palettecrafter") {
            window.location.href = "https://palettecrafter.noahschuette.de";
        } else if (name === "smashteroid") {
            window.location.href = "https://n0j0games.itch.io/smashteroid";
        } else {
            console.error("Unknown project: " + name);
        }
        return;
    }*/

    const releasr = {
        title : "RELEASR",
        desc : "Spotify Release Tracker",
        tags : ["web", "spotify-api", "js", "html/css"],
        fullDesc : `Artist release tracker for Spotify. Get notified when your favorite artists release new music.<br><br>
        Features:<br>
        - Synchronize your followed artists with Spotify<br>
        - Alternatively add artists manually<br>
        - Search for new releases in playlists like "New Music Friday"<br>
        - Various filters & highly customizable<br>`,
        links : {
            website : "https://releasr.noahschuette.de",
            website_name : "releasr.noahschuette.de",
            repo : "spotifyreleasetracker",
        },
        src : "https://releasr.noahschuette.de/images/favicon.png",
        status : "active"
    }

    const palettecrafter = {
        title : "PALETTECRAFTER",
        desc : "Minecraft Color-Palette Generator",
        tags : ["web", "node-js", "html/css", "minecraft"],
        fullDesc : `Pick any color and this generator finds the matching minecraft block<br><br>
        Features:<br>
        - Find matching blocks based on a color<br>
        - Create palettes from these blocks<br>
        - Save palettes and share them with others<br>`,
        links : {
            website : "https://palettecrafter.noahschuette.de",
            website_name : "palettecrafter.noahschuette.de",
            repo : "palettecrafter",
        },
        src : "https://palettecrafter.noahschuette.de/images/icon.png",
        status : "active"
    }

    const smashteroid = {
        title : "SMASHTEROID",
        desc : "2D Asteroid Shooter for Android",
        tags : ["android", "C#", "unity engine"],
        fullDesc : `Smashteroid is an endless shooter for Android in which you have to destroy asteroids so that your ship doesn't explode.`,
        links : {
            website : "https://n0j0games.itch.io/smashteroid",
            website_name : "n0j0games.itch.io/smashteroid",
            repo : null,
        },
        src : "https://n0j0games.github.io/n0j0games_archive/images/smashteroidLogo.png",
        status : "finished"
    }

    if (name === "releasr") {
        buildProjectPage(releasr);
        toggle("projectPage");
    } else if (name === "palettecrafter") {
        buildProjectPage(palettecrafter);
        toggle("projectPage");
    } else if (name === "smashteroid") {
        buildProjectPage(smashteroid);
        toggle("projectPage");
    } else {
        console.error("Unknown project: " + name);
    }

}

function buildProjectPage(content) {

    let tags = "";
    if (content.status === "active") {
        tags += `<p class="active">In Development</p>`;
    } else {
        tags += `<p class="finished">Finished</p>`;
    }
    for (let i = 0; i < content.tags.length; i++) {
        tags += `<p>${content.tags[i]}</p>`;
    }

    let repo = "";
    if (content.links.repo !== null) {
        repo = `
        <a class="projectLink" target="_blank" href="https://github.com/n0j0games/${content.links.repo}">
            <i class="fa-brands fa-github"></i>
            <p>repo: ${content.links.repo}</p>
        </a>`;
    }

    const html_ = `
    <div id="project_top">
        <img id="projectImg" src="${content.src}" alt="">
        <div id="project_right">
            <p id="projectTitle">${content.title}</p>
            <p id="projectDesc">${content.desc}</p>
            <div id="project_tags">
                ${tags}
            </div>
        </div>
    </div> 
    <p id="projectFullDesc">${content.fullDesc}</p>
    <a class="projectLink" target="_blank" href="${content.links.website}">
        <i class="fa-solid fa-link"></i>
        <p>${content.links.website_name}</p>
    </a>
    ${repo}`;

    html.projectPage.main.innerHTML = html_;
}

function toggle(type) {
    html.mid.style.transition = "opacity 1s";
    html.aboutme.style.transition = "opacity 1s";
    html.current.style.transition = "opacity 1s";
    html.leftcontent.style.transition = "opacity 2s";
    html.rightcontent.style.transition = "opacity 2s";
    html.projectPage.self.style.transition = "opacity 1s";
    if (type === "about") {  
        html.mid.style.opacity = 0;
        html.aboutme.style.opacity = 1;
        html.mid.style.zIndex = 0;
        html.aboutme.style.zIndex = 1;
        if (isOnMobile) {
            html.aboutme.style.display = "flex";
            html.leftcontent.style.opacity = 0;
            html.rightcontent.style.opacity = 0;
            html.leftcontent.style.zIndex = 0;
            html.rightcontent.style.zIndex = 0;
        }
    } else if (type === "current") {
        html.mid.style.opacity = 0;
        html.current.style.opacity = 1;
        html.mid.style.zIndex = 0;
        html.current.style.zIndex = 1;
        if (isOnMobile) {
            html.current.style.display = "flex";
            html.leftcontent.style.opacity = 0;
            html.rightcontent.style.opacity = 0;
            html.leftcontent.style.zIndex = 0;
            html.rightcontent.style.zIndex = 0;
        }
    } else if (type === "projectPage") {
        html.current.style.opacity = 0;
        html.aboutme.style.opacity = 0;
        html.current.style.zIndex = 0;
        html.aboutme.style.zIndex = 0;
        html.mid.style.opacity = 0;
        html.projectPage.self.style.opacity = 1;
        html.mid.style.zIndex = 0;
        html.projectPage.self.style.zIndex = 1;
        if (isOnMobile) {
            html.projectPage.self.style.display = "flex";
            html.leftcontent.style.opacity = 0;
            html.rightcontent.style.opacity = 0;
            html.leftcontent.style.zIndex = 0;
            html.rightcontent.style.zIndex = 0;
        }
    } else if (type === "close") {    
        html.mid.style.opacity = 1;
        html.aboutme.style.opacity = 0;
        html.mid.style.zIndex = 1;
        html.aboutme.style.zIndex = 0;
        if (isOnMobile) {
            html.aboutme.style.display = "none";
            html.leftcontent.style.opacity = 1;
            html.rightcontent.style.opacity = 1;
            html.leftcontent.style.zIndex = 1;
            html.rightcontent.style.zIndex = 1;
        }
    } else if (type === "closeCurrent") {
        html.mid.style.opacity = 1;
        html.current.style.opacity = 0;
        html.mid.style.zIndex = 1;
        html.current.style.zIndex = 0;
        if (isOnMobile) {
            html.current.style.display = "none";
            html.leftcontent.style.opacity = 1;
            html.rightcontent.style.opacity = 1;
            html.leftcontent.style.zIndex = 1;
            html.rightcontent.style.zIndex = 1;
        }
    } else if (type === "closeProject") {   
        html.mid.style.opacity = 1;
        html.projectPage.self.style.opacity = 0;
        html.mid.style.zIndex = 1;
        html.projectPage.self.style.zIndex = 0;
        if (isOnMobile) {
            html.current.style.display = "none";
            html.leftcontent.style.opacity = 1;
            html.rightcontent.style.opacity = 1;
            html.leftcontent.style.zIndex = 1;
            html.rightcontent.style.zIndex = 1;
        }
    }
}

function replaceIRL(dataFromSpotify, dataFromLetterboxd) {
    
    setChar("idle");

    html.spotify.self.style.display = "none"; 
    html.movies.self.style.display = "none";
    islistening = dataFromSpotify.islistening;
    iswatching = dataFromLetterboxd.iswatching;
    if (islistening !== false) {
        setChar("music");
        let json = dataFromSpotify.json;
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
        html.spotify.self.style.display = "flex";
    }

    if (iswatching !== false) {
        let json = dataFromLetterboxd.movie;
        html.movies.title.innerHTML = json.title;
        html.movies.year.innerHTML = json.year;
        html.movies.director.innerHTML = json.director;
        html.movies.rating.href = json.href;
        html.movies.image.src = json.poster;
        let temp = "";
        let floored = Math.floor(json.rating);
        for (let i = 0; i < floored; i++) {
            temp += `<i class="fa-solid fa-star"></i>`;
        }
        if (json.rating % 1 !== 0) {
            temp += `<i class="fa-regular fa-star-half-stroke"></i>`;
            floored++;
        }
        for (let i = floored; i < 5; i++) {
            temp += `<i class="fa-regular fa-star"></i>`;
        }
        html.movies.stars.innerHTML = temp;
        html.movies.self.style.display = "flex";
    }

    html.music.style.display = "flex";
    
    html.togglemid_enabled.style.display = "block";
    html.togglemid_disabled.style.display = "none"; 

    setTimeout(function() {
        loadIRL();
    }, 120000);
}

function toRGBString(color) {
    return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
}