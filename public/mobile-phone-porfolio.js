var projects = [];
var easterEggs = [];
$.getJSON("assets/porfolio/projects.json", function (data) {
    projects = data
})
$.getJSON("assets/porfolio/easter-eggs.json", function (data) {
    easterEggs = data
})

$(".app-icon").on('click', function (event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    //(... rest of your JS code)
    const project = projects.find(element => element.id == event.target.id);
    if (project != null) {
        displayProject(project);
    }
    const easterEgg = easterEggs.find(element => element.id == event.target.id)
    if (easterEgg != null) {

        $(".app-icon").toggleClass("hidden")
        $(".porfolio-back").toggleClass("hidden")
        displayEasterEgg(easterEgg)
    }
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
function displayEasterEgg(easterEgg) {
    if (easterEgg.routes != null)
        for (let index = 0; index < easterEgg.routes.length; index++) {
            const route = easterEgg.routes[index];
            displayRoute(route, () => {

                $(".mock-container").find('.app-action').remove()

                displayEasterEgg(easterEgg)
            })

        }

    $("#phone-screen").attr("src", easterEgg.screenImagePath)
}

function displayRoute(route, onBackPress) {
    $(".mock-container").append(`<div id="${route.id}" class="${route.class}"></div>`)
    $(`#${route.id}`).on('click', function (event) {
        $(".mock-container").find('.app-action').remove()
        $("#phone-screen").attr("src", route.screenImagePath)
        $(".mock-container").append(`<div class="app-action back"></div>`)
        $(".app-action.back").on('click', function (event) {
            onBackPress()
        });
    });
}

function displayMainScreen() {
    $(".app-icon").toggleClass("hidden")
    $(".porfolio-back").toggleClass("hidden")
    $("#project-title").text("Nos réalisations")
    $("#project-mandat").text("Jetez un coup d'oeil à quelques-unes de nos réalisations. Après 10 ans à développer des applications android, nous avons appris que le respect de la vision de nos clients est primordial : notre approche consiste à travailler en étroite collaboration avec nos clients afin de transformer leurs connaissances et leurs expertises en une expérience numérique.")
    $(".project-tags").empty()
    $(".app-action").remove()
    $("#phone-screen").attr("src", "res/images/app/phone-main.png")
}