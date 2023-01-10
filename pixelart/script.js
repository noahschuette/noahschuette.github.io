function load() {
    request("GET", `https://raw.githubusercontent.com/n0j0games/pixelart/main/index.json`, function (status, err, resp) {
        console.log(status);
        if (err) {
            console.log(err);
            return;
        }

        const head = document.getElementById("pixelArt");
        let html = ""
        const json = JSON.parse(resp);

        const len = Math.round(json.length / 3);
        console.log(json.length, len)

        for (let i = 0; i < json.length; i++) {
            if (i % len === 0) {
                if (i !== 0)
                    html += `</div>`
                html += `<div class="col">`
            }
            html += `<img src="https://raw.githubusercontent.com/n0j0games/pixelart/main/${json[i]}">`
        }
        html+= `</div>`
        head.innerHTML = html;
    });
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
