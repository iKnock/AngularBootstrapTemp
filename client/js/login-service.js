angular.module('myApp.logInServ', ['facebook'])
    .service('logInService', ['Facebook',

        function (Facebook, $scope, $http, $timeout) {
            var logInService = {};

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
            logInService.IntentLogin = function() {
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
                            //user FB profile already saved
                            $scope.initUser(userInfo[0].user_id, true, false, userInfo[0].screen_name, 'Logged In');
                            //Authenticate
                            $scope.user.name = userInfo[0].email;
                            $scope.user.password = 'usingFacebook';
                            $scope.logInByEmail();
                        }else{
                            //user FB profile is not saved yet so save properly
                            dataFactory.addUser(user.name,user.first_name,user.email,'usingFacebook', user.gender, user.id, 'photo', 'Indiv',
                                'User connected using FB', '1', function(savedUser){
                                    $scope.initUser(savedUser.insertId, true, false, user.first_name, 'Logged In');

                                    $scope.user.name = user.email;
                                    $scope.user.password = 'usingFacebook';
                                    $scope.logInByEmail();
                                });
                        }
                    });
            };

            /**
             * Logout
             */
            logInService.logout = function() {
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
        }]);//end dataSyncService

//==============================================================================
//==============================================================================
        /*this.getLastSync = function (callback) {
            //initDatabase();
                db.transaction(
                    function(tx) {
                        var sql = "SELECT MAX(lastModified) as lastSync FROM tbl_catagory";
                        tx.executeSql(sql, this.txErrorHandler,
                            function(tx, results) {
                                var lastSync = results.rows.item(0).lastSync;
                                console.log('Last local timestamp is ' + lastSync);
                                callback(lastSync);
                            }
                        );
                    }
                );
            }

            this.sync = function(callback) {

                var self = this;
                console.log('Starting synchronization...');
                this.getLastSync(function(lastSync){
                    self.getChanges(self.syncURL, lastSync,
                        function (changes) {
                            if (changes.length > 0) {
                                self.applyChanges(changes, callback);
                            } else {
                                console.log('Nothing to synchronize');
                                callback();
                            }
                        }
                    );
                });
            }

            this.getChanges = function(syncURL, modifiedSince, callback) {

                $.ajax({
                    url: syncURL,
                    data: {modifiedSince: modifiedSince},
                    dataType:"json",
                    success:function (data) {
                        console.log("The server returned " + data.length + " changes that occurred after " + modifiedSince);
                        callback(data);
                    },
                    error: function(model, response) {
                        alert(response.responseText);
                    }
                });

            }

            */
