let prev = ""
let charPos = 0;
let obj = document.getElementById("lowerMoney");
let defaultstyle = obj.style.color;

let budget = 0;
let previousBudget = 0;
let date = "";
let list = "";

let samplejson = `{
    "budget" : -4.20,
    "date" : "2021/08/23",
    "dayToReset": 1,
    "previousBudget" : 0,
    "list" : [
        {
            "nr" : 1,
            "cost" : 4.50,
            "name" : "Krispy"
        }
    ]
}`

/*
function checkMoneyInput(){
    let input = obj.value;
    if (input === prev)
        return;
    let last = input.charAt(input.length-1);
    if (last === '-') {
        if (prev.charAt(0) === '-')
            prev = prev.substring(1, prev.length);
        else
            prev = '-' + prev;
        obj.value = prev;
        return;
    }
    let temp = false;
    if (prev[0] === '-'){
        prev = prev.split('-')[1];
        temp = true;
    }

    if (input < prev){
        charPos--;
        switch(charPos){
            case 0: prev = "0.00"; break;
            case 1: prev = "0.0"+prev.charAt(prev.length-2); break;
            case 2: prev = "0."+prev.charAt(prev.length-4)+prev.charAt(prev.length-2); break;
            default: prev = prev.substring(0,prev.length-4)+"."+prev.charAt(prev.length-4)+prev.charAt(prev.length-2); break;
        }
    } else {
        if (!isNaN(last)){
            charPos++;
            switch(charPos){
                case 0: prev = "0.00"; break;
                case 1: prev = "0.0"+last; break;
                case 2: prev = "0."+prev.charAt(prev.length-1)+last; break;
                case 3: prev = prev.charAt(prev.length-2)+"."+prev.charAt(prev.length-1)+last; break;
                default: prev = prev.substring(0,prev.length-3)+prev.charAt(prev.length-2)+"."+prev.charAt(prev.length-1)+last; break;
            }
        }
    }

    if (temp)
        prev = '-'+prev;
    obj.value = prev;
}
*/

function checkMoneyInput(){
    let input = obj.value;
    let last = input.charAt(input.length-1);
    if (last === ",")
        obj.value = input.substring(0,input.length-1)+".";
    if (last === "0" && input.substring(0,input.length-1) === "")
        obj.value = "";
    if (isNaN(input))
        obj.style.color = "var(--red1)";
    else
        obj.style.color = defaultstyle;
}

function test(){
    loadJSON(JSON.parse(samplejson));
}

function loadJSON(obj){
    budget = getValue(obj,"budget");
    date = getValue(obj,"date");
    let dayToReset = getValue(obj,"dayToReset");
    previousBudget = getValue(obj,"previousBudget");
    list = getValue(obj, "list");

    setBudget(budget);
    setPrevious(previousBudget);

    checkDate(dayToReset);

}

function checkDate(dayToReset){
    let currentDate = new Date();
    currentDate.setHours(0);
    let lastDate = new Date(date);
    let changeDate;
    if (lastDate.getMonth() === 12)
        changeDate = new Date(lastDate.getFullYear()+1,1,dayToReset);
    else
        changeDate = new Date(lastDate.getFullYear(),lastDate.getMonth()+1,dayToReset);
    console.log(changeDate + "," + currentDate);
    const oneDay = 24 * 60 * 60 * 1000;
    let diff = -Math.round((currentDate - changeDate) / oneDay);
    console.log("diff: " + diff);

    date = currentDate;

    //TODO set diff date;

    if (diff <= 0)
        resetMonth();
}

function resetMonth(){
    setPrevious(previousBudget+budget);
    setBudget(0);
}

function setBudget(newbudget){
    budget = newbudget;
    document.getElementById("budget").innerHTML = newbudget.toFixed(2) + "€";
    if (budget <= 0)
        document.getElementById("upper").style.backgroundColor = "var(--red0)";
    else
        document.getElementById("upper").style.backgroundColor = "var(--green0)";
}

function setPrevious(newPrevious){
    previousBudget = newPrevious;
    let temp = document.getElementById("previousBudget");
    temp.innerHTML = previousBudget.toFixed(2) + "€";
    if (previousBudget === 0)
        temp.style.color = "var(--text2)";
    else if (previousBudget < 0)
        temp.style.color = "var(--red1)";
    else
        temp.style.color = "var(--green1)";

}

function getValue(obj, key) {
    for(let k in obj){
        if (k === key){
            return obj[k];
        }
        if(obj[k] instanceof Object) {
            let newVal = getValue(obj[k], key)
            if (newVal !== "undefined"){
                return newVal;
            }
        }
    }
    return "undefined";
}