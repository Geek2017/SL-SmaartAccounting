$('#login-form').on('submit', function(e) {
    e.preventDefault();


    if ($('#email').val() != '' && $('#password').val() != '') {
        //login the user
        var data = {
            email: $('#email').val(),
            password: $('#password').val()
        };
        firebase.auth().signInWithEmailAndPassword(data.email, data.password)
            .then(function(authData) {
                auth = authData;
                if (authData.emailVerified) {
                    window.location.replace("./");
                    console.log(authData);
                } else {
                    alert('email not verified, please check your email for confirmation');
                }
            })
            .catch(function(error) {
                console.log("Login Failed!", error.message);
                alert(error.message + ' Check your input');

            });
    }
});