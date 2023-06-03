
$(".formcarry-form").on('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const message = document.getElementById("message").value;

    Email.send({
        SecureToken: "5fbec6d3-9bb1-4b29-ab35-45052cfa6551",
        To: 'jean.christophe.decary.ceos@gmail.com',
        From: 'jean.christophe.decary.ceos@gmail.com',
        Subject: `Client potentiel: ${name}`,
        Body: `${message} \n \n ${email}`
    }).then(message => {
        if (message = "OK") {
            document.getElementById("email").value = "";
            document.getElementById("name").value = "";
            document.getElementById("message").value = "";
            $(".modal").toggleClass("hidden")
            $(".overlay").toggleClass("hidden")
        }
    }
    );
})

$(".closes-modal").on('click', function (e) {
    $(".modal").toggleClass("hidden")
    $(".overlay").toggleClass("hidden")

})