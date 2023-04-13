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
    </div>
    <!--Tests-->
    <!--<p class="title">Klausurtermine</p>
    <div class="tests" id="tests"></div>-->
    <!--Notes-->
    <p class="title">Notizen <button id="notesBtn" onclick="showNotes()">ANZEIGEN</button></p>
    <div class="notes" id="notes">
      Fehler beim Laden der Notizen!
    </div>`

function onloaded(){
    getNumberOfWeek();
    switchToDefaultPlan();
}

function showJSONpart(){
    let rightpart = document.getElementById('rightPart');
    rightpart.innerHTML += jsonpart;
    readRequest(true);
    showNotes(); //Hiding notes
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

        let scala = "";
        //pointsObj.innerHTML += `<div class="scala" id="scala${count}"> <p class="scalaTitle">${title}</p> <p class="scalaPercentage">${(percentage*100).toFixed(0)}%</p> </div>`;
        scala += `<div class="scala"><div class="scalaMain" id="scala${count}"><p class="scalaTitle" onclick="extendPoints(${count})">${title}</p><p class="scalaPercentage">${(percentage*100).toFixed(0)}%</p></div>
        <div class="scalaSub" id="scalaSub${count}">`;
        for (let m in values){
            scala += `<p class="scalaPoints">${values[m]}/${maxvalues[m]}</p>`;
        }
        scala += `<p class="scalaPoints"><b>${valSum}/${maxSum}</b></p>`;

        scala += `<div class="taskInput">
            <input id="scalaPointInput${count}" class="scalaInput" type="text" placeholder="Punkte" maxlength="3">
            <input id="scalaMaxInput${count}" class="scalaInput" type="text" placeholder="Max" maxlength="3">
            <button class="submit" onclick="addPointsViaFun(${count})"><i class="fas fa-plus"></i></button>
            </div>`
        pointsObj.innerHTML += scala;

        scala += "</div></div>";

        let tempScala = document.getElementById(`scala${count}`);
        if (required <= percentage){
            tempScala.style.backgroundImage = `linear-gradient(to right, var(--ok) 0%, var(--ok) ${percentage*100}%, var(--mid) ${percentage*100+0.1}%)`
        } else {
            tempScala.style.backgroundImage = `linear-gradient(to right, var(--notok2) 0%, var(--notok2) ${percentage*100}%, var(--notok) ${percentage*100+0.1}%, var(--notok) ${required*100}%, var(--mid) ${required*100+0.1}%)`
        }
        extendPoints(count);
        count++;
    }

    //TESTS CHECK
    /*
    let tests = getValue(obj,"tests");

    let testsObj = document.getElementById("tests");

    let fachCol = `<div class="testsColumn"><p class="testsHeader">Fach</p>`;
    let firstCol = `<div class="testsColumn"><p class="testsHeader">Erstklausur</p>`;
    let sndCol = `<div class="testsColumn"><p class="testsHeader">Zweitklausur</p>`;

    for (let i in tests){
        fachCol += `<p>${getValue(tests[i],"title")}</p>`;
        firstCol += `<p>${getValue(tests[i],"first")}</p>`;
        sndCol += `<p>${getValue(tests[i],"second")}</p>`;
    }

    fachCol += `</div>`; firstCol += `</div>`; sndCol += `</div>`;

    testsObj.innerHTML = fachCol + firstCol + sndCol;
    */
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
    if (string === ""){
        console.log("empty string!");
        return;
    }

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

function addPointsViaFun(nr) {
    let pointScala = document.getElementById("scalaPointInput" + nr).value;
    let maxScala = document.getElementById("scalaMaxInput" + nr).value;
    addPoints(nr,pointScala,maxScala);
}

function addPoints(nr, points, maximum){

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
    date = date.replace(',','/');
    date = date.replace('.','/');
    let regex = /^[0-9]{1,2}\/[0-9]{1,2}$/
    let re = date.match(regex);
    if (re === null)
        return;

    if (date.split('/')[1] < new Date().getMonth()+1)
        date += '/' + (new Date().getFullYear()+1);
    else
        date += '/' + new Date().getFullYear();

    //console.log(date);

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
    let years = [];
    let months = [];
    let days = [];
    let tasknr = [];
    let now = new Date();
    now.setHours(0,0,0,0);

    for (let k in taskObj){
        let title = getValue(taskObj[k],"title");
        let rawdate = getValue(taskObj[k],"date");
        let splitted = rawdate.split('/');
        let day = parseInt(splitted[0]);
        let month = parseInt(splitted[1]);
        let year = new Date().getFullYear();
        if (splitted.length === 3)
            year = parseInt(splitted[2]);

        //console.log(`>> ${title}, ${day},${month},${year}`);

        let inserted = false;
        for (let j in names){
            //console.log(`${year}:${years[j]}, ${month}:${months[j]}, ${day}:${parseInt(days[j])}`);
            if (year < years[j] || year === years[j] && month < months[j] || year === years[j] && month === months[j] && day < days[j]){
                //console.log("> adding before " + names[j]);
                names.splice(j, 0, title);
                days.splice(j, 0, day);
                months.splice(j, 0, month);
                years.splice(j, 0, year);
                tasknr.splice(j, 0, k);
                inserted = true;
                break;
            }
        }
        if (!inserted){
            names.push(title);
            days.push(day);
            months.push(month);
            years.push(year);
            tasknr.push(k);
        }
    }

    for (let i in names){
        let title = names[i];
        //console.log("new" + title);
        let year = years[i];
        let month = months[i];
        let day = days[i];

        if (day.length === 1)
            day = '0' + day.toString();
        if (month.length === 1)
            month = '0' + month.toString();

        let datediff = calcDateDiff(now, new Date(year,month-1,day,0,0,0,0));

        let added = "";
        if (datediff <= 0)
            added = `<div id="task${tasknr[i]}" class="task"><button onclick="removeTask(${tasknr[i]})"><i class="fas fa-check"></i></button><p class="taskTitle">${title}</p><p class="taskDate">${day}.${month}.${year}</p></div>`;
        else
            added = `<div id="task${tasknr[i]}" class="task outdated"><button onclick="removeTask(${tasknr[i]})"><i class="fas fa-check"></i></button><p class="taskTitle">${title}</p><p class="taskDate outdatedDate">${day}.${month}.${year} - Seit ${datediff} Tagen überfällig</p></div>`;
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

function calcDateDiff(date1, date2){
    return Math.ceil(Math.ceil(date1 - date2) / (1000 * 60 * 60 * 24));
}

let notesActive = true;
function showNotes(){
    if (notesActive){
        document.getElementById('notes').style.display = "none";
        document.getElementById('notesBtn').innerHTML = "ANZEIGEN";
    } else {
        document.getElementById('notes').style.display = "block";
        document.getElementById('notesBtn').innerHTML = "AUSBLENDEN";
    }
    notesActive = !notesActive;
}

function extendPoints(number) {
    const extendedPart = document.getElementById('scalaSub'+number);
    if (extendedPart.style.display === "none") {
        extendedPart.style.display = "flex";
    } else {
        extendedPart.style.display = "none";
    }
}

function switchToDefaultPlan() {
    let name = localStorage.getItem('userName');
    if (name === undefined)
        name = "manonoah";
    switchPlan(name);
}

function switchPlan(name) {
    const manonoahBtn = document.getElementById("manonoahBtn");
    const manuBtn = document.getElementById("manuBtn");
    localStorage.setItem('userName',name);
    let itemsToShow;
    let itemsToHide;
    if (name === "manonoah") {
        itemsToShow = document.getElementsByClassName("manonoah");
        itemsToHide = document.getElementsByClassName("manu");
        manonoahBtn.style.background = "var(--white)";
        manonoahBtn.style.color = "var(--dark)";
        manuBtn.style.background = "var(--mid)"
        manuBtn.style.color = "var(--light)"
    } else {
        itemsToHide = document.getElementsByClassName("manonoah");
        itemsToShow = document.getElementsByClassName("manu");
        manuBtn.style.background = "var(--white)";
        manuBtn.style.color = "var(--dark)";
        manonoahBtn.style.background = "var(--mid)"
        manonoahBtn.style.color = "var(--light)"
    }
    for (let m = 0; m < itemsToShow.length; m++) {
        console.log(m, itemsToShow[m]);
        itemsToShow[m].style.display = "flex";
    }
    for (let m = 0; m < itemsToHide.length; m++) {
        console.log(m, itemsToHide[m]);
        itemsToHide[m].style.display = "none";
    }
}

function getNumberOfWeek() {
    let date = new Date();
    let currentThursday = new Date(date.getTime() +(3-((date.getDay()+6) % 7)) * 86400000);
    let yearOfThursday = currentThursday.getFullYear();
    let firstThursday = new Date(new Date(yearOfThursday,0,4).getTime() +(3-((new Date(yearOfThursday,0,4).getDay()+6) % 7)) * 86400000);
    let weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000/7);
    document.getElementById("kw").innerHTML = `KW ${weekNumber} (#${weekNumber-13})`;
    //setCorrectWeek(weekNumber);
}

function setCorrectWeek(weekNr) {
    const evenWeek = weekNr % 2 === 0;
    const evenItems = document.getElementsByClassName("weekEven");
    const oddItems = document.getElementsByClassName("weekOdd");
    console.log(oddItems);
    if (evenItems.length !== 0)
        for (let k in evenItems) {
            if (evenWeek) {
                evenItems[k].innerHTML = "DIESE WOCHE";
                evenItems[k].style.color = "#3E8948";
            } else {
                evenItems[k].innerHTML = "NICHT DIESE WOCHE";
                evenItems[k].style.color = "#E74C3C";
            }
        }
    for (let j in oddItems) {
        if (!evenWeek) {
            oddItems[j].innerHTML = "DIESE WOCHE";
            oddItems[j].style.color = "#3E8948";
        } else {
            oddItems[j].innerHTML = "NICHT DIESE WOCHE";
            oddItems[j].style.color = "#E74C3C";
        }
    }
}