'use strict';

angular.module('myApp.controllers', [])
    .controller('MainCtrl', ['$scope', '$rootScope', 'toaster', '$window', '$filter', '$location', '$http', 'dataFactory', 'Facebook',
        function ($scope, $rootScope, toaster, $window, $filter, $location, $http, dataFactory, Facebook) {
            $scope.slide = '';
            $rootScope.back = function() {
                $scope.slide = 'slide-right';
                $window.history.back();
            };

            $rootScope.go = function(path){
                $scope.slide = 'slide-left';
                $location.url(path);
            };

            var orderBy = $filter('orderBy');

            //sort an array
            $rootScope.sortArray = function(array, sortBy, reverse, callback){
                var predicate = '-' + sortBy;
                array = orderBy(array, predicate, reverse);
                callback(array);
            };

            $scope.showError = function (error) {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        $scope.error = "User denied the request for Geolocation.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        $scope.error = "Location information is unavailable.";
                        break;
                    case error.TIMEOUT:
                        $scope.error = "The request to get user location timed out.";
                        break;
                    case error.UNKNOWN_ERROR:
                        $scope.error = "An unknown error occurred.";
                        break;
                }
                $scope.$apply(function(){
                    toaster.pop('info', "Info", $scope.error);
                });
            };

            $rootScope.defaultLat = 9.025305;
            $rootScope.defaultLng = 38.753264;

            $rootScope.putMarker = function(lat, lng, msg, focus, draggable){
                $scope.markers = [];
                if(msg !== 'N/A'){
                    $scope.markers.push({
                        lat: lat,
                        lng: lng,
                        message: msg,
                        focus: focus,
                        draggable: draggable
                    });
                }else{
                    $scope.markers.push({
                        lat: lat,
                        lng: lng,
                        focus: focus,
                        draggable: draggable
                    });
                }
            };

            $rootScope.defaultLocation = function(lat, lng, callback){
                var defaultPosition = {};
                defaultPosition.coords= {
                    latitude: lat,
                    longitude: lng
                };
                callback(defaultPosition);
            };

            $rootScope.getLocation = function(callback, error) {
                $window.navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.$apply(function() {
                        $scope.position = position;
                        callback($scope.position);
                    });
                }, $scope.showError);
            };

            $rootScope.getNearYouEss = function (callback) {
                $scope.getLocation(function(position){
                        dataFactory.getNearYouEssentials(position.coords.latitude, position.coords.longitude)
                            .query(function (essNearYou) {
                                if(essNearYou != null){
                                    callback(essNearYou);
                                }else{
                                    callback('0');
                                    console.log('Error happned no branchs found by this essentials');
                                }
                            });
                }, $scope.defaultLocation($rootScope.defaultLat, $rootScope.defaultLng, function(position){
                    dataFactory.getNearYouEssentials(position.coords.latitude, position.coords.longitude)
                        .query(function (essNearYou) {
                            if(essNearYou != null){
                                callback(essNearYou);
                            }else{
                                callback('0');
                                console.log('Error happned no branchs found by this essentials');
                            }
                        });
                }));
            };

            //===================
            $rootScope.getBraAddressForMapRemote = function (callback) {
                dataFactory.getAllBranchAddress()
                    .query(function (branchAddress) {
                        if(branchAddress != null){
                            callback(branchAddress);
                        }else{
                            callback('0');
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $rootScope.getCategByLookupType = function(lookupOf, callback){
                dataFactory.getCategByLookup(lookupOf)
                    .query(function (categories) {
                        if(categories != null){
                            callback(categories);
                        }else{
                            callback('0');
                            $scope.status = 'Unable to load category data';
                        }
                    });
            };

            $rootScope.reloadPage = function(){
                $window.location.reload();
            };

//================================================================
//======================================================================

            $rootScope.displayUserEssList = function(listId, userEssList){
                $rootScope.listId = listId;
                $rootScope.UserEssListInfo = userEssList;
                dataFactory.getUserEssListDetails(listId).query(function(userListsDetail){
                    if(userListsDetail.length > 0){
                        $scope.sortArray(userListsDetail, 'rank', true, function(sortedListDetail){
                            $rootScope.userListOrdered = sortedListDetail;
                            $scope.go('/userList/Detail');
                        });
                    }
                });
            };

            $rootScope.displayEventDetails = function(eventId){
                $rootScope.eventId = eventId;//Further coding Remark: Put this Id in to cookie or local storge to fix this page work on refresh
                dataFactory.getEventDetails(eventId, $scope.userId)
                    .query(function(eventDetail){
                    if(eventDetail.length > 0){
                        $rootScope.eventDetailInfo = eventDetail[0];
                        $scope.go('/events/detail');
                    }
                });
            };
//=======================================================================
            //====================populate branch detail=============================
            //=======================================================================
            $rootScope.populateBranchInfoDetail = function(branchId, essId){
                console.log('branchId & essId= '+branchId +' '+essId);
                $rootScope.essentialId = essId;

                var redirectTo = '/category/essential/branch';

                dataFactory.getBranchPhones(branchId)
                    .query(function (branchPhones) {
                        if(branchPhones != null){
                            $rootScope.branchPhones = branchPhones;
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });

                dataFactory.getBranchHours(branchId)
                    .query(function (branchHours) {
                        if(branchHours != null){
                            $rootScope.branchHours = branchHours;
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });

                dataFactory.getBranchAddress(branchId)
                    .query(function (branchAddress) {
                        if(branchAddress != null){
                            $rootScope.essDetails = branchAddress;
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });

                dataFactory.getEssBranchList(essId)
                    .query(function (branchList) {
                        if(branchList != null){
                            $scope.go(redirectTo + '/' +essId);//redirect to essential Details partial view
                            $rootScope.branchList = branchList;
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });

                dataFactory.getUserEssComment(essId)
                    .query(function (userEssComments) {
                        if(userEssComments != null){
                            $rootScope.userEssComments = userEssComments;
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });

                dataFactory.getUserEssRate($scope.userId, essId)
                    .query(function (userEssIntraction) {
                        if(userEssIntraction != null){
                            $rootScope.userEssIntraction = userEssIntraction;
                            //console.log('userInteraction= '+$rootScope.userEssIntraction);
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };
//=================================================================================================
//======================BootstrapUI Rating Widget Properties===========================================================================
//=================================================================================================
            $rootScope.max = 5;
            $rootScope.isReadonly = false;

            $rootScope.hoveringOver = function(value) {
                $rootScope.overStar = value;
                $rootScope.percent = 100 * (value / $scope.max);
            };

            $rootScope.ratingStates = [
                {stateOn: 'fa-star', stateOff: 'fa-star-o'}
            ];

//=================================================================================================
//=========================Universal Rating Methods========================================================================
//=================================================================================================
            $rootScope.addUserRate = function(userId, intractWithId, intractionDate, userRate, intractWith, callback){
                dataFactory.addUserRate(userId, intractWithId, intractionDate, userRate, intractWith, function(userRate){
                    console.log('Sucessfully saved= '+userRate);
                    callback();
                });
            };

            $rootScope.addUserIntraction = function(userId, intractWithId, intractionDate, userRate, intractWith, callback){
                dataFactory.addUserRate(userId, intractWithId, intractionDate, userRate, intractWith, function(userRate){
                    console.log('Sucessfully saved= '+userRate);
                    callback(userRate);
                });
            };

            $rootScope.updateUserRate = function(intractionId, intractionDate, userRate, callback){
                dataFactory.updateUserRate(intractionId, intractionDate, userRate, function(userRate){
                    console.log('Sucessfully updated= '+userRate);
                    callback();
                });
            };
//=================================================================================================
//=================================================================================================
//=================================================================================================
            $scope.generateTopEvents = function(event, callback){
                var i, len = event.length;
                var topDisplays = [];
                var expScore, userIndex;
                for(i=0; i<3; i++){
                    expScore = parseFloat(event[i].num_of_user) * 5;
                    if(parseFloat(event[i].user_rate_sum) > 0){
                        userIndex = Number(parseFloat(event[i].user_rate_sum) * 10 / expScore).toFixed(1);
                    }else{
                        userIndex = 0;
                    }

                    topDisplays.push({event_id: event[i].event_id,
                        event_name: event[i].event_name,
                        event_logo: event[i].event_logo,
                        user_rate_sum: event[i].user_rate_sum,
                        num_of_user: event[i].num_of_user,
                        rate_index: Number(event[i].rate_index).toFixed(1),
                        user_index: userIndex });
                }
                callback(topDisplays);
            };

            $rootScope.getTopEvents = function(callback){
                dataFactory.getTopEvents()
                    .query(function (events) {
                        if(events != null){
                            $scope.generateTopEvents(events, function(topEvents){
                                callback(topEvents);
                            });
                        }else{
                            callback('0');
                            $scope.status = 'Unable to load category data';
                        }
                    });
            };


            $rootScope.getTopEss = function(listSize, callback){
                dataFactory.getTopEss()
                    .query(function (ess) {
                        if(ess != null){
                            if(listSize === 'ALL'){
                                $scope.generateTopEss(ess, ess.length, function(topEss){
                                    callback(topEss);
                                });
                            }else{
                                $scope.generateTopEss(ess, listSize, function(topEss){
                                    callback(topEss);
                                });
                            }
                        }else{
                            callback('0');
                            $scope.status = 'Unable to load category data';
                        }
                    });
            };

            $scope.generateTopEss = function(ess, listSize, callback){
                var i, len = ess.length;
                var topDisplays = [];
                var expScore, userIndex;
                for(i=0; i<listSize; i++){
                    expScore = parseFloat(ess[i].num_of_user) * 5;
                    if(parseFloat(ess[i].user_rate_sum) > 0){
                        userIndex = Number(parseFloat(ess[i].user_rate_sum) * 10 / expScore).toFixed(1);
                    }else{
                        userIndex = 0;
                    }

                    topDisplays.push({ess_id: ess[i].ess_id,
                        ess_name: ess[i].ess_name,
                        ess_logo: ess[i].ess_logo,
                        branch_id: ess[i].branch_id,
                        user_rate_sum: ess[i].user_rate_sum,
                        num_of_user: ess[i].num_of_user,
                        rate_index: Number(ess[i].rate_index).toFixed(1),
                        user_index: userIndex });
                }

                callback(topDisplays);
            };
//================================================================================================
//================================================================================================
//==========================Essentials filtered by categoryId=====================================
//================================================================================================
//================================================================================================

            $rootScope.getEssWithRating = function(essentials, categoryId, callback){
                var i, len = essentials.length;
                //$rootScope.essWithRate = [];
                var essWithRate = [];
                for(i=0; i<len; i++){
                    console.log('Search By categoryId= '+JSON.stringify(essentials[i].catagory_id));
                    if(parseInt(essentials[i].catagory_id) === parseInt(categoryId)){
                        essWithRate.push({ess_id: essentials[i].ess_id,
                            ess_name: essentials[i].ess_name,
                            ess_logo: essentials[i].ess_logo,
                            branch_id: essentials[i].branch_id,
                            branch_name: essentials[i].branch_name,
                            catagory_name: essentials[i].catagory_name,
                            catagory_id: essentials[i].catagory_id,
                            user_id: essentials[i].user_id,
                            intraction_id: essentials[i].intraction_id,
                            user_rate: essentials[i].user_rate,
                            savedRate: essentials[i].user_rate});
                    }else{
                        essWithRate.push({ess_id: essentials[i].ess_id,
                            ess_name: essentials[i].ess_name,
                            ess_logo: essentials[i].ess_logo,
                            branch_id: essentials[i].branch_id,
                            branch_name: essentials[i].branch_name,
                            catagory_name: essentials[i].catagory_name,
                            catagory_id: essentials[i].catagory_id,
                            user_id: essentials[i].user_id,
                            intraction_id: essentials[i].intraction_id,
                            user_rate: essentials[i].user_rate,
                            savedRate: essentials[i].user_rate});
                    }
                }
                callback(essWithRate);
            };
//=================================================================================================
//=================================================================================================
//=================================================================================================
            $rootScope.today = new Date();//get the system date
            $rootScope.today.setTime($rootScope.today.getTime()+$rootScope.today.getTimezoneOffset()*60*1000);

            $rootScope.initUser = function(userId, showCommentBox, showLogInNotifier, screenName, logInReminderMsg){
                $scope.userId = userId;
                $scope.showCommentBox = showCommentBox;
                $scope.showLogInNotifier = showLogInNotifier;
                $scope.screenName = screenName;
                $scope.logInReminderMsg = logInReminderMsg;
            };

            $scope.initUser(0, false, true, 'Log In', 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!');

            $rootScope.checkLoggedIn = function(path){
                if(Number($scope.userId).toFixed(1) > 0){
                    $scope.go(path);
                }else{
                    $scope.go('/login');
                }
            };

            /**
             * Logout
             */
            $rootScope.logout = function() {
                Facebook.logout(function() {
                    $scope.$apply(function() {
                        $scope.user   = {};
                        $scope.logged = false;
                    });
                });
                $rootScope.message = 'Logged out.';
                $http.post('/logout');
                $scope.initUser(0, false, true, 'Log In', 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!');
            };
        }])

    //=============================================================================================================
//======================================LOGIN CONTROLLER=======================================================
//=============================================================================================================
    .controller('LoginController', ['$scope', '$rootScope', '$http', '$location', '$routeParams', 'dataFactory', '$timeout', 'Facebook',
        function ($scope, $rootScope, $http, $location, $routeParams, dataFactory, $timeout, Facebook){
            // This object will be filled by the form
            $scope.user = {};
            $rootScope.appUsers = {};

            // Register the login() function
            $scope.logInByEmail = function(){
                console.log('password= '+$scope.user.password);
                console.log('username= '+$scope.user.name);

                $http.post('/login', {
                    username: $scope.user.name,
                    password: $scope.user.password
                })
                    .success(function(user){
                        // No error: authentication OK
                        $rootScope.message = 'Authentication successful!';
                        $location.url('/home');
                        $scope.appUsers = user[0];

                        console.log('screenName= '+JSON.stringify(user)+'===>Scope of '+$scope.appUsers);
                        $scope.initUser($scope.appUsers.user_id, true, false, $scope.appUsers.screen_name, 'Logged In');
                    })
                    .error(function(){
                        // Error: authentication failed
                        $rootScope.message = 'Authentication failed.';
                        $location.url('/login');
                    });
            };

            // Defining user logged status
            $scope.logged = false;

            // And some fancy flags to display messages upon user status change
            $scope.byebye = false;
            $scope.salutation = false;

            /**
             * Watch for Facebook to be ready.
             * There's also the event that could be used
             */
            $scope.$watch(
                function() {
                    return Facebook.isReady();
                },
                function(newVal) {
                    if (newVal)
                        $scope.facebookReady = true;
                }
            );

            var userIsConnected = false;

            Facebook.getLoginStatus(function(response) {
                if (response.status == 'connected') {
                    userIsConnected = true;
                }
            });

            /**
             * IntentLogin
             */
            $scope.IntentLogin = function() {
                if(!userIsConnected) {
                    $scope.login();
                }else{
                    $scope.me();
                }
            };

            /**
             * Login
             */
            $scope.login = function() {
                Facebook.login(function(response) {
                    console.log('FB response= '+JSON.stringify(response));
                    if (response.status == 'connected') {
                        $scope.logged = true;
                        $scope.me();
                    }

                },{scope: 'email'});
            };

            /**
             * me
             */
            $scope.me = function() {
                Facebook.api('/me', function(response) {
                    /**
                     * Using $scope.$apply since this happens outside angular framework.
                     */
                    $scope.$apply(function() {
                        $scope.manageFbLoginUsers(response);
                        $scope.go('/home');
                    });

                });
            };

            $scope.manageFbLoginUsers = function(user){
                dataFactory.getFBuser(user.id)
                    .query(function(userInfo){
                        console.log('userInfo= '+JSON.stringify(userInfo));
                        if(userInfo != null && userInfo.length > 0){
                            //Authenticate
                            $scope.user.name = userInfo[0].email;
                            $scope.user.password = 'usingFacebook';
                            $scope.logInByEmail();
                            //user FB profile already saved
                            $scope.initUser(userInfo[0].user_id, true, false, userInfo[0].screen_name, 'Logged In');
                        }else{
                            //user FB profile is not saved yet so save properly
                            dataFactory.addUser(user.name,user.first_name,user.email,'usingFacebook', user.gender, user.id, 'photo', 'Indiv',
                                'User connected using FB', '1', function(savedUser){
                                    $scope.user.name = user.email;
                                    $scope.user.password = 'usingFacebook';
                                    $scope.logInByEmail();

                                    $scope.initUser(savedUser.insertId, true, false, user.first_name, 'Logged In');
                                });
                        }
                    });
            };

            /**
             * Taking approach of Events :D
             */
            $scope.$on('Facebook:statusChange', function(ev, data) {
                console.log('Status: ', data);
                if (data.status == 'connected') {
                    $scope.$apply(function() {
                        $scope.salutation = true;
                        $scope.byebye     = false;
                    });
                } else {
                    $scope.$apply(function() {
                        $scope.salutation = false;
                        $scope.byebye     = true;

                        // Dismiss byebye message after two seconds
                        $timeout(function() {
                            $scope.byebye = false;
                        }, 2000)
                    });
                }
            });

            $scope.genders = [
                {"gender_name": "Male", "gender": "male"},
                {"gender_name": "Female", "gender": "female"}
            ];

            $scope.appUser = {};

            $scope.signUp = function(){
                console.log('Gender= '+JSON.stringify($scope.appUser.genders.gender.gender));
                dataFactory.addUser($scope.appUser.screen_name,$scope.appUser.screen_name,$scope.appUser.email,$scope.appUser.password, $scope.appUser.genders.gender.gender, 'Using Email', 'photo', 'Indiv',
                    'User connected using Email', '1', function(savedUser){
                        $scope.initUser(savedUser.insertId, true, false, $scope.appUser.screen_name, 'Logged In');

                        $scope.user.name = $scope.appUser.email;
                        $scope.user.password = $scope.appUser.password;
                        $scope.logInByEmail();
                    });
            };
        }])
//==================================================================
//==================================================================
//========================================================================
//=========================================================================================
//=============================================================================
//===============================================================================
    .controller('EssentialsDetailsCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', 'dataFactory',
        function ($scope, $rootScope, $routeParams, $filter, dataFactory) {
            $scope.essId = $scope.essentialId;

            $scope.essDetails = $scope.essDetails;
            $scope.branchPhones = $scope.branchPhones;
            $scope.branchHours = $scope.branchHours;
            $scope.userRateForEss = $scope.userRatingForEss;

            $scope.isCollapsed = true;

            $scope.isPhoneCollapsed = false;
            $scope.isContactCollapsed = true;

            getTopEssentials();

            function getTopEssentials(){
                $scope.getTopEss(3, function(topEss){
                    $scope.topEssentials = topEss;
                });
            }

//=========================================================================================

//============================Get Essentials Gallery======================================
//=========================================================================================
            $scope.getEssentialsGallery = function(essId){
                $scope.essGallery = {};
                dataFactory.getEssGallery(essId)
                    .query({essId: $routeParams.essId}, function (essGallery) {
                        if(essGallery != null){
                            $scope.essGallery = essGallery;
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getEssentialsGallery($scope.essId);

//=========================================================================================
//============================Get, Save or Update and Calc Rating Index Essentials Rating======================================
//=========================================================================================
            /**
             * Listen to Users Rating on Essentials and act accordingly
             **/
            $scope.changed = function(){
                if($scope.userId > 0){
                    $scope.userPrevRate = $scope.userRateOnEss.user_rate;
                    if($scope.userPrevRate !== null && $scope.userPrevRate >= 0){
                        $scope.updateUserRate($scope.userRateOnEss.intraction_id, $scope.today, $scope.rate, function(){
                            $scope.getTotUserRating($scope.essId);
                            $scope.getUserIntracByUserId($scope.userId);
                        });
                    }else{
                        $scope.addUserRate($scope.userId, $scope.essId, $scope.today, $scope.rate, 'ess', function(){
                            $scope.getTotUserRating($scope.essId);
                            $scope.getUserIntracByUserId($scope.userId);
                        });
                    }
                }else{
                    $scope.logInReminderMsg = 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!';
                    $scope.go('/login');
                }
            };

//===============================Get This User Rating=====================================================================
            /**
             * Get Users rating on a certain essentials and populate values
             * **/
            $rootScope.userRateOnEss = {};

            $scope.getUserIntracByUserId = function(userId){
                dataFactory.getUserIntracByUserId(userId)
                    .query({essId: $routeParams.essId}, function (userIntraction) {
                        if(userIntraction != null){
                            $scope.getEssUserRate(userIntraction, function(userEssRate){
                                $scope.userRateOnEss = userEssRate;
                                $scope.rate = $scope.userRateOnEss.user_rate; //This user rate on this Ess value from Database
                            });
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getEssUserRate = function(userIntraction, callback){
                var i, len = userIntraction.length;
                $scope.userEssRate = {};
                for(i=0; i<len; i++){
                    if(userIntraction[i].ess_id === $scope.essId){
                        $scope.userEssRate = userIntraction[i];
                    }
                }
                callback($scope.userEssRate);
            };

            $scope.getUserIntracByUserId($scope.userId);

//===============================User Rating Index Calc=====================================================================
            /**
             * Get all users rating on certain essentials and calculate Users Rating Index
             * **/
            $scope.getTotUserRating = function(essId){
                dataFactory.getTotEssRating(essId)
                    .query({essId: $routeParams.essId}, function (totRating) {
                        if(totRating != null){
                            $scope.calculateRateIndex(totRating, function(userRateIndex){
                                $scope.totEssRatingIndex = userRateIndex;
                            });
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.calculateRateIndex = function(totEssRating, callback){
                var i, len = totEssRating.length;
                $scope.userEssTotRate = [];

                var totRate = totEssRating[0].tot_user_rate * 10;
                var totScore = totEssRating[0].num_of_user * 5;
                var userRateIndex = Number(parseFloat(totRate / totScore)).toFixed(1);
                console.log('userRateIndex= '+userRateIndex);
                if(userRateIndex==='NaN'){
                    $scope.userEssRateIndex = 0;
                }else{
                    $scope.userEssRateIndex = Number(parseFloat(userRateIndex)).toFixed(1);
                }

                if(len > 0){
                    for(i=0; i<len; i++){
                        $scope.userEssTotRate.push({user_id: totEssRating[i].user_id,
                            num_of_user: parseInt(totEssRating[i].num_of_user),tot_user_rate: parseInt(totEssRating[i].tot_user_rate),
                            user_rate: parseInt(totEssRating[i].user_rate), ess_id: totEssRating[i].ess_id,
                            ess_name: totEssRating[i].ess_name, userRateIndex: userRateIndex});
                    }
                }
                callback($scope.userEssTotRate);
            };

            $scope.getTotUserRating($scope.essId);

//=========================================================================================
//============================Save Essentials Comment======================================
//========================================================================================

            $scope.saveComment = function() {
                if($scope.userRateOnEss.intraction_id != null){
                    dataFactory.addUserComment($scope.userRateOnEss.intraction_id, $scope.userComment, $scope.today, function(data){
                        $scope.getAllEssComments($scope.essId);
                        $scope.userComment='';
                    });
                }else{
                    $scope.addUserIntraction($scope.userId, $scope.essId, $scope.today, 0, 'ess', function(userIntraction){
                        $scope.getUserIntracByUserId($scope.userId);
                        //console.log('userInteractionNewSavedId= '+JSON.stringify($scope.userRateOnEss));
                        dataFactory.addUserComment(userIntraction.insertId, $scope.userComment, $scope.today, function(data){
                            $scope.getAllEssComments($scope.essId);
                            $scope.userComment='';
                        });
                    });
                }
            };

            $scope.deleteComment = function(userCommId) {
                dataFactory.deleteComment(userCommId, function(data){
                    $scope.getAllEssComments($scope.essId);
                });
            };

            $scope.getAllEssComments = function(essId){
                dataFactory.getUserEssComment(essId, $scope.today)
                    .query({essId: $routeParams.essId}, function (userEssComments) {
                        if(userEssComments != null){
                            $scope.getEssUserComment(userEssComments, function(allEssComments){
                                $scope.userEssComments = allEssComments;
                                console.log('userRating= '+ JSON.stringify($scope.userEssComments));
                            });
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getEssUserComment = function(essComments, callback){
                var i, len = essComments.length;
                $scope.allEssUserComments = [];
                for(i=0; i<len; i++){
                    if(parseInt(essComments[i].user_id) === parseInt($scope.userId)){
                        //console.log('@ If clause equal true');
                        $scope.allEssUserComments.push({
                            user_id: essComments[i].user_id,
                            user_photo: essComments[i].user_photo,
                            ess_id: essComments[i].ess_id,
                            screen_name: essComments[i].screen_name,
                            user_comment: essComments[i].user_comment,
                            comment_date: essComments[i].comment_date,
                            user_comment_id: essComments[i].user_comment_id,
                            time_diff: essComments[i].timeDiff,
                            user_comment_prev: "true"});
                    }else{
                        //console.log('@ else clause equal false');
                        $scope.allEssUserComments.push({
                            user_id: essComments[i].user_id,
                            user_photo: essComments[i].user_photo,
                            ess_id: essComments[i].ess_id,
                            screen_name: essComments[i].screen_name,
                            user_comment: essComments[i].user_comment,
                            comment_date: essComments[i].comment_date,
                            user_comment_id: essComments[i].user_comment_id,
                            time_diff: essComments[i].timeDiff,
                            user_comment_prev: "false"});
                    }
                }
                console.log('Comments With Time Diff= '+JSON.stringify($scope.allEssUserComments));
                callback($scope.allEssUserComments);
            };

            $scope.getAllEssComments($scope.essId);

            //=======================================================================
            //====================User Check In Operation=============================
            //=======================================================================

            var todayFormated = $filter('date')($scope.today,'yyyy-MM-dd');
            $scope.checkIn = 'Check In';

            $scope.getUserCheckInStatus = function(callback){
                var checkInStatus={},
                    isUserCheckedIn='',
                    checkInId='';
                dataFactory.getUserCheckInStatus($scope.userId, todayFormated.toString(), $scope.essId)
                    .query(function(data){
                        console.log('checkInUserInformation= '+JSON.stringify(data));
                        if(data.length > 0){
                            checkInStatus.isUserCheckedIn = data[0].check_in;
                            checkInStatus.checkInId = data[0].user_check_in_id;
                            $scope.checkInStyle = {
                                "color" : "green"
                            };
                            $scope.checkIn = 'Check Out';
                            callback(checkInStatus);
                        }else{
                            checkInStatus.isUserCheckedIn = '0';
                            $scope.checkInStyle = {
                                "color" : "gray"
                            };
                            $scope.checkIn = 'Check In';
                            callback(checkInStatus);
                        }
                    });
            };

            $scope.checkInUser = function() {
                $scope.userCheckIn = '1';
                if($scope.userRateOnEss.intraction_id != null){
                    dataFactory.addUserCheckIn($scope.userRateOnEss.intraction_id, $scope.userCheckIn, todayFormated.toString(), function(data){
                        $scope.getUserCheckInStatus(function(checkInStatus){});
                    });
                }else{
                    $scope.addUserIntraction($scope.userId, $scope.essId, todayFormated.toString(), 0, 'ess', function(userIntraction){
                        $scope.getUserIntracByUserId($scope.userId);
                        dataFactory.addUserCheckIn(userIntraction.insertId, $scope.userCheckIn, todayFormated.toString(), function(data){
                            $scope.getUserCheckInStatus(function(checkInStatus){});
                        });
                    });
                }
            };

            $scope.deleteUserCheckIn = function(checkInId){
                dataFactory.deleteCheckIn(checkInId, function(data){
                    console.log('User Check In Removed Successfully');
                    $scope.getUserCheckInStatus(function(checkInStatus){});
                });
            };

            $scope.getUserCheckInStatus(function(checkInStatus){});

            $scope.checkInOutUser = function(){
                $scope.getUserCheckInStatus(function(checkInStatus){
                    console.log('CheckInStatus= '+JSON.stringify(checkInStatus));
                    if(checkInStatus.isUserCheckedIn === '0'){//user not Checked In Yet
                        $scope.checkInUser();//check in user
                    }else{//user already checked in
                        $scope.deleteUserCheckIn(checkInStatus.checkInId);//remove user check in status
                    }
                });
            };


            //==========================================================================
            //==========================================================================
        }])
//==================================================================
//==================================================================
//========================================================================
//=========================================================================================
    .controller('HomeCtrl', ['$scope', '$rootScope', '$routeParams', 'dataFactory',
        function ($scope, $rootScope, $routeParams, dataFactory) {
            //========================================
            getTopEssentials();

            function getTopEssentials(){
                $scope.getTopEss(3, function(topEss){
                    $scope.topEsses = topEss;
                });
            }

        }])
//===============================================================================
    .controller('EssMapCtrl', ['$scope', '$rootScope', '$window', '$routeParams', 'dataFactory', 'leafletData',
        function ($scope, $rootScope, $window, $routeParams, dataFactory, leafletData) {

            getTopEssentials();
            getNearYouEssentialsAll();
            getEssCategories();

            function getNearYouEssentialsAll(){
                /*$scope.getNearYouEss(function(nearYou){
                    $scope.nearYouEssentials = nearYou;
                });*/
                $scope.getTopEss('ALL', function(topEss){
                    $scope.nearYouEssentials = topEss;
                });
            }

            $scope.displayMarkerOnMouseOver = function(listDetail){
                var msg= listDetail.ess_name +' <br>'+
                    'Email: '+listDetail.email +' <br>'+
                    'User Rate Index: '+listDetail.rate_index+'/10'+' <br>';
                //$scope.putMarker(parseFloat(listDetail.latitude), parseFloat(listDetail.longtiude), msg, true, false);
                $scope.putMarker(parseFloat(listDetail.latitude), parseFloat(listDetail.longtiude), msg, true, false);
            };

            function getTopEssentials(){
                $scope.getTopEss(3, function(topEss){
                    $scope.topEssentials = topEss;
                });
            }

            function getEssCategories() {//get all category list found on the ess_category lookup
                $scope.getCategByLookupType('ess_category', function(categories){
                    if(categories != 0){
                        $scope.essCategories = categories;
                    }
                });
            }
//=======================================================================================================
//=======================================================================================================
//=======================================================================================================

            $scope.center= {
                lat: Number($scope.defaultLat),
                lng: Number($scope.defaultLng),
                zoom: 13
            };

            $scope.getMarkerData = function(callback){
                $scope.getBraAddressForMapRemote(function (essLocation) {
                    if(essLocation != null) {
                        var len = essLocation.length;
                        var i;
                        var cordArr = [];

                        for (i = 0; i < len; i++) {
                            // Creates a red marker with the coffee icon
                            var redMarker = L.AwesomeMarkers.icon({
                                icon: 'coffee',
                                markerColor: 'red'
                            });

                            cordArr.push({
                                lat: Number(essLocation[i].latitude),
                                lng: Number(essLocation[i].longtiude),
                                message: essLocation[i].ess_name +' <br>'+
                                        'User Rate Index: '+essLocation[i].rate_index+'/10' +' <br>'+
                                        'Email: '+essLocation[i].email+' <br>'+
                                        'Website: '+essLocation[i].website+' <br>'+
                                         '<hr/>'+
                                        'Checked In Today: '+
                                        'Female: '+essLocation[i].checked_in_females+'  '+'Male: '+essLocation[i].checked_in_males+'<br>',
                                icon: redMarker
                            });
                        }//End of For Loop
                        callback(cordArr);
                    }
                });
            };

            $scope.addMarkers = function(allMarkers, position) {
                    $scope.center= {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        zoom: 14
                    },
                    $scope.markers= allMarkers,
                    $scope.defaults= {
                        //tileLayer: "http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png",
                        maxZoom: 18,
                        path: {
                            weight: 10,
                            color: '#8C92AC',
                            opacity: 1
                        }
                    };
            };

            $scope.getLocation(function(position){
                $scope.getMarkerData(function(markers){
                    $scope.addMarkers(markers, position);
                });
            }, $scope.defaultLocation($rootScope.defaultLat, $rootScope.defaultLng, function(position){
                $scope.getMarkerData(function(markers){
                    $scope.addMarkers(markers, position);
                });
            }));

        }])
    .controller('EssManageCtrl', ['$scope', '$rootScope', '$routeParams', '$upload', 'toaster', 'dataFactory',
        function ($scope, $rootScope, $routeParams, $upload, toaster, dataFactory) {
            $scope.imageUrl = '/camera-placeholder.png';
            $scope.ess = {};
//============================================================================================
//=============================Map Functionalities===============================================================
//============================================================================================
//============================================================================================
            angular.extend($scope, {
                center: {
                    lat: $scope.defaultLat,
                    lng: $scope.defaultLng,
                    zoom: 13
                },
                defaults: {
                    scrollWheelZoom: false
                },
                events: {
                    map: {
                        enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                        logic: 'emit'
                    }
                }
            });

            $scope.$on('leafletDirectiveMarker.dragend', function(event){
                $scope.ess.lat = $scope.markers[0].lat;
                $scope.ess.lng = $scope.markers[0].lng;
            });

            var msg = 'N/A';
            $scope.putMarker($scope.defaultLat, $scope.defaultLng, msg, true, true);
//============================================================================================
//============================================================================================
//============================================================================================
//============================================================================================
            getEssCategories();

            function getEssCategories() {//get all category list found on the ess_category lookup
                $scope.getCategByLookupType('ess_category', function(essCategory){
                    if(essCategory != 0){
                        $scope.essCategory = essCategory;
                        console.log('CategoryId= '+$scope.essCategory[0].catagory_id);
                    }
                });
            }

            $scope.getUserEssentials = function(userId) {
                dataFactory.getUserIntracByUserId(userId, function(data){
                    $scope.userEssentials = data;
                    alert(JSON.stringify($scope.userEssentials));
                });
            };

            $scope.getUserEssentials($scope.userId);

            $scope.saveEssentialsInfo = function() {
                var branchId;
                dataFactory.createEssentials($scope.userId, $scope.ess, $scope.imageUrl, function(essData){
                    dataFactory.createBranch(essData.insertId, $scope.ess, function(branData){
                        branchId = branData.insertId;
                        dataFactory.createAddress(branchId, $scope.ess, function(addressData){
                        });
                        dataFactory.createPhone(branchId, $scope.ess, function(phoneData){
                            toaster.pop('success', "Saved", "Successfully Saved!");
                        });
                    });
                });
            };

            $scope.onFileSelect = function($files) {
                console.log('Fileupload files= '+$files);
                //$files: an array of files selected, each file has name, size, and type.
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    $scope.upload = $upload.upload({
                        //url: 'api/user/create/upload/essentials', //upload.php script, node.js route, or servlet url
                        url: '/api/user/create/essentials/upload',
                        //method: 'POST' or 'PUT',
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        headers: {'Content-Type': 'multipart/form-data'},
                        //withCredentials: true,
                        data: {myObj: $scope.myModelObj},
                        file: file
                        // or list of files ($files) for html5 only
                        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                        // customize file formData name ('Content-Disposition'), server side file variable name.
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                        //formDataAppender: function(formData, key, val){}
                    }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                        $scope.imageUrl = data;
                    });
                    //.error(...)
                    //.then(success, error, progress);
                    // access or attach event listeners to the underlying XMLHttpRequest.
                    //.xhr(function(xhr){xhr.upload.addEventListener(...)})
                }
                /* alternative way of uploading, send the file binary with the file's content-type.
                 Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
                 It could also be used to monitor the progress of a normal http post/put request with large data*/
                // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
            };
        }
    ])
//================================================================================================
//================================================================================================
//================================================================================================
    //===============================================================================
    .controller('EventManageCtrl', ['$scope', '$rootScope', '$routeParams', '$upload', 'toaster', '$filter', 'dataFactory',
        function ($scope, $rootScope, $routeParams, $upload, toaster, $filter, dataFactory) {
            $scope.imageUrl = '/camera-placeholder.png';
            getEventCategories();
            getEventFrequencyCategories();
            getAllEss();

            function getEventCategories() {//get all category list found on the ess_category lookup
                $scope.getCategByLookupType('event_category', function(eventCategory){
                    if(eventCategory != 0){
                        $scope.eventCategories = eventCategory;
                    }
                });
            }

            function getEventFrequencyCategories() {//get all category list found on the ess_category lookup
                $scope.getCategByLookupType('event_frequency', function(eventFreq){
                    if(eventFreq != 0){
                        $scope.eventFrequency = eventFreq;
                    }
                });
            }

            function getAllEss(){
                $scope.getTopEss('ALL', function(topEss){
                    $scope.allEss = topEss;
                });
            }

            $scope.getAllEvents = function () {
                $scope.userEvents = [];
                dataFactory.getAllEventsByUserId($scope.userId)
                    .query(function (allEvents) {
                        if (allEvents != null) {
                            var i, len = allEvents.length;
                            for(i=0;i<len;i++){
                                $scope.userEvents.push({event_id: allEvents[i].event_id,
                                    user_id: allEvents[i].user_id,
                                    event_category: allEvents[i].event_category,
                                    event_name: allEvents[i].event_name,
                                    event_desc: allEvents[i].event_desc,

                                    event_date: allEvents[i].event_date,
                                    start_time: allEvents[i].start_time,
                                    event_frequency: allEvents[i].event_frequency,

                                    event_logo: allEvents[i].event_logo,
                                    event_place: allEvents[i].event_place,
                                    event_organizer: allEvents[i].event_organizer,

                                    event_fee: allEvents[i].event_fee,
                                    status: allEvents[i].status,
                                    remark: allEvents[i].remark,

                                    rater_user_id: allEvents[i].rater_user_id,
                                    screen_name: allEvents[i].screen_name,
                                    intraction_id: allEvents[i].intraction_id,

                                    intract_with: allEvents[i].intract_with,
                                    user_rate: allEvents[i].user_rate,
                                    intraction_date: allEvents[i].intraction_date,
                                    saved_rate: allEvents[i].user_rate});
                            }
                            console.log('Function at controller called with= !!!'+JSON.stringify(allEvents));
                        } else {
                            console.log('Error happned no events found!!!');
                        }
                    });
            };

            $scope.getAllEvents();

            $scope.onFileSelect = function($files) {
                console.log('Fileupload files= '+$files);
                //$files: an array of files selected, each file has name, size, and type.
                for (var i = 0; i < $files.length; i++) {
                    var file = $files[i];
                    $scope.upload = $upload.upload({
                        url: 'api/user/create/essentials/upload', //upload.php script, node.js route, or servlet url
                        //method: 'POST' or 'PUT',
                        method: 'POST',
                        //headers: {'header-key': 'header-value'},
                        headers: {'Content-Type': 'multipart/form-data'},
                        //withCredentials: true,
                        data: {myObj: $scope.myModelObj},
                        file: file,
                        // or list of files ($files) for html5 only
                        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
                        // customize file formData name ('Content-Disposition'), server side file variable name.
                        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file'
                        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
                        //formDataAppender: function(formData, key, val){}
                    }).progress(function(evt) {
                        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                    }).success(function(data, status, headers, config) {
                        // file is uploaded successfully
                        console.log(data);
                        $scope.imageUrl = data;
                    });
                    //.error(...)
                    //.then(success, error, progress);
                    // access or attach event listeners to the underlying XMLHttpRequest.
                    //.xhr(function(xhr){xhr.upload.addEventListener(...)})
                }
                /* alternative way of uploading, send the file binary with the file's content-type.
                 Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed.
                 It could also be used to monitor the progress of a normal http post/put request with large data*/
                // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
            };

            $scope.saveEvent = function() {
                var todayFormated = $scope.event.event_date;
                $scope.event.event_date = $filter('date')(todayFormated,'dd-MM-yyyy');
                $scope.event.start_time = $filter('date')($scope.event.start_time,'HH:mm');
                dataFactory.createEvent($scope.userId, $scope.event, $scope.imageUrl, function(data){
                    $scope.getAllEvents();
                    toaster.pop('success', "Saved", "Successfully Saved! ID= "+data.insertId);
                });
            };

            $scope.deleteEvent = function(eventId) {
                dataFactory.deleteEvent(eventId, function(data){
                    $scope.getAllEvents();
                    toaster.pop('warning', "Deleted", "Successfully Deleted!");
                });
            };

            $scope.event={};

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

        }])
//===============================================================================
    .controller('EventDetailCtrl', ['$scope', '$rootScope', '$routeParams', 'dataFactory',
        function ($scope, $rootScope, $routeParams, dataFactory) {

            /**
             * This method should be finalized later and fix the refresh issue
             *
             $scope.getAllActiveEvents = function (eventId) {
                console.log('Function for route params= '+eventId);
                dataFactory.getAllEventsById(eventId)
                    .query(function (eventDetail) {
                        if (eventDetail != null) {
                            $rootScope.eventDetail = eventDetail;
                            console.log('Function eventDetail= !!!'+JSON.stringify(eventDetail));
                        } else {
                            console.log('Error happned no events found!!!');
                        }
                    });
                };

             $scope.getAllActiveEvents($routeParams.eventId);
             **/

            //$scope.eventDetailInfo = $scope.eventDetailInfo[0];//populate event detail
            $scope.thisEventId = $scope.eventId;

            angular.extend($scope, {
                center: {
                    lat: parseFloat($scope.eventDetailInfo.latitude),
                    lng: parseFloat($scope.eventDetailInfo.longtiude),
                    zoom: 13
                },
                defaults: {
                    scrollWheelZoom: false
                },
                events: {
                    map: {
                        enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                        logic: 'emit'
                    }
                }
            });

            /*$scope.putMarker = function(lat, lng){
                $scope.markers = [];
                $scope.markers.push({
                    lat: lat,
                    lng: lng,
                    focus: true,
                    draggable: false
                });
            };*/
            //$scope.putMarker(8.99465, 38.784876);

            /*message: essLocation[i].ess_name +' <br>'+
             'User Rate Index: '+essLocation[i].rate_index+'/10' +' <br>'+
             'Email: '+essLocation[i].email+' <br>'+
             'Website: '+essLocation[i].website+' <br>'+
             '<hr/>'+
             'Checked In Today: '+
             'Female: '+essLocation[i].checked_in_females+'  '+'Male: '+essLocation[i].checked_in_males+'<br>',*/

            var msg= $scope.eventDetailInfo.event_name +' <br>'+
                'Event Category: '+$scope.eventDetailInfo.event_category +' <br>'+
                'Location: '+$scope.eventDetailInfo.ess_name+' <br>'+
                'User Rate Index: '+$scope.eventDetailInfo.rate_index+'/10' +' <br>';

            $scope.putMarker(parseFloat($scope.eventDetailInfo.latitude), parseFloat($scope.eventDetailInfo.longtiude), msg, true, false);

            getTopEvents();

            function getTopEvents(){
                $scope.getTopEvents(function(topEvents){
                    $scope.topEvents = topEvents;
                });
            }

            getTopEssentials();

            function getTopEssentials(){
                $scope.getTopEss('3', function(topEss){
                    $scope.topEssentials = topEss;
                });
            }
//=========================================================================================
//============================Get, Save or Update nad Calc Rating Index Event Rating====================
//=========================================================================================
            /**
             * Listen to Users Rating on Essentials and act accordingly
             **/
            $scope.eventRateChanged = function(eventId, intractionId, prevRate, userRate){
                $scope.eventId = eventId;
                if($scope.userId > 0){
                    if(prevRate !== null && intractionId > 0){
                        $scope.updateUserRate(intractionId, $scope.today, userRate, function(){
                            $scope.displayEventDetails(eventId);
                        });
                    }else{
                        $scope.addUserRate($scope.userId, eventId, $scope.today, userRate, 'event', function(){
                            $scope.displayEventDetails(eventId);
                        });
                    }
                }else{
                    toaster.pop('success', "Success", "In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!");
                    $scope.logInReminderMsg = 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!';
                    $scope.go('/login');
                }
            };

            //=========================================================================================
//============================Save, Delete and View Event Comment======================================
//========================================================================================

            $scope.saveEventComment = function() {
                if($scope.eventDetailInfo.intraction_id != null && $scope.eventDetailInfo.intraction_id > 0){
                    dataFactory.addUserComment($scope.eventDetailInfo.intraction_id, $scope.userEventComment, $scope.today, function(data){
                        $scope.getAllEventComments($scope.thisEventId);
                        $scope.userEventComment='';
                    });
                }else{
                    $scope.addUserIntraction($scope.userId, $scope.eventId, $scope.today, 0, 'event', function(userIntraction){
                        $scope.displayEventDetails($scope.eventId);
                        console.log('userInteractionNewSavedId= '+JSON.stringify($scope.eventDetailInfo.intraction_id));
                        dataFactory.addUserComment(userIntraction.insertId, $scope.userEventComment, $scope.today, function(data){
                            $scope.getAllEventComments($scope.thisEventId);
                            $scope.userEventComment='';
                        });
                    });
                }
            };

            $scope.deleteEventComment = function(userCommId) {
                dataFactory.deleteComment(userCommId, function(data){
                    $scope.getAllEventComments($scope.thisEventId);
                });
            };

            $scope.getAllEventComments = function(eventId){
                dataFactory.getUserEventComments(eventId)
                    .query({eventId: $routeParams.eventId}, function (userEventComments) {
                        if(userEventComments != null){
                            $scope.getEventUserComment(userEventComments, function(allEventComments){
                                $scope.userEventComments = allEventComments;
                                console.log('userEventComment= '+ JSON.stringify($scope.userEventComments));
                            });
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getEventUserComment = function(eventComments, callback){
                var i, len = eventComments.length;
                $scope.allEventUserComments = [];
                for(i=0; i<len; i++){
                    if(parseInt(eventComments[i].user_id) === parseInt($scope.userId)){
                        console.log('@ If clause equal true');
                        $scope.allEventUserComments.push({user_id: eventComments[i].user_id, user_photo: eventComments[i].user_photo,
                            ess_id: eventComments[i].ess_id, screen_name: eventComments[i].screen_name, comment_date: eventComments[i].comment_date,
                            user_comment: eventComments[i].user_comment, user_comment_id: eventComments[i].user_comment_id,
                            user_comment_prev: "true"});
                    }else{
                        console.log('@ else clause equal false');
                        $scope.allEventUserComments.push({user_id: eventComments[i].user_id,
                            ess_id: eventComments[i].ess_id, screen_name: eventComments[i].screen_name, comment_date: eventComments[i].comment_date, user_photo: eventComments[i].user_photo,
                            user_comment: eventComments[i].user_comment, user_comment_id: eventComments[i].user_comment_id,
                            user_comment_prev: "false"});
                    }
                }
                callback($scope.allEventUserComments);
            };

            $scope.getAllEventComments($scope.thisEventId);

        }])
//===============================================================================
    .controller('CreateEssListCtrl', ['$scope', '$rootScope', '$routeParams', '$filter', 'toaster', 'dataFactory',
        function ($scope, $rootScope, $routeParams, $filter, toaster, dataFactory) {

            var updateScenrio = false;
            var listId;

            getAllEssentials();

            function getAllEssentials(){
                $scope.getTopEss('ALL', function(topEss){
                    $scope.allEss = topEss;
                });
            }

            $scope.userList = {};
            $scope.userListDetails = [];

            $scope.pushItemToJsonArray = function(array, obj, callback){
                var jsonArray = array;
                jsonArray.push(obj);
                callback(jsonArray);
            };

            $scope.removeEssFromArray = function(array, key, callback){
                var arrayLength = array.length;
                for(var i = arrayLength - 1; i >= 0; i--){
                    if(array[i].ess_id == key){
                        array.splice(i,1);
                    }
                }
                callback(array);
            };

            $scope.searchEssFromArray = function(array, key, callback){
                var arrayLength = array.length;
                var found;
                for(var i = arrayLength - 1; i >= 0; i--){
                    if(array[i].ess_id == key){
                        found = true;
                    }else{
                        found = false;
                    }
                }
                callback(found);
            };

            //Add taped essential to $scope.userListDetails and Remove taped essential from $scope.allEss
            $scope.tapEssList = function(ess){
                    $scope.pushItemToJsonArray($scope.userListDetails, ess, function(newUserListDetails){
                        $scope.userListDetails = [];
                        $scope.userListDetails = newUserListDetails;
                    });
                    $scope.removeEssFromArray($scope.allEss, ess.ess_id, function(essList){
                        $scope.allEss = [];
                        $scope.allEss = essList;
                        $scope.query = "";
                    });
            };

            $scope.removeFromUserList = function(ess){
                    if(updateScenrio){//The user is editing previously created list scenario, so remove from data table(i.e update scinario)
                        var essToPush = {
                            "ess_id": ess.ess_id,
                            "ess_name": ess.ess_name,
                            "ess_logo": ess.ess_logo,
                            "branch_id": ess.branch_id,
                            "rate_index": Number(ess.rate_index).toFixed(1).toString()
                        };
                        $scope.pushItemToJsonArray($scope.allEss, essToPush, function(allEssLists){
                            console.log('allEssLists to sort= '+JSON.stringify(allEssLists));
                            $scope.sortArray(allEssLists, 'rate_index', false, function(sortedArray){
                                $scope.allEss = sortedArray;
                            });
                        });
                        $scope.removeEssFromArray($scope.userListDetails, ess.ess_id, function(essList){
                            $scope.userListDetails = essList;
                        });
                        dataFactory.deleteListDetails(ess.list_detail_id, function(res){
                            if(res){
                                //deleted successfully
                            }
                        });
                    }else{//The user is creating a new list, so add obj to original array and remove from data table
                        $scope.pushItemToJsonArray($scope.allEss, ess, function(newUserListDetails){
                            $scope.sortArray(newUserListDetails, 'rate_index', false, function(sortedArray){
                                $scope.allEss = sortedArray;
                            });
                        });
                        $scope.removeEssFromArray($scope.userListDetails, ess.ess_id, function(essList){
                            $scope.userListDetails = essList;
                        });
                    }
            };

            $scope.clearUserList = function(){
                $scope.userList = {};
                $scope.userListDetails = [];
            };

            $scope.publishEssList = function(){
                if($scope.userId > 0) {
                    dataFactory.createEssList($scope.userId, $scope.userList, function (userList) {
                        $scope.insertListDetails($scope.userListDetails.length, userList.insertId);
                        toaster.pop('success', "Success", "Your List has been Successfully created.");
                    });
                }else{
                    toaster.pop('warning', "Success", "In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!Please Register");
                    $scope.logInReminderMsg = 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!';
                    $scope.go('/login');
                }
            };

            $scope.insertListDetails = function(len, listId){
                var i;
                for(i=0; i<len; i++){
                    dataFactory.createEssListDetail(listId, i+1, $scope.userListDetails[i], function(listDetail){
                        $scope.clearUserList();
                        $scope.getUserList();
                    });
                }
            };

            $scope.updateUserList = function(){
                dataFactory.deleteAllUserList(listId, function(res){
                    if(res){
                        $scope.insertListDetails($scope.userListDetails.length, listId);
                        toaster.pop('info', "Updated", "Your List has been Successfully Updated.");
                    }
                })
            };

            $scope.deleteUserListInfo = function(){
                dataFactory.deleteUserList(listId, function(res){
                    dataFactory.deleteAllUserList(listId, function(res){
                        $scope.clearUserList();
                        toaster.pop('warning', "Deleted", "Your List has been Successfully Deleted.");
                        $scope.getUserList();
                    });
                });
            };

            $scope.getUserList = function(){
                dataFactory.getUserEssList($scope.userId).query(
                    function(userLists){
                        if(userLists != null){
                            $scope.userLists = userLists;
                        }
                })
            };

            $scope.getUserList();

            $scope.checkEssOnPopulate = function(userListDetails, callback){
                var len = userListDetails.length,
                    i;
                for(i=0; i<len; i++){
                    var essId = userListDetails[i].ess_id;
                    $scope.searchEssFromArray($scope.allEss, essId, function(found){
                        if(found){//update scienario

                        }else{
                            $scope.removeEssFromArray($scope.allEss, essId, function(essList){
                                $scope.allEss = essList;
                            });
                        }
                    });
                }
                callback($scope.allEss);
            };

            $rootScope.populateUserList = function(userList){
                updateScenrio = true;
                listId = userList.list_id;
                $scope.userList.createdDate = angular.copy(userList.created_on_date);
                $scope.userList.listTitle = angular.copy(userList.list_title);
                $scope.userList.listStory = angular.copy(userList.list_desc);
                dataFactory.getUserEssListDetails(userList.list_id).query(function(userListsDetail){
                    if(userListsDetail.length > 0){
                        console.log('userLIstDetail= '+JSON.stringify(userListsDetail));
                        $scope.sortArray(userListsDetail, 'rank', true, function(sortedListDetail){
                            $scope.userListDetails = sortedListDetail;
                        });
                        $scope.checkEssOnPopulate(userListsDetail, function(allEssList){
                            $scope.allEss = allEssList;
                        });
                    }
                });
            };

            $scope.displayUserList = function(){
                if($rootScope.userListClicked != null){
                    $rootScope.populateUserList($rootScope.userListClicked);
                }
            };

            //$scope.displayUserList();


            //============Date Picker Angular Bootstrap cpt======================
            //===================================================================
            /*$scope.today = function() {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };*/

            // Disable weekend selection
            $scope.disabled = function(date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            };

            $scope.toggleMin = function() {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.format = 'yyyy-MM-dd';
            //====================================================================
            //=====================================================================

        }])
    .controller('UserListDetailCtrl', ['$scope', '$rootScope', '$window', '$routeParams', 'toaster', 'dataFactory',
        function ($scope, $rootScope, $window, $routeParams, toaster, dataFactory) {

            var lat, lng;
            var self = this;

            angular.extend($scope, {
                center: {
                    lat: $scope.defaultLat,
                    lng: $scope.defaultLng,
                    zoom: 13
                },
                defaults: {
                    scrollWheelZoom: false
                },
                events: {
                    map: {
                        enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                        logic: 'emit'
                    }
                }
            });

            $scope.$on('leafletDirectiveMap.click', function(event, wrap){
                alert("Lat, Lon : " + wrap.leafletEvent.latlng.lat + ", " + wrap.leafletEvent.latlng.lng);
            });

            $scope.displayMarkerOnMouseOver = function(listDetail){
                $scope.center.lat = parseFloat(listDetail.latitude);
                $scope.center.lng = parseFloat(listDetail.longtiude);
                var msg= listDetail.ess_name +' <br>'+
                    'Rank: '+listDetail.rank +' <br>'+
                    'User Rate Index: '+listDetail.rate_index+'/10'+' <br>';
                //$scope.putMarker(parseFloat(listDetail.latitude), parseFloat(listDetail.longtiude), msg, true, false);
                $scope.putMarker(parseFloat(listDetail.latitude), parseFloat(listDetail.longtiude), 'N/A', true, false);
            };


//=========================================================================================
//============================Get, Save or Update and Calc Rating Index of User Posts Rating======================================
//=========================================================================================
            /**
             * Listen to Users Rating on User Posts and act accordingly
             **/
            $scope.listDetailRateListner = function(listId, intractionId, prevRate, userRate){
                $scope.listId = listId;
                if($scope.userId > 0){
                    $scope.userPrevRate = prevRate;
                    if($scope.userPrevRate !== null && $scope.userPrevRate > 0){
                        $scope.updateUserRate(intractionId, $scope.today, userRate, function(){
                            $scope.getRecentUserEssListDetail($scope.userId);
                        });
                    }else{
                        $scope.addUserRate($scope.userId, listId, $scope.today, userRate, 'list', function(){
                            $scope.getRecentUserEssListDetail($scope.userId);
                        });
                    }
                }else{
                    toaster.pop('success', "Success", "In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!");
                    $scope.logInReminderMsg = 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!';
                    $scope.go('/login');
                }
            };

            $scope.saveListComment = function() {
                if($scope.UserEssListInfo.intraction_id != null){
                    dataFactory.addUserComment($scope.UserEssListInfo.intraction_id, $scope.userComment, $scope.today, function(data){
                        $scope.getAllListComments($scope.UserEssListInfo.list_id);
                        $scope.userComment='';
                    });
                }else{
                    $scope.addUserIntraction($scope.userId, $scope.UserEssListInfo.list_id, $scope.today, 0, 'list', function(userIntraction){
                        dataFactory.addUserComment(userIntraction.insertId, $scope.userComment, $scope.today, function(data){
                            $scope.getAllListComments($scope.UserEssListInfo.list_id);
                            $scope.userComment='';
                        });
                    });
                }
            };

            $scope.getAllListComments = function(listId){
                dataFactory.getUserListComment(listId, $scope.today)
                    .query({listId: $routeParams.listId}, function (userEssComments) {
                        if(userEssComments != null){
                            $scope.getListUserComment(userEssComments, function(allEssComments){
                                $scope.userEssComments = allEssComments;
                                console.log('userRating= '+ JSON.stringify($scope.userEssComments));
                            });
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getListUserComment = function(essComments, callback){
                var i, len = essComments.length;
                var allEssUserComments = [];
                for(i=0; i<len; i++){
                    if(parseInt(essComments[i].user_id) === parseInt($scope.userId)){
                        //console.log('@ If clause equal true');
                        allEssUserComments.push({
                            user_id: essComments[i].user_id,
                            user_photo: essComments[i].user_photo,
                            list_id: essComments[i].list_id,
                            screen_name: essComments[i].screen_name,
                            user_comment: essComments[i].user_comment,
                            comment_date: essComments[i].comment_date,
                            user_comment_id: essComments[i].user_comment_id,
                            time_diff: essComments[i].timeDiff,
                            user_comment_prev: "true"});
                    }else{
                        //console.log('@ else clause equal false');
                        allEssUserComments.push({
                            user_id: essComments[i].user_id,
                            user_photo: essComments[i].user_photo,
                            list_id: essComments[i].list_id,
                            screen_name: essComments[i].screen_name,
                            user_comment: essComments[i].user_comment,
                            comment_date: essComments[i].comment_date,
                            user_comment_id: essComments[i].user_comment_id,
                            time_diff: essComments[i].timeDiff,
                            user_comment_prev: "false"});
                    }
                }
                console.log('Comments With Time Diff= '+JSON.stringify(allEssUserComments));
                callback(allEssUserComments);
            };

            $scope.getAllListComments($scope.listId);

//===============================Get This User Rating=====================================================================

            getTopEssentials();

            function getTopEssentials(){
                $scope.getTopEss(3, function(topEss){
                    $scope.topEssentials = topEss;
                });
            }

            getTopEvents();

            function getTopEvents(){
                $scope.getTopEvents(function(topEvents){
                    $scope.topEvents = topEvents;
                });
            }
//================================================================================================
//================================================================================================
//================================================================================================
            $scope.getRecentUserEssListDetail = function(userId){
                $scope.recentUserList = [];
                dataFactory.getRecentListForExplore(userId)
                    .query(function (recentUserLists) {
                        if(recentUserLists != null){
                            var i, len = recentUserLists.length;
                            for(i=0;i<len;i++) {
                                //$scope.recentUserList = recentUserLists;
                                $scope.recentUserList.push(
                                    {
                                        list_id: recentUserLists[i].list_id,
                                        user_id: recentUserLists[i].user_id,
                                        created_on_date: recentUserLists[i].created_on_date,
                                        list_title: recentUserLists[i].list_title,
                                        list_desc: recentUserLists[i].list_desc,

                                        screen_name: recentUserLists[i].screen_name,

                                        user_photo: recentUserLists[i].user_photo,
                                        //rate_index: recentUserLists[i].rate_index,
                                        rate_index: Number(parseFloat(recentUserLists[i].rate_index)).toFixed(1),
                                        intraction_id: recentUserLists[i].intraction_id,

                                        intract_with: recentUserLists[i].intract_with,
                                        user_rate: recentUserLists[i].user_rate,
                                        intraction_date: recentUserLists[i].intraction_date,
                                        saved_rate: recentUserLists[i].intraction_id
                                    });
                            }
                            $scope.getListDetail($scope.recentUserList);
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getListDetail = function(allList){
                var i, len = allList.length;
                for(i=0;i<len;i++) {
                    if(allList[i].list_id == $scope.listId){
                        $scope.UserEssListInfo = allList[i];
                    }
                }
            };

            $scope.getRecentUserEssListDetail($scope.userId);

            $scope.getEventUserRateIndex = function(userId){
                $scope.eventWithUserRateIndex = [];
                dataFactory.getEventsWithUserRatingIndex(userId)
                    .query(function (eventWithRateIndex) {
                        if(eventWithRateIndex != null){
                            var i, len = eventWithRateIndex.length;
                            for(i=0;i<len;i++) {
                                $scope.eventWithUserRateIndex.push(
                                    {
                                        event_id: eventWithRateIndex[i].event_id,
                                        user_id: eventWithRateIndex[i].user_id,
                                        event_name: eventWithRateIndex[i].event_name,
                                        event_desc: eventWithRateIndex[i].event_desc,
                                        event_location: eventWithRateIndex[i].event_location,
                                        catagory_name: eventWithRateIndex[i].catagory_name,
                                        event_date: eventWithRateIndex[i].event_date,
                                        start_time: eventWithRateIndex[i].start_time,

                                        screen_name: eventWithRateIndex[i].screen_name,

                                        user_photo: eventWithRateIndex[i].user_photo,
                                        rate_index: Number(parseFloat(eventWithRateIndex[i].rate_index)).toFixed(1),
                                        intraction_id: eventWithRateIndex[i].intraction_id,

                                        intract_with: eventWithRateIndex[i].intract_with,
                                        user_rate: eventWithRateIndex[i].user_rate,
                                        intraction_date: eventWithRateIndex[i].intraction_date,
                                        saved_rate: eventWithRateIndex[i].intraction_id
                                    });
                            }
                            console.log('Event Array= '+JSON.stringify($scope.eventWithUserRateIndex));
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getEventUserRateIndex($scope.userId);
        }])
//===============================================================================
    .controller('ExploreEssCtrl', ['$scope', '$rootScope', '$routeParams', 'toaster', 'dataFactory',
        function ($scope, $rootScope, $routeParams, toaster, dataFactory) {

//=======================================================================================



//=========================================================================================
//============================Get, Save or Update and Calc Rating Index of User Posts Rating======================================
//=========================================================================================
            /**
             * Listen to Users Rating on User Posts and act accordingly
             **/
            $scope.exploreRateListner = function(listId, intractionId, prevRate, userRate){
                $scope.listId = listId;
                if($scope.userId > 0){
                    $scope.userPrevRate = prevRate;
                    if($scope.userPrevRate !== null && $scope.userPrevRate > 0){
                        $scope.updateUserRate(intractionId, $scope.today, userRate, function(){
                            $scope.getRecentUserEssList($scope.userId);
                        });
                    }else{
                        $scope.addUserRate($scope.userId, listId, $scope.today, userRate, 'list', function(){
                            $scope.getRecentUserEssList($scope.userId);
                        });
                    }
                }else{
                    toaster.pop('success', "Success", "In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!");
                    $scope.logInReminderMsg = 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!';
                    $scope.go('/login');
                }
            };


            /**
             * Listen to Users Rating on Events and act accordingly
             **/
            $scope.exploreEventRateListner = function(eventId, intractionId, prevRate, userRate){
                $scope.eventId = eventId;
                if($scope.userId > 0){
                    if(prevRate !== null && intractionId > 0){
                        $scope.updateUserRate(intractionId, $scope.today, userRate, function(){
                            $scope.getEventUserRateIndex($scope.userId);
                        });
                    }else{
                        $scope.addUserRate($scope.userId, eventId, $scope.today, userRate, 'event', function(){
                            $scope.getEventUserRateIndex($scope.userId);
                        });
                    }
                }else{
                    toaster.pop('success', "Success", "In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!");
                    $scope.logInReminderMsg = 'In order to Rate, Comment, Post Event or Post Classified you Need to have an Addis Essentials Account!';
                    $scope.go('/login');
                }
            };

//===============================Get This User Rating=====================================================================

            getTopEssentials();

            function getTopEssentials(){
                $scope.getTopEss(3, function(topEss){
                    $scope.topEssentials = topEss;
                });
            }

            getTopEvents();

            function getTopEvents(){
                $scope.getTopEvents(function(topEvents){
                    $scope.topEvents = topEvents;
                });
            }
//================================================================================================
//================================================================================================
//================================================================================================
            $scope.getRecentUserEssList = function(userId){
                $scope.recentUserList = [];
                dataFactory.getRecentListForExplore(userId)
                    .query(function (recentUserLists) {
                        if(recentUserLists != null){
                            var i, len = recentUserLists.length;
                            for(i=0;i<len;i++) {
                                //$scope.recentUserList = recentUserLists;
                                $scope.recentUserList.push(
                                    {
                                        list_id: recentUserLists[i].list_id,
                                        user_id: recentUserLists[i].user_id,
                                        created_on_date: recentUserLists[i].created_on_date,
                                        list_title: recentUserLists[i].list_title,
                                        list_desc: recentUserLists[i].list_desc,

                                        screen_name: recentUserLists[i].screen_name,

                                        user_photo: recentUserLists[i].user_photo,
                                        //rate_index: recentUserLists[i].rate_index,
                                        rate_index: Number(parseFloat(recentUserLists[i].rate_index)).toFixed(1),
                                        intraction_id: recentUserLists[i].intraction_id,

                                        intract_with: recentUserLists[i].intract_with,
                                        user_rate: recentUserLists[i].user_rate,
                                        intraction_date: recentUserLists[i].intraction_date,
                                        saved_rate: recentUserLists[i].intraction_id
                                    });

                            }
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getRecentUserEssList($scope.userId);

            $scope.getEventUserRateIndex = function(userId){
                $scope.eventWithUserRateIndex = [];
                dataFactory.getEventsWithUserRatingIndex(userId)
                    .query(function (eventWithRateIndex) {
                        if(eventWithRateIndex != null){
                            var i, len = eventWithRateIndex.length;
                            for(i=0;i<len;i++) {
                                $scope.eventWithUserRateIndex.push(
                                    {
                                        event_id: eventWithRateIndex[i].event_id,
                                        user_id: eventWithRateIndex[i].user_id,
                                        event_name: eventWithRateIndex[i].event_name,
                                        event_desc: eventWithRateIndex[i].event_desc,
                                        event_location: eventWithRateIndex[i].event_location,
                                        catagory_name: eventWithRateIndex[i].catagory_name,
                                        event_date: eventWithRateIndex[i].event_date,
                                        start_time: eventWithRateIndex[i].start_time,

                                        screen_name: eventWithRateIndex[i].screen_name,

                                        user_photo: eventWithRateIndex[i].user_photo,
                                        event_logo: eventWithRateIndex[i].event_logo,
                                        rate_index: Number(parseFloat(eventWithRateIndex[i].rate_index)).toFixed(1),
                                        intraction_id: eventWithRateIndex[i].intraction_id,

                                        intract_with: eventWithRateIndex[i].intract_with,
                                        user_rate: eventWithRateIndex[i].user_rate,
                                        intraction_date: eventWithRateIndex[i].intraction_date,
                                        saved_rate: eventWithRateIndex[i].intraction_id
                                    });
                            }
                            console.log('Event Array= '+JSON.stringify($scope.eventWithUserRateIndex));
                        }else{
                            console.log('Error happned no branchs found by this essentials');
                        }
                    });
            };

            $scope.getEventUserRateIndex($scope.userId);

        }]);