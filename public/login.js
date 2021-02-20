$('#login-form').on('submit', function(e) {
    e.preventDefault();
    FirebaseAuth.getInstance().signOut();
});