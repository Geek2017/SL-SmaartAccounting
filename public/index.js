$(document).ready(function() {
    firebase.auth().onAuthStateChanged(function(user) {

        if (!user) {
            window.location.href = './login.html';
        } else {
            if (!user.emailVerified) {
                window.location.href = './login.html';
            }
        }
        var user = firebase.auth().currentUser;
        console.log(user)

        $('#displayname').text(user.displayName);
    })
})