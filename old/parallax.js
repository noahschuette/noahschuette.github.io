let scene = document.getElementById('scene');
let parallaxInstance = new Parallax(scene);

/*
window.onload = setTimeout(function blendOut(){
    let blend = document.getElementById("blendIn");
    var fadeEffect = setInterval(function () {
        if (!blend.style.opacity) {
            blend.style.opacity = 1;
        }
        if (blend.style.opacity > 0) {
            blend.style.opacity -= 0.02;
        } else {
            clearInterval(fadeEffect);
            blend.style.display = "none";
            document.body.style.overflowY = "scroll";
        }
    }, 20);
}, 100);
*/