var binurl = "https://api.jsonbin.io/v3/b/615251b39548541c29b9a663";
var apikey = "$2b$10$xnvjY70FJ/3AkP6TgMxOYOpcTWr/12FGKcvzBP5znTq2JoAW5qJO2";


function readRequest(doRefresh){

    let storage = localStorage['jsonbin'];
    if (storage != null && !doRefresh){
        checkJSON(JSON.parse(storage));
        console.log("checked from localStorage");
        return;
    }

    document.getElementById("points").innerHTML = "";

    let req = new XMLHttpRequest();

    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            let json = req.responseText;
            let obj = JSON.parse(json);
            localStorage['jsonbin'] = JSON.stringify(obj);
            checkJSON(obj);
            console.log("refreshed check");
        }
    };

    req.open("GET", binurl + "/latest", true);
    req.setRequestHeader("X-Master-Key", apikey);
    req.send();
}

function help(){
    return "getJSON() | setJSON(`JSONSTRING`) | addPoints(INDEX,POINTS,MAXPOINTS)";
}

function checkJSON(obj){
    if (returnsError(obj)){
        console.log("error");
        return;
    }


    ///......
    let pointsObj = document.getElementById("points");

    let entries = getValue(obj,"entries");
    let count = 0;
    for(let k in entries){
        let temp = entries[k];
        let title = getValue(temp,"titel");
        let required = getValue(temp, "requiredpercentage");
        let maxvalues = getValue(temp, "max_values");
        let values = getValue(temp, "values");
        let valSum = 0;
        let maxSum = 0;
        for (let j in values){
            valSum += values[j];
            maxSum += maxvalues[j];
        }

        let percentage = valSum / maxSum;
        if (maxSum === 0){
            percentage = 0;
        }

        pointsObj.innerHTML += `<div class="scala" id="scala${count}"> <p class="scalaTitle">${title}</p> <p class="scalaPercentage">${(percentage*100).toFixed(0)}%</p> </div>`;
        let tempScala = document.getElementById(`scala${count}`);
        if (required <= percentage){
            tempScala.style.backgroundImage = `linear-gradient(to right, var(--ok) 0%, var(--ok) ${percentage*100}%, var(--mid) ${percentage*100+0.1}%)`
        } else {
            tempScala.style.backgroundImage = `linear-gradient(to right, var(--notok2) 0%, var(--notok2) ${percentage*100}%, var(--notok) ${percentage*100+0.1}%, var(--notok) ${required*100}%, var(--mid) ${required*100+0.1}%)`
        }
        count++;
    }

    let notes = document.getElementById("notes");
    let noteVal = getValue(obj,"notes");
    noteVal.replaceAll('\n','<br>');
    notes.innerHTML = noteVal;
}

function getJSON() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            let json = req.responseText;
            let obj = JSON.parse(json);
            if (returnsError(obj)){
                console.log("error");
                return;
            }
            let record = getValue(obj,"record");
            console.log(JSON.stringify(record));
        }
    };
    req.open("GET", binurl + "/latest", true);
    req.setRequestHeader("X-Master-Key", apikey);
    req.send();
}

function setJSON(string){
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            console.log(req.responseText);
        }
    };
    req.open("PUT", binurl, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", apikey);
    req.send(string);
}

function returnsError(obj){
    for (var k in obj){
        if (k === "message"){
            return true;
        }
        else {
            return false;
        }
    }
}

function getValue(obj, key) {
    for(var k in obj){
        if (k === key){
            return obj[k];
        }
        if(obj[k] instanceof Object) {
            if (k != "metadata"){
                var newVal = getValue(obj[k], key)
                if (newVal != "undefined"){
                    return newVal;
                }
            }
        }
    }
    return "undefined";
}

function replaceKey(obj, key, replaceString) {
    for(var k in obj){
        if (k === key){
            obj[k] = JSON.parse(replaceString);
            return;
        }
        if(obj[k] instanceof Object) {
            if (k !== "metadata"){
                return replaceKey(obj[k], key, replaceString);
            }
        }
    }
    console.log("err while replacing");
}

function addPoints(nr, points, maximum){
    if (points > maximum){
        console.log("Points must be smaller equals max points");
        return;
    }

    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            let json = req.responseText;
            let obj = JSON.parse(json);

            if (returnsError(obj)){
                console.log("error");
                return;
            }

            let entries = getValue(obj,"entries");
            let entry = entries[nr];

            let values = JSON.stringify(getValue(entry, "values"));
            let maxvalues = JSON.stringify(getValue(entry, "max_values"));
            if (values === "[]")
                values = "[" + points + "]";
            else
                values = values.substring(0,values.length-1) + "," + points + "]";

            if (maxvalues === "[]")
                maxvalues = "[" + maximum + "]";
            else
                maxvalues = maxvalues.substring(0,maxvalues.length-1) + "," + maximum + "]";

            let titel = getValue(entry, "titel");
            let required = getValue(entry, "requiredpercentage");
            entries[nr] = JSON.parse(`{"titel":${JSON.stringify(titel)},"requiredpercentage":${JSON.stringify(required)},"max_values":${maxvalues},"values":${values}}`);
            replaceKey(obj,"entries",JSON.stringify(entries));

            let record = getValue(obj,"record");
            setJSON(JSON.stringify(record));
        }
    };
    req.open("GET", binurl + "/latest", true);
    req.setRequestHeader("X-Master-Key", apikey);
    req.send();
}