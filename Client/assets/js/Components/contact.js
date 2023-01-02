/* SmtpJS.com - v3.0.0 */
var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

if (window.location.pathname === '/dashboard.html') {
    // Send text on contact area to email
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = JSON.parse(localStorage.getItem('user')).email;
        const message = document.getElementById('contact-message').value;

        Email.send({
            SecureToken: 'a70b3e5c-3409-4a97-9c84-55bd0f4773aa',
            To: 'projectmorty@gmail.com',
            From: 'projectmorty@gmail.com',
            Subject: `[Scores Project] Contact from ${email}`,
            Body: message
        }).then(
            message => alert(message)
        );
    });
}