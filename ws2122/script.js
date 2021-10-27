var binurl = "https://api.jsonbin.io/v3/b/615251b39548541c29b9a663";
var apikey = "$2b$10$xnvjY70FJ/3AkP6TgMxOYOpcTWr/12FGKcvzBP5znTq2JoAW5qJO2";

let jsonpart = `    <!--Task -->
    <p class="title">TO-DO</p>
    <div id="tasks" class="tasks">
      <div class="taskInput">
        <input id="titleInput" type="text" placeholder="New Task">
        <input id="dateInput" type="text" placeholder="DD/MM" maxlength="5">
        <button class="submit" onclick="addTask()"><i class="fas fa-arrow-right"></i></button>
      </div>
    </div>
    <!--Punkte-->
    <p class="title">Punktetabelle</p>
    <div class="points" id="points">
      <!--<div class="scala">
        <p class="scalaTitle">template</p>
        <p class="scalaPercentage">50%</p>
      </div>-->
    </div>
    <p class="title">Notizen</p>
    <!--Notes-->
    <div class="notes" id="notes">
      Fehler beim Laden der Notizen!
    </div>
  </section>`

function onloaded(){
    getNumberOfWeek();
}

function showJSONpart(){
    let rightpart = document.getElementById('rightPart');
    rightpart.innerHTML += jsonpart;

    readRequest(true);

    document.getElementById('showJSONpart').remove();
}

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
        return;
    }

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

    //TASK CHECK
    setTasks(getValue(obj,"tasks"));

    // NOTE CHECK
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
            localStorage['jsonbin'] = req.responseText;
            clear();
            checkJSON(JSON.parse(req.responseText));
        }
    };
    req.open("PUT", binurl, true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("X-Master-Key", apikey);
    req.send(string);
}

function clear(){
    document.getElementById('points').innerHTML = "";
    document.getElementById('tasks').innerHTML = "";
    document.getElementById('notes').innerHTML = "";
}

function returnsError(obj){
    for (var k in obj){
        if (k === "message"){
            alert('Error: Checking JSON failed');
            console.log("Error: Checking JSON failed");
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

/*function replaceKey(obj, key, replaceString) {
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
}*/

function replaceKey(obj, key, replaceString) {
    for(var k in obj){
        if (k === key){
            obj[k] = JSON.parse(replaceString);
            //console.log("replaced");
            return;
        }
        if(obj[k] instanceof Object) {
            if (k !== "metadata"){
                replaceKey(obj[k], key, replaceString);
            }
        }
    }
    //console.log("err while replacing");
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

function getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    const numOfweek = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)-1;
    document.getElementById("kw").innerHTML = "KW " + numOfweek;
}

function removeTask(nr){
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            let json = req.responseText;
            let obj = JSON.parse(json);

            if (returnsError(obj)){
                return;
            }

            let tasks = getValue(obj,"tasks");
            let task = tasks[nr];

            if (nr > -1) {
                tasks.splice(nr, 1);
            }

            replaceKey(obj,"tasks",JSON.stringify(tasks));
            let record = getValue(obj,"record");
            setJSON(JSON.stringify(record));
        }
    };
    req.open("GET", binurl + "/latest", true);
    req.setRequestHeader("X-Master-Key", apikey);
    req.send();
}

function addTask(){
    let title = document.getElementById("titleInput").value;
    if (title === "")
        return;

    let date = document.getElementById("dateInput").value;
    date = date.replace('.','/');
    let regex = /^[0-9]{1,2}\/[0-9]{1,2}$/
    let re = date.match(regex);
    if (re === null)
        return;

    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState === XMLHttpRequest.DONE) {
            let json = req.responseText;
            let obj = JSON.parse(json);

            if (returnsError(obj)){
                return;
            }

            let tasks = getValue(obj,"tasks");
            let newTask = `{"title":"${title}","date":"${date}"}`;

            let tString = JSON.stringify(tasks);
            if (tString === "[]")
                tString = "[" + newTask + "]";
            else
                tString = tString.substring(0,tString.length-1) + "," + newTask + "]";

            replaceKey(obj,"tasks",tString);
            let record = getValue(obj,"record");
            setJSON(JSON.stringify(record));
        }
    };
    req.open("GET", binurl + "/latest", true);
    req.setRequestHeader("X-Master-Key", apikey);
    req.send();
}

function setTasks(taskObj){
    let upper = document.getElementById("tasks");
    upper.innerHTML = "";
    let names = [];
    let dates = [];
    let now = Date.now();

    for (let k in taskObj){
        let title = getValue(taskObj[k],"title");
        let rawdate = getValue(taskObj[k],"date");
        let day = rawdate.split('/')[0];
        let month = rawdate.split('/')[1];
        let date = new Date();
        if (month < new Date().getMonth())
            date.setFullYear(date.getFullYear()+1);
        date.setMonth(month-1);
        date.setDate(day);

        let inserted = false;

        let maintime = Math.ceil(Math.abs(now - date.getTime()) / (1000 * 60 * 60 * 24));

        for (let j in names){

            let temptime = Math.ceil(Math.abs(now - dates[j].getTime()) / (1000 * 60 * 60 * 24));
            if (maintime > temptime){
                if (j === 0){
                    names.push(title);
                    dates.push(date);
                } else {
                    names.splice(j, 0, title);
                    dates.splice(j, 0, date);
                }
                inserted = true;
                break;
            }
        }
        if (!inserted){
            names.push(title);
            dates.push(date);
        }
    }

    for (let i= (names.length-1); i >= 0; i--){
        let title = names[i];
        let date = dates[i];
        let day = date.getDate();
        let month = date.getMonth()+1;

        if (day.length === 1)
            day = '0' + day;
        if (month.length === 1)
            month = '0' + month;

        let datediff = Math.ceil(Math.ceil(now - date.getTime()) / (1000 * 60 * 60 * 24));

        let added = "";
        if (datediff <= 0)
            added = `<div id="task${i}" class="task"><button onclick="removeTask(${i})"><i class="fas fa-check"></i></button><p class="taskTitle">${title}</p><p class="taskDate">${day}.${month}.</p></div>`;
        else
            added = `<div id="task${i}" class="task outdated"><button onclick="removeTask(${i})"><i class="fas fa-check"></i></button><p class="taskTitle">${title}</p><p class="taskDate outdatedDate">${day}.${month}. - Seit ${datediff} Tagen überfällig</p></div>`;
        upper.innerHTML += added;
    }

    if (JSON.stringify(taskObj) === "[]")
        upper.innerHTML += '<p class="noTasks">Wir haben alles erledigt :)</p>';

    upper.innerHTML += `<div class="taskInput">
        <input id="titleInput" type="text" placeholder="New Task">
        <input id="dateInput" type="text" placeholder="DD/MM" maxlength="5">
        <button class="submit" onclick="addTask()"><i class="fas fa-arrow-right"></i></button>
      </div>`;
}