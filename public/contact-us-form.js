
$(".formcarry-form").on('sumbit', function (e) {
    e.preventDefault();
    sendEmail();
})

async function sendEmail() {
    console.log("Sending email");

    // Email.send({
    //     SecureToken: "5fbec6d3-9bb1-4b29-ab35-45052cfa6551",
    //     To: 'jean.christophe.decary.ceos@gmail.com',
    //     From: "jean.christophe.decary.ceos@gmail.com",
    //     Subject: "This is the subject",
    //     Body: "And this is the body"
    // }).then(
    //     message => alert(message)
    // );
}