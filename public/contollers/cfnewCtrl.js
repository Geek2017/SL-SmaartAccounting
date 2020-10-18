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
            date: datetoday,
            name: $scope.Lname + "," + $scope.Fname,
            course: $scope.course_yr,
            ornumber: orno,
            transaction: withoutLast,
            total: $('#sum').text()
        }

        var updates = {};
        updates['/cash_flows/' + uid] = data;
        firebase.database().ref().update(updates);
        console.log(updates)

        if (updates) {


            $("#notif").append('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Success</strong> Data had been save!.</div>');
            setTimeout(function() {
                window.location.href = "#/"
                window.location.href = "#cfnew"
            }, 1500);
        } else {
            $("#notif").append('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Error</strong> Check your Input !</div>');
        }

    });
    var cnt = 0;
    $scope.addtr = function() {
        $("#appendhere").append('<tr><td> <label class="input"><input type="text" name="particulars" ></label></td><td><select name="interested " id="type" required class="form-control btn-block"><option value="0 "  disabled=" ">Select</option><option value="1" selected="true">Miscellaneous Fee</option><option value="2">Tuition Fee</option><option value="3">Laboratory/Workshop Fee</option><option value="4">Uniforms</option><option value="5">Logo</option><option value="6">Credentials</option><option value="7">Others</option></select></td><td><label class="input"> <input type="text" name="remarks" placeholder="Remarks"></label></td></td><td class="col-md-2"><label class="input col-md-10"><input type="text" name="amount" value="" class="txt" autocomplete="off" required/></label><label class="input col-md-1"><button class="btn btn-danger btn-sm deleteb">X</button></label></td></tr>');
        cnt++;
        $('table thead th').each(function(i) {

        });

    }
    $scope.removetr = function() {

        $('#appendhere tr:last').remove();
        $('table thead th').each(function(i) {

        });
        calculateSum();
    }

    $("#appendhere").on('click', '.deleteb', function() {
        $(this).closest("tr").remove();
        $('table thead th').each(function(i) {

        });
        calculateSum();
    });


    function calculateSum() {
        var sum = 0;
        //iterate through each textboxes and add the values
        $(".txt").each(function() {

            //add only if the value is number
            if (!isNaN(this.value) && this.value.length != 0) {
                sum += parseFloat(this.value);
            }

        });
        //.toFixed() method will roundoff the final sum to 2 decimal places
        $("#sum").html(sum.toFixed(2));
        console.log(sum.toFixed(2));
    }

    $("#convert-table").on("keyup", ".txt", function() {
        calculateSum();
    });





});