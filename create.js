const pantryid = "f131829c-6c79-4bc7-8451-ef4bbe7cccac";

function main() {
    if (document.getElementById("password").value !== "yandhi")
        return;

    document.getElementById("passwd").style.display = "none";
    document.getElementById("main").style.display = "block";

    callApi("GET",`https://getpantry.cloud/apiv1/pantry/${pantryid}/basket/main`,null,function() {
        if (this.status === 200) {
            document.getElementById("text").innerHTML = JSON.stringify(JSON.parse(this.responseText));
        } else {
            alert(`Error ${this.status}: ${this.responseText}`);
        }
    });

}

function save() {
    const string = document.getElementById("text").value;
    console.log(string);
    callApi("POST",`https://getpantry.cloud/apiv1/pantry/${pantryid}/basket/main`,string,function() {
        if (this.status === 200) {
            alert("Saved");
        } else {
            alert(`Error ${this.status}: ${this.responseText}`);
        }
    });
}

function callApi(method, url, body, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
    xhr.onload = callback;
}