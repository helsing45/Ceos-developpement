var projects = []
$.getJSON("./assets/porfolio/projects.json", function (data) {
    projects = data
})

$(".app-icon").on('click', function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    //(... rest of your JS code)
    const project = projects.find(element => element.id == event.target.id);
    displayProject(project);
});

$(".porfolio-back").on('click', function (event) {
    displayMainScreen()
});

function displayProject(project) {
    $(".app-icon").toggleClass("hidden")
    $(".porfolio-back").toggleClass("hidden")
    $("#project-title").text(project.title)
    $("#project-mandat").text(project.objectif)
    $("#phone-screen").attr("src", project.landingImagePath)
    $(".project-tags").empty()
    project.tags.forEach(tag => {
        $(".project-tags").append('<span class="project-tag">' + tag + '</span>')
    });

}

function displayMainScreen() {
    $(".app-icon").toggleClass("hidden")
    $(".porfolio-back").toggleClass("hidden")
    $("#project-title").text("Nos réalisations")
    $("#project-mandat").text("Jetez un coup d'oeil à quelques-unes de nos réalisations. Après 10 ans à développer des applications android, nous avons appris que le respect de la vision de nos clients est primordial : notre approche consiste à travailler en étroite collaboration avec nos clients afin de transformer leurs connaissances et leurs expertises en une expérience numérique.")
    $(".project-tags").empty()
    $("#phone-screen").attr("src", "res/images/app/phone-main.png")
}