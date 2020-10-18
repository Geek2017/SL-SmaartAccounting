angular.module('newApp').controller('crnewCtrl', function($scope, $timeout) {
    pageSetUp();


    $('#newcr').on('submit', function(e) {
        e.preventDefault();
        var uid = firebase.database().ref().child('cash_receipts').push().key;

        var data = {
            date: $('.datepicker').val(),
            cash: $(".cash").val(),
            cheque: $(".cheque").val(),
            total: $('.total').val(),
            description: $('.description').val(),
            remarks: $('.remarks').val()
        }



        var updates = {};
        updates['/cash_receipts/' + uid] = data;
        firebase.database().ref().update(updates);
        console.log(updates)
        if (updates) {
            $("#notif").append('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Success</strong> Data had been save!.</div>');
            setTimeout(function() {
                window.location.href = "#"
                window.location.href = "#crnew"
            }, 2000);
        } else {
            $("#notif").append('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Error</strong> Check your Input !</div>');
        }



    });

});