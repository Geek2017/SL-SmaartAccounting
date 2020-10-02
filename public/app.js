// Application Modules and Routing
angular
    .module('newApp', ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: "dashboardCtrl"
            })
            .when('/coalist', {
                templateUrl: 'views/coalist.html',
                controller: "coalistCtrl"
            })
            .when('/coanew', {
                templateUrl: 'views/coanew.html',
                controller: "coanewCtrl"
            })
            .when('/cflist', {
                templateUrl: 'views/cflist.html',
                controller: "cflistCtrl"
            })
            .when('/cfnew', {
                templateUrl: 'views/cfnew.html',
                controller: "cfnewCtrl"
            })
            .when('/crlist', {
                templateUrl: 'views/crlist.html',
                controller: "crlistCtrl"
            })
            .when('/crnew', {
                templateUrl: 'views/crnew.html',
                controller: "crnewCtrl"
            })
            .when('/cdlist', {
                templateUrl: 'views/cdlist.html',
                controller: "cdlistCtrl"
            })
            .when('/cdnew', {
                templateUrl: 'views/cdnew.html',
                controller: "cdnewCtrl"
            });


    });