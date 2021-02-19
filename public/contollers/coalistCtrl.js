angular.module('newApp').controller('coalistCtrl', function ($scope, $timeout) {
    pageSetUp();


    firebase.database().ref('/chart_of_accounts/').orderByChild('uid').on("value", function (snapshot) {


        if (!localStorage.getItem('pf')) {
            if (localStorage.getItem('pf') <= 10) {
                localStorage.setItem('pf', 10)
            }
        }


        $timeout(function () {
            $scope.$apply(function () {

                let returnArr = [];
                snapshot.forEach(childSnapshot => {
                    let item = childSnapshot.val();
                    item.key = childSnapshot.key;
                    returnArr.push(item);
                });
                console.log(returnArr)

                $scope.coas = returnArr;
            });
            $('#here').after(' <ul style="margin:0!important;margin-top:4px" class="pagination pagination-sm pull-right"  ><li ><a href="#coalist" rel="0" id="backward"> < </a></li> <li id="nav"></li>   <li><a href="#coalist" rel="0" id="forward"> > </a></li></ul>');
            var rowsShown = localStorage.getItem('pf')

            $("#pfilter").change(function () {

                rowsShown = localStorage.getItem('pf')


                localStorage.setItem('pf', $("#pfilter option:selected").text())

                window.location.href = "#"
                window.location.href = "#coalist"
            });

            var rowsTotal = $('#data tbody tr').length;
            var numPages = rowsTotal / rowsShown;
            for (i = 0; i < numPages; i++) {
                var pageNum = i + 1;
                $('#nav').append('<a href="#coalist" rel="' + i + '">' + pageNum + '</a>');
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

        $scope.selectUser = function (users) {

            // console.log(users);
            $scope.clickedUser = users;
            id = users;

            // console.log($scope.clickedUser)


            $('#myModal').modal('show');
        };


    });


    $scope.selectUser2 = function (users) {
        // console.log(users);
        $scope.clickedUser = users;
        id = users;

        $('#myModal2').modal('show');
    };


    $scope.deleteUser = function () {
        var ref = firebase.database().ref("/chart_of_accounts/" + id.key);
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
            window.location.href = "#coalist"
        }, 1500);
        $('#myModal2').modal('hide');
    };


    $('#editcoa').on('submit', function (e) {
        e.preventDefault();
        // var uid = firebase.database().ref().child('chart_of_accounts').push().key;
        var ssc;
        if (!$scope.clickedUser.s_subcode) {
            ssc = 'n/a'
        } else {
            ssc = $scope.clickedUser.s_subcode;
        }

        var data = {
            code: $scope.clickedUser.code,
            categories: $scope.clickedUser.categories,
            type: $scope.clickedUser.type,
            p_subcode: $scope.clickedUser.p_subcode,
            s_subcode: ssc,
            name: $scope.clickedUser.name
        }

        console.log(data);



        // var updates = {};
        // updates['/chart_of_accounts/' + uid] = data;
        // firebase.database().ref().update(updates);
        // console.log(updates)

        var updates = {};
        // console.log(id.key);
        updates['/chart_of_accounts/' + id.key] = data;
        firebase.database().ref().update(updates);
        console.log(updates)
        if (updates) {
            $('#myModal').modal('hide');

            $("#notif").append('<div class="alert alert-success fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Success</strong> Data had been save!.</div>');
            setTimeout(function () {
                window.location.hash = "#"
                window.location.hash = "#coalist"
            }, 1500);
        } else {
            $("#notif").append('<div class="alert alert-danger fade in"><button class="close" data-dismiss="alert">×</button><i class="fa-fw fa fa-check"></i><strong>Error</strong> Check your Input !</div>');
        }



    });



});