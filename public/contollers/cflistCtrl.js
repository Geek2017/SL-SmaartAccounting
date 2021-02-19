angular.module('newApp').controller('cflistCtrl', function ($scope, $timeout) {
    pageSetUp();

    var obj;
    $scope.tojson = function (obj) {

        var table = $('#convert-table').tableToJSON({

            extractor: function (cellIndex, $cell) {
                return $cell.find('input').val() || $cell.find("#type option:selected").text();
            }


        })
        return table;

    }
    firebase.database().ref('/cash_flows/').orderByChild('uid').on("value", function (snapshot) {

        console.log(snapshot.val())
        if (!localStorage.getItem('pf')) {
            if (localStorage.getItem('pf') <= 10) {
                localStorage.setItem('pf', 10)
            }
        }

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const datetoday = month + ":" + day + ":" + year;
        // '10:18:2020';
        // month + ":" + day + ":" + year;

        $timeout(function () {
            $scope.$apply(function () {

                var tcol = 0;
                let returnArr = [];
                snapshot.forEach(childSnapshot => {
                    let item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    returnArr.push(item);
                    if (datetoday === item.date) {

                        tcol += 1 * item.total;
                    }
                });
                $scope.cfs = returnArr;
                $scope.tcol = tcol;
                console.log(returnArr)
            });
            $('#here').after(' <ul style="margin:0!important;margin-top:4px" class="pagination pagination-sm pull-right"  ><li ><a href="#cflist" rel="0" id="backward"> < </a></li> <li id="nav"></li>   <li><a href="#cflist" rel="0" id="forward"> > </a></li></ul>');
            var rowsShown = localStorage.getItem('pf')

            $("#pfilter").change(function () {

                rowsShown = localStorage.getItem('pf')


                localStorage.setItem('pf', $("#pfilter option:selected").text())

                window.location.href = "#"
                window.location.href = "#cflist"
            });

            var rowsTotal = $('#data tbody tr').length;
            var numPages = rowsTotal / rowsShown;
            for (i = 0; i < numPages; i++) {
                var pageNum = i + 1;
                $('#nav').append('<a href="#cflist" rel="' + i + '">' + pageNum + '</a>');
            }

            $('#data tbody tr').hide();
            $('#data tbody tr').slice(0, rowsShown).show();
            $('#nav a:first').addClass('active');
            $('#nav a ').bind('click', function () {

                $('#nav a').removeClass('active');
                $(this).addClass('active');
                var currPage = $(this).attr('rel');
                localStorage.setItem('curp', currPage)
                var startItem = currPage * rowsShown;
                var endItem = startItem + rowsShown;
                $('#data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
                css('display', 'table-row').animate({
                    opacity: 1
                }, 300);
                console.log($(this).attr('rel'))


            });

            $("#backward").click(function () {

                var cp = localStorage.getItem('curp');
                if (cp >= 1) {
                    cp = cp - 1;
                    localStorage.setItem('curp', cp)
                    var startItem = cp * rowsShown;
                    var endItem = startItem + rowsShown;
                    $('#data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
                    css('display', 'table-row').animate({
                        opacity: 1
                    }, 300);
                }
            });

            $("#forward").click(function () {

                var tp = $('#data tbody tr').length - 1;

                var cp = localStorage.getItem('curp');
                if (cp < tp) {
                    cp = cp * 1 + 1;
                    localStorage.setItem('curp', cp)
                    var startItem = cp * rowsShown;
                    var endItem = startItem + rowsShown;
                    $('#data tbody tr').css('opacity', '0.0').hide().slice(startItem, endItem).
                    css('display', 'table-row').animate({
                        opacity: 1
                    }, 300);
                }
            });

        }, 100);


    });

    $scope.selectUser = function (users) {
        document.getElementById("sum").innerHTML = users.total;

        console.log(users);
        $scope.clickedUser = users;
        id = users;
        var str = users.name;
        var res = str.split(",");

        $scope.Lname = res[0];
        $scope.Fname = res[1];

        // console.log($scope.clickedUser)


        $('#myModal').modal('show');
    };

    $scope.selectUser2 = function (users) {
        // console.log(users);
        $scope.clickedUser = users;
        id = users;

        $('#myModal2').modal('show');
    };

    $scope.deleteUser = function () {
        var ref = firebase.database().ref("/cash_flows/" + id.key);
        ref.remove()
            .catch(function (error) {
                console.log("Login Failed!", error.message);
                $("#notif").append('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Error</strong> ' + error.message + '</div>');
                setTimeout(function () {
                    $("#notif").hide()
                }, 1500);

            });;

        // $("#notif").show();
        // window.location.href = "#ecdlist";

        $("#notif").append('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Success</strong> Deleted !</div>');
        setTimeout(function () {
            window.location.href = "#/"
            window.location.href = "#cflist"
        }, 1500);
        $('#myModal2').modal('hide');
    };




    $('#editcf').on('submit', function (e) {
        e.preventDefault();
        $scope.tojson();
        var newobj = $scope.tojson(obj);
        // var uid = firebase.database().ref().child('chart_of_accounts').push().key;
        const [, ...rest] = newobj.reverse();
        const withoutLast = rest.reverse();
        console.log(withoutLast)
        var data = {
            date: $scope.clickedUser.date,
            name: $scope.Lname + "," + $scope.Fname,
            course: $scope.clickedUser.course,
            ornumber: $scope.clickedUser.ornumber,
            transaction: withoutLast,
            total: $('#sum').text()
        }

        // console.log(data);



        // var updates = {};
        // updates['/chart_of_accounts/' + uid] = data;
        // firebase.database().ref().update(updates);
        // console.log(updates)

        var updates = {};
        // console.log(id.key);
        updates['/cash_flows/' + id.key] = data;
        firebase.database().ref().update(updates);
        console.log(updates)
        if (updates) {
            $('#myModal').modal('hide');

            $("#notif").append('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Success</strong> Data had been save!.</div>');
            setTimeout(function () {
                window.location.hash = "#"
                window.location.hash = "#crlist"
            }, 1500);
        } else {
            $("#notif").append('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Error</strong> Check your Input !</div>');
        }



    });




    var cnt = 0;
    $scope.addtr = function () {
        $("#appendhere").append('<tr><td> <label class="input"><input type="text" name="particulars" ></label></td><td><select name="interested " id="type" required class="form-control btn-block"><option value="0 "  disabled=" ">Select</option><option value="1" selected="true">Miscellaneous Fee</option><option value="2">Tuition Fee</option><option value="3">Laboratory/Workshop Fee</option><option value="4">Uniforms</option><option value="5">Logo</option><option value="6">Credentials</option><option value="7">Others</option></select></td><td><label class="input"> <input type="text" name="remarks" placeholder="Remarks"></label></td></td><td class="col-md-2"><label class="input col-md-10"><input type="text" name="amount" value="" class="txt" autocomplete="off" required/></label><label class="input col-md-1"><button class="btn btn-danger btn-sm deleteb">X</button></label></td></tr>');
        cnt++;
        $('table thead th').each(function (i) {

        });

    }
    $scope.removetr = function () {

        $('#appendhere tr:last').remove();
        $('table thead th').each(function (i) {

        });
        calculateSum();
    }

    $("#appendhere").on('click', '.deleteb', function () {
        $(this).closest("tr").remove();
        $('table thead th').each(function (i) {

        });
        calculateSum();
    });


    function calculateSum() {
        var sum = 0;
        //iterate through each textboxes and add the values
        $(".txt").each(function () {

            //add only if the value is number
            if (!isNaN(this.value) && this.value.length != 0) {
                sum += parseFloat(this.value);
            }

        });
        //.toFixed() method will roundoff the final sum to 2 decimal places
        $("#sum").html(sum.toFixed(2));
        console.log(sum.toFixed(2));
    }

    $("#convert-table").on("keyup", ".txt", function () {
        calculateSum();
    });


});