let gen = "<div class=\"slidersub\">\n" +
    "          <p class=\"slidertxt\">HUE</p>\n" +
    "          <input onclick=\"changeTxt()\" type=\"range\" min=\"0\" max=\"360\" value=\"0\" class=\"slider\" id=\"hueRange\">\n" +
    "          <p class=\"slidertxtSub\" id=\"hueAmt\">0</p>\n" +
    "        </div>\n" +
    "        <div class=\"slidersub\">\n" +
    "          <p class=\"slidertxt\">DEPTH</p>\n" +
    "          <input onclick=\"changeTxt()\" type=\"range\" min=\"1\" max=\"7\" value=\"4\" class=\"slider\" id=\"varRange\">\n" +
    "          <p class=\"slidertxtSub\" id=\"varAmt\">4</p>\n" +
    "        </div>\n" +
    "        <div class=\"slidersub\">\n" +
    "          <p class=\"slidertxt\">COLORS</p>\n" +
    "          <input onclick=\"changeTxt()\" type=\"range\" min=\"0\" max=\"6\" value=\"3\" class=\"slider\" id=\"amtRange\">\n" +
    "          <p class=\"slidertxtSub\" id=\"amtAmt\">7</p>\n" +
    "        </div>\n" +
    "        <div class=\"slidersub\">\n" +
    "          <p class=\"slidertxt\">LIGHT</p>\n" +
    "          <input onclick=\"changeTxt()\" type=\"range\" min=\"-10\" max=\"10\" value=\"0\" class=\"slider\" id=\"lightRange\">\n" +
    "          <p class=\"slidertxtSub\" id=\"lightAmt\">0</p>\n" +
    "        </div>\n" +
    "        <button id=\"genBtn\" onclick=\"setScheme()\">Generate</button>"

let genOpen = false;

function openGenerator(){
    if (genOpen){
        genOpen = false;
        document.getElementById("gen").innerHTML = "";
    } else {
        genOpen = true;
        document.getElementById("gen").innerHTML = gen;
    }
}

function changeTxt(){
    document.getElementById("hueAmt").textContent = document.getElementById("hueRange").value;
    document.getElementById("varAmt").textContent = document.getElementById("varRange").value;
    document.getElementById("amtAmt").textContent = document.getElementById("amtRange").value*2+1;
    document.getElementById("lightAmt").textContent = document.getElementById("lightRange").value;
}

function setScheme(){
    let hueRange = document.getElementById("hueRange").value;
    let varRange = document.getElementById("varRange").value/10+0.5;
    let amtRange = document.getElementById("amtRange").value*2;
    let lightRange = document.getElementById("lightRange").value;

    newScheme(hueRange, 74, 55, amtRange, varRange, lightRange);
}

function newScheme(h, s , v, varAmount, variance, light){
    delPalette();

    let intervall = 10;
    let hueIntervall = 20;
    let sw = false;

    let hue = parseInt(h) - (light/2);
    let sat = parseInt(s) - parseInt(light);
    let val = parseInt(v) + parseInt(light);
    let colors = [(hue + ',' + sat + ',' + val)];

    if (hue < 0){
        hue = 360 + hue;
    } else if (hue > 360){
        hue = hue - 360;
    }

    for (let i=0; i<varAmount;i++){
        if (i < varAmount/2){
            hue += hueIntervall;
            sat -= intervall * variance;
            val += intervall * variance;
        } else {
            if (sw === false){
                sw = true;
                hue = parseInt(h) - (light/2);
                sat = parseInt(s) - parseInt(light);
                val = parseInt(v) + parseInt(light);
            }
            hue -= hueIntervall;
            sat += intervall * variance;
            val -= intervall * variance;
        }
        if (hue < 0){
            hue = 360 + hue;
        } else if (hue > 360){
            hue = hue - 360;
        }

        if (sat < 0){
            sat = 0;
        } else if (sat > 100){
            sat = 100;
        } if (val < 0){
            val = 0;
        } else if (val > 100){
            val = 100;
        }
        console.log("pushing " + hue + "," + sat + "," + val);
        colors.push(hue + ',' + sat + ',' + val);
    }

    for (let i=colors.length-1; i>colors.length/2; i--){
        enableAddColor();
        let hslColor = colors[i].split(',');
        document.getElementById("colorInput").value = hslToHex(hslColor[0], hslColor[1], hslColor[2]);
        addColor();
    }
    for (let i=0; i<colors.length/2; i++){
        enableAddColor();
        let hslColor = colors[i].split(',');
        document.getElementById("colorInput").value = hslToHex(hslColor[0], hslColor[1], hslColor[2]);
        addColor();
    }
    if (document.getElementById("newPalette") != null){
        document.getElementById("newPalette").remove();
    }

}

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `${f(0)}${f(8)}${f(4)}`;
}

// color bar

function setBarBackground() {
    let hueRange = document.getElementById("hueRange");
    let satRange = document.getElementById("satRange");
    let valRange = document.getElementById("lightRange");
    console.log('linear-gradient(to right, #' + hslToHex(hueRange.value,0,100) + ', #' + hslToHex(hueRange.value,100,100) + ');');
    satRange.style.background = 'linear-gradient(to right, #' + hslToHex(hueRange.value,0,100) + ', #' + hslToHex(hueRange.value,100,100) + ');';
    valRange.style.background = 'linear-gradient(to right, #' + hslToHex(hueRange.value,100,0) + ', #' + hslToHex(hueRange.value,100,100) + ');';
}
