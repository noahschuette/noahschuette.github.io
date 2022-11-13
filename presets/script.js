const pantryid = "f131829c-6c79-4bc7-8451-ef4bbe7cccac";

function load() {
    callApi("GET",`https://getpantry.cloud/apiv1/pantry/${pantryid}/basket/pixelart`,null,function() {
        console.log("loading main");
        if (this.status === 200) {
            replaceMain(JSON.parse(this.responseText));
        } else {
            console.error(`> Error ${this.status}: ${this.responseText}`);
        }
    });
}