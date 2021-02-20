angular.module('newApp').controller('crlistCtrl', function ($scope, $timeout) {
    pageSetUp();

    var id;

    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];

    $scope.numberOfPages = () => {
        return Math.ceil(
            $scope.data.length / $scope.pageSize
        );
    }

    for (var i = 0; i < 10; i++) {
        $scope.data.push(`Question number ${i}`);
    }

    firebase.database().ref('/cash_receipts/').orderByChild('date').on("value", function (snapshot) {

        if (!localStorage.getItem('pf')) {
            if (localStorage.getItem('pf') <= 10) {
                localStorage.setItem('pf', 10)
            }
        }

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        const datetoday = '10/18/2020';
        //  month + "/" + day + "/" + year;
        // '10:18:2020';
        // month + ":" + day + ":" + year;


        $timeout(function () {
            /*
             *
             *   Jepoy Code
             * 
             */

            let total_sum = {}
            let reciepts = snapshot.val()
            let counter = 1


            for (const key in reciepts) {

                total_sum[reciepts[key]['date']] ? total_sum[reciepts[key]['date']].push(reciepts[key]) : (total_sum[reciepts[key]['date']] = [reciepts[key]])
                total_sum[reciepts[key]['date']]['date'] = reciepts[key].date
                total_sum[reciepts[key]['date']]['total_cash'] = (total_sum[reciepts[key]['date']]['total_cash'] ?? 0) + +reciepts[key]['cash']
                total_sum[reciepts[key]['date']]['total_cash_check'] = (total_sum[reciepts[key]['date']]['total_cash_check'] ?? 0) + +reciepts[key].total



                // console.log(+snappy[snapper]['cash'])
            }
            console.log('Total sum of cash:', Object.entries(total_sum).map(item => item[1]))
            var htmlData = ''
            var c = 1
            for (const key in total_sum) {
                for (const value of total_sum[key]) {
                    htmlData += `<tr style="display: table-row;">
                   <td class="ng-binding">${c++}</td>
                   <td class="ng-binding">${value.date.substring(6)}</td>
                   <td class="ng-binding">
                   ${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][(new Date(value.date).getMonth())]}
                   </td>
                   <td class="ng-binding">${value.date.substring(4,5)}</td>
                   <td class="ng-binding">₱${value.cash.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                   <td class="ng-binding">₱${value.cheque.replace(/\B(?=(\d{3})+(?!\d))/g, ",") || 0}</td>
                   
                   </tr>`
                    //    <td class="ng-binding">₱${value.total.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                }
                htmlData += `<tr ng-if style="background-color: #57889c!important;
               color: white;">
                   <td colspan="5"></td>

                   <td><strong>Total:</strong> </td>
                   <td><strong>₱${total_sum[key].total_cash_check}</strong></td>
               </tr>`

            }
            $('#appendtable').after(htmlData);
            $scope.$apply(function () {



                var tcol = 0,
                    dtotal = 0,
                    tcash = 0,
                    tcheque = 0;
                var obj = [];
                let returnArr = [];
                var i = 0;
                snapshot.forEach(childSnapshot => {
                    i++;
                    let item = childSnapshot.val();
                    item.key = childSnapshot.key;


                    tcash += 1 * item.cash
                    tcheque += 1 * item.cheque
                    tcol += 1 * item.total;
                    dtotal = tcash + tcheque

                    console.log(item.cash)
                    obj = {
                        date: item.date,
                        cash: item.cash,
                        cheque: item.cheque,
                        total: item.total,
                    }

                    obj[item.date] = (obj[item.date] ?? 0) + +item.cash
                    returnArr.push(obj);



                });
                $scope.crss = total_sum;
                console.log(returnArr)
                // console.log($scope.crs)
                $scope.tcol = tcol;
                $scope.dtotal = dtotal;


            });

            $('#here').after(' <ul style="margin:0!important;margin-top:4px" class="pagination pagination-sm pull-right"  ><li ><a href="#crlist" rel="0" id="backward"> < </a></li> <li id="nav"></li>   <li><a href="#crlist" rel="0" id="forward"> > </a></li></ul>');
            var rowsShown = localStorage.getItem('pf')

            $("#pfilter").change(function () {

                rowsShown = localStorage.getItem('pf')


                localStorage.setItem('pf', $("#pfilter option:selected").text())

                window.location.href = "#"
                window.location.href = "#crlist"
            });

            var rowsTotal = $('#data tbody tr').length;
            var numPages = rowsTotal / rowsShown;
            for (i = 0; i < numPages; i++) {
                var pageNum = i + 1;
                $('#nav').append('<a href="#crlist" rel="' + i + '">' + pageNum + '</a>');
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

        // console.log(users);
        $scope.clickedUser = users;
        id = users;

        console.log($scope.clickedUser)


        $('#myModal').modal('show');
    };

    $scope.selectUser2 = function (users) {
        console.log(users);
        $scope.clickedUser = users;
        id = users;

        $('#myModal2').modal('show');
    };

    $scope.deleteUser = function () {
        var ref = firebase.database().ref("/cash_receipts/" + id.key);
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
            window.location.href = "#crlist"
        }, 1500);
        $('#myModal2').modal('hide');
    };

    $('#editcr').on('submit', function (e) {
        e.preventDefault();
        // var uid = firebase.database().ref().child('chart_of_accounts').push().key;

        var data = {
            date: $scope.clickedUser.date,
            cash: $scope.clickedUser.cash,
            cheque: $scope.clickedUser.cheque,
            total: $scope.clickedUser.total,
            description: $scope.clickedUser.description,
            remarks: $scope.clickedUser.remarks,
            key: $scope.clickedUser.key
        }

        // console.log(data);



        // var updates = {};
        // updates['/chart_of_accounts/' + uid] = data;
        // firebase.database().ref().update(updates);
        // console.log(updates)

        var updates = {};
        // console.log(id.key);
        updates['/cash_receipts/' + id.key] = data;
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



}).filter('startFrom', function () {
    return function (input, start) {
        if (!input || !input.length) {
            return;
        }
        start = +start; //parse to int
        return input.slice(start);
    }
})