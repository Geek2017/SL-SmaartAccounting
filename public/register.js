$('#register').on('submit', function(e) {
    e.preventDefault();

    var data = {
        email: $('#email').val()

    };
    var passwords = {
        password: $('#password').val(), //get the pass from Form
        cPassword: $('#passwordConfirm').val(), //get the confirmPass from Form
    }

    if (data.email != '' && passwords.password != '' && passwords.cPassword != '') {
        if (passwords.password == passwords.cPassword) {
            //create the user

            firebase.auth()
                .createUserWithEmailAndPassword(data.email, passwords.password)
                .then(function(user) {

                    if (user) {
                        user.updateProfile({
                            displayName: $('#firstname').val() + ':' + $('#lastname').val(),
                            photoURL: ""
                        })
                        setTimeout(function() {
                            window.location.replace("./login.html");
                        }, 2000);
                    }

                    sendEmailVerification(data);


                    var email = $('#email').val();

                    function sendEmailVerification(data) {
                        email = data.email || user.email;
                        var urlr = location.origin;

                        return user.emailVerified || user.sendEmailVerification({
                            url: urlr,
                        });

                    }



                }).catch(function(error) {
                    console.log("Registration Failed!", error.message);
                    alert(error.message + ' Check your input');

                });


        }
    }
});