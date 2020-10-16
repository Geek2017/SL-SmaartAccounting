angular.module('newApp').controller('cfnewCtrl', function($scope) {
    pageSetUp();
    var obj;
    $scope.tojson = function(obj) {

        var table = $('#convert-table').tableToJSON({

            extractor: function(cellIndex, $cell) {
                return $cell.find('input').val() || $cell.find("#type option:selected").text();
            }


        })
        return table;

    }

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var datetoday = month + ":" + day + ":" + year;

    $('#newcf').on('submit', function(e) {
        $scope.tojson();

        e.preventDefault();

        console.log($scope.tojson(obj))

        var newobj = $scope.tojson(obj);
        // [$scope.tojson(obj)];

        var uid = firebase.database().ref().child('chart_of_accounts').push().key;
        var orno = $scope.ornum;



        const [, ...rest] = newobj.reverse();
        const withoutLast = rest.reverse();
        console.log(withoutLast)
        var data = {
            [datetoday]: {
                name: $scope.Lname + "," + $scope.Fname,
                course: $scope.course_yr,
                OR: {
                    [orno]: withoutLast
                }
            }
        }

        var updates = {};
        updates['/cash_flow/' + uid] = data;
        firebase.database().ref().update(updates);
        console.log(updates)

    });
});