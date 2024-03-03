//let scene = document.getElementById('scene');
//let parallaxInstance = new Parallax(scene);

window.addEventListener('resize', generateParallax);

window.parallax = function() {
    generateParallax();
}

let width = window.document.body.scrollWidth;
let height = window.document.body.scrollHeight;

function generateParallax() {

    let scene = document.getElementById('scene');
    scene.innerHTML = "";

    width = window.innerWidth;
    height = window.document.body.scrollHeight;

    // <img src="error/space2.png" data-depth='0.3' class="paramimg" id="img-2"/>

    
    console.log(width, height);
    const scale = Math.sqrt(width * height); // 1440

    const path = "images/space/"
    const image_pool = [
        {"name" : "tiny", "length" : 4, "data-depth" : 0.01, "zIndex" : -10, "amount" : scale / 4},
        {"name" : "small", "length" : 3, "data-depth" : 0.05, "zIndex" : -11, "amount" : scale / 32},
        {"name" : "large", "length" : 4, "data-depth" : 0.1, "zIndex" : -12, "amount" : 5},
    ];

    let count = 0;
    for (let k in image_pool) {
        for (let i = 0; i < image_pool[k].amount; i++) {
            let img = document.createElement("img");
            img.src = path + image_pool[k].name + Math.floor(Math.random() * image_pool[k].length) + ".png";
            img.setAttribute("data-depth", image_pool[k]["data-depth"]);
            img.classList.add("paramimg");
            img.style.top = Math.floor(Math.random() * height) + "px";
            img.style.left = Math.floor(Math.random() * width) + "px";
            img.setAttribute("data-top", img.style.top);
            img.setAttribute("data-left", img.style.left);
            scene.appendChild(img);
            img.style.zIndex = image_pool[k].zIndex;
            img.style.transorm = `rotate("${Math.floor(Math.random() * 360)}deg)`;
            img.id = "img-" + count;
            count++;
        }
    }

    //let parallaxInstance = new Parallax(scene);
}

//window.addEventListener('mousemove', mouseMove);

function mouseMove(event) {
    console.log(event.movementX, event.movementY);
    let scene = document.getElementById('scene');
    for (let i = 0; i < scene.children.length; i++) {
        let img = scene.children[i];
        const top = img.getAttribute("data-top").replace("px", "");
        const left = img.getAttribute("data-left").replace("px", "");

        let new_top = (parseInt(top) + event.movementY * img.getAttribute("data-depth"));
        let new_left = (parseInt(left) + event.movementX * img.getAttribute("data-depth"));

        /*if (new_top < 50) {
            new_top = height - new_top ;
        }

        if (new_left < 50) {
            new_left = width - new_left;
        }*/

        img.style.top = new_top + "px";
        img.style.left = new_left + "px";
        img.setAttribute("data-top", img.style.top);
        img.setAttribute("data-left", img.style.left);
        //img.style.transform = 'translate(' + event.movementX * img.getAttribute("data-depth") + 'px,' + event.movementY * img.getAttribute("data-depth") + 'px)';
    }
}