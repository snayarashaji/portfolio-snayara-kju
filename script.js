function scrollToContact() {
    document.getElementById("contact").scrollIntoView({
        behavior: "smooth"
    });
}

function sendMessage() {
    document.getElementById("success").innerText = "Message Sent Successfully!";
    return false;
}