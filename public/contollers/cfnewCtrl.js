angular.module('newApp').controller('cfnewCtrl', function($scope) {
    pageSetUp();

    $scope.tojson = function() {

        var table = $('#convert-table').tableToJSON({

            extractor: function(cellIndex, $cell) {
                return $cell.find('input').val() || $cell.find("#type option:selected").text();
            }

        })

        alert(JSON.stringify(table));
    }

    $('#newcf').on('submit', function(e) {

        e.preventDefault();

        $scope.tojson();

        var uid = firebase.database().ref().child('cash_flow').push().key;
        var orno = "24910";

        var obj = [{
            "Amount": 100.00,
            "Particulars": "General Weighted Average",
            "Remarks": "none",
            "Type": "Credentials"
        }, {
            "Amount": 20.00,
            "Particulars": "Documentary Stamp",
            "Remarks": "none",
            "Type": "Credentials"
        }]

        $('#OR_no').val();

        var data = {
            name: "JPG",
            course: "BSIT",
            OR: {
                [orno]: obj
            }
        }

        var updates = {};
        updates['/cash_flow/' + uid] = data;
        firebase.database().ref().update(updates);
        console.log(updates)

    });
});