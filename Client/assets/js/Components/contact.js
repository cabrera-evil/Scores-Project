/* SmtpJS.com - v3.0.0 */
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

if (window.location.pathname === '/dashboard.html') {
    // Send text on contact area to email
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = JSON.parse(localStorage.getItem('user')).name;
        const email = JSON.parse(localStorage.getItem('user')).email;
        const message = document.getElementById('contact-message').value;
        const data = {
            name,
            email,
            message
        }
        Email.send({
            SecureToken: "36e15eb1-d767-43a9-a53b-dc34d315716f",
            To: 'projectmorty@gmail.com',
            From: email,
            Subject: `[Scores Project] Contact from ${name}`,
            Body: message
        }).then(
            message => alert(message)
        );
    });
}