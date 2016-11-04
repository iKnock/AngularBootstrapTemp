'use strict';

angular.module('myApp', [
    'angularFileUpload',
    'ui.sortable',
    'toaster',
    'PhoneGap',
    'leaflet-directive',
    //'uiGmapgoogle-maps',
    //'ngGeolocation',
    'ngResource',
    //'wu.staticGmap',
    'facebook',
    'ngTouch',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    //'myApp.templates',
    'myApp.controllers',
    'myApp.restServices'
]).config(['$routeProvider', '$locationProvider', '$httpProvider', 'FacebookProvider',
    function ($routeProvider, $locationProvider, $httpProvider, FacebookProvider) {
        //]).config(['$routeProvider', '$locationProvider', '$httpProvider', 'FacebookProvider', 'uiGmapGoogleMapApiProvider',
            //function ($routeProvider, $locationProvider, $httpProvider, FacebookProvider, GoogleMapApiProviders) {
        FacebookProvider.init('823305807721423');//Facebook AppId

        /*GoogleMapApiProviders.configure({
            key:'AIzaSyDq8gPHQ6qYe7Mxccuy_on56q_wbt7nrS4',//Google app key
            china: true,
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });*/

        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user){
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    $timeout(function(){deferred.reject();}, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        //================================================

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push(function($q, $location) {
            return function(promise) {
                return promise.then(
                    // Success: just return the response
                    function(response){
                        return response;
                    },
                    // Error: check the error status to get only the 401
                    function(response) {
                        if (response.status === 401)
                            $location.url('/login');
                        return $q.reject(response);
                    }
                );
            }
        });

    $routeProvider.when('/home', {templateUrl: '/partials/home.html', controller: 'HomeCtrl', preload: true});

    $routeProvider.when('/essMap', {templateUrl: '/partials/ess-map.html', controller: 'EssMapCtrl', preload: true});
    $routeProvider.when('/exploreEss', {templateUrl: '/partials/explore-ess.html', controller: 'ExploreEssCtrl', preload: true});

    $routeProvider.when('/category/essential/branch/:essId', {templateUrl: '/partials/essential-details.html', controller: 'EssentialsDetailsCtrl', preload: true});
    $routeProvider.when('/userList/Detail', {templateUrl: '/partials/user-list-detail.html', controller: 'UserListDetailCtrl', preload: true});
    $routeProvider.when('/events/detail', {templateUrl: '/partials/event-detail.html', controller: 'EventDetailCtrl'});

    $routeProvider.when('/ess/manage', {templateUrl: '/partials/manage-ess.html', controller: 'EssManageCtrl', resolve: {loggedin: checkLoggedin}});
    $routeProvider.when('/events/manage', {templateUrl: '/partials/manage-events.html', controller: 'EventManageCtrl', resolve: {loggedin: checkLoggedin}});
    $routeProvider.when('/createEssList', {templateUrl: '/partials/create-list.html', controller: 'CreateEssListCtrl', resolve: {loggedin: checkLoggedin}});

    $routeProvider.when('/signup', {templateUrl: '/partials/sign-up.html', controller: 'LoginController'});
    $routeProvider.when('/login', {templateUrl: '/partials/log-in.html', controller: 'LoginController'});
    $routeProvider.otherwise({redirectTo: '/home'});

        /*$routeProvider.when('/home', {templateUrl: '../client/partials/home.html', controller: 'HomeCtrl', preload: true});
        $routeProvider.when('/category', {templateUrl: '../client/partials/category-list.html', controller: 'CategoryListCtrl', preload: true});
        $routeProvider.when('/category/:categoryId', {templateUrl: '../client/partials/essentials-list.html', controller: 'EssListController', preload: true});
        $routeProvider.when('/essentials', {templateUrl: '../client/partials/essentials-list.html', controller: 'EssListController', preload: true});
        $routeProvider.when('/category/essential/branch/:essId', {templateUrl: '../client/partials/essential-details.html', controller: 'EssentialsDetailsCtrl', preload: true});

        $routeProvider.when('/classifieds/detail/:classifiedId', {templateUrl: '../client/partials/classified-details.html', controller: 'ClassifiedDetailCtrl'});
        $routeProvider.when('/classifieds/manage', {templateUrl: '../client/partials/manage-classifieds.html', controller: 'ClassifiedListCtrl', resolve: {loggedin: checkLoggedin}});
        $routeProvider.when('/classifieds', {templateUrl: '../client/partials/classified-list.html', controller: 'ClassifiedListCtrl'});

        $routeProvider.when('/events/detail/:eventId', {templateUrl: '../client/partials/event-detail.html', controller: 'EventDetailCtrl'});
        $routeProvider.when('/events/manage', {templateUrl: '../client/partials/manage-events.html', controller: 'EventManageCtrl', resolve: {loggedin: checkLoggedin}});
        $routeProvider.when('/events', {templateUrl: '../client/partials/ess-map.html', controller: 'EventListCtrl'});
        $routeProvider.when('/signup', {templateUrl: '../client/partials/sign-up.html', controller: 'LoginController'});
        $routeProvider.when('/login', {templateUrl: '../client/partials/log-in.html', controller: 'LoginController'});
        $routeProvider.otherwise({redirectTo: '/home'});*/
}]);//end of config