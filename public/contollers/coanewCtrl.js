angular.module('newApp').controller('coanewCtrl', function($scope) {
    pageSetUp();

    $('#newcoa').on('submit', function(e) {
        e.preventDefault();
        var uid = firebase.database().ref().child('chart_of_accounts').push().key;
        var ssc;
        if (!$('#ssc').val()) {
            ssc = 'n/a'
        } else {
            ssc = $('#ssc').val();
        }

        var data = {
            code: $('#code').val(),
            categories: $("#type option:selected").text(),
            type: $("#type option:selected").text(),
            p_subcode: $('#psc').val(),
            s_subcode: ssc,
            name: $('#name').val()
        }



        var updates = {};
        updates['/chart_of_accounts/' + uid] = data;
        firebase.database().ref().update(updates);
        console.log(updates)
        if (updates) {


            $("#notif").append('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Success</strong> Data had been save!.</div>');
            setTimeout(function() {
                window.location.href = "#coalist"
                window.location.href = "#coanew"
            }, 1500);
        } else {
            $("#notif").append('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Error</strong> Check your Input !</div>');
        }



    });

});