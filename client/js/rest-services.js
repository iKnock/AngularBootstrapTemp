'use strict';            

angular.module('myApp.restServices', ['ngResource'])
    .factory('dataFactory', ['$resource',
        function ($resource) {
            var urlBase = 'http://localhost:3000/api';
            var dataFactory = {};

//=============================================================================================================
//======================================================================================================
//================================================================================================================
            dataFactory.getTweets = function () {//get tweets                
                return $resource(urlBase + '/' + 'tweets', {});
            };

            dataFactory.getEvents = function () {//get events                
                return $resource(urlBase + '/' + 'events', {});
            };
//=============================================================================================
//======================App User Management====================================================
//=============================================================================================
            dataFactory.getFBuser = function (socialId) {//by socialId
                return $resource(urlBase + '/user/fb/' + socialId, {});
            };

            //POST============================================================
            dataFactory.addUser = function (fullName, screenName, userEmail, passw, gender, socialId, userPhoto, userRole, userRemark, userStatus, callback) {//save facebook user
                var user = $resource(urlBase + '/user/fb/add', {}, {
                    'create': {method: 'POST'}
                });
                //console.log('@rest interId, uerComm, commentDate= '+ interactionId+ ' ' +userComm+' '+commentDate);
                return user.save({fullName: fullName, screenName: screenName, userEmail: userEmail, passw: passw, gender: gender,
                    socialId: socialId, userPhoto: userPhoto, userRole: userRole, userRemark: userRemark, userStatus: userStatus},
                    function(res, httpHeader){
                    callback(res.data);
                });
            };

//=============================================================================================================
//=======================Categories Services===============================================================================
//================================================================================================================

            dataFactory.getCategByLookup = function (lookupOf) {//by lookup_of
                return $resource(urlBase + '/category/' + lookupOf, {});
            };
//=============================================================================================================
//=======================Essentials List Services(search with all the branch info)============================
//================================================================================================================

            dataFactory.getEssGallery = function (essId) {
                return $resource(urlBase + '/ess/gallery/' + essId, {});
            };

            dataFactory.getTopEss = function () {//get top essentials
                return $resource(urlBase + '/user/ess/top/rateIndex', {});
            };

            dataFactory.getNearYouEssentials = function (lat, lng) {//get Near by essentials
                return $resource(urlBase + '/user/ess/nearYou/'+lat+'/'+lng, {});
            };
//=============================================================================================================
//=======================Essentials Detail Services(search with all the branch info)============================
//================================================================================================================
            dataFactory.getBranchPhones = function (id) {//by category_id (Essentials with there branchID)
                return $resource(urlBase + '/branch/phones/' + id, {});
            };

            dataFactory.getBranchHours = function (id) {//by category_id (Essentials with there branchID)
                return $resource(urlBase + '/branch/hours/' + id, {});
            };

            dataFactory.getBranchAddress = function (id) {//by category_id (Essentials with there branchID)
                return $resource(urlBase + '/branch/address/' + id, {});
            };

            dataFactory.getAllBranchAddress = function () {//featch all ess branch address with location for maping pourpose
                return $resource(urlBase + '/branch/all/address', {});
            };

            dataFactory.getEssBranchList = function (essId) {//by essId (Essentials with there branchID)
                return $resource(urlBase + '/branch/essBranch/' + essId, {});
            };

            dataFactory.getUserEssRate = function (userId, essId) {
                return $resource(urlBase + '/user/rate/userId', {});
            };

            dataFactory.getTotEssRating = function (essId) {
                return $resource(urlBase + '/user/rate/total/' + essId, {});
            };

            dataFactory.getUserEssComment = function (essId, currTimestamp) {
                return $resource(urlBase + '/user/comment/' + essId +'/'+currTimestamp, {});
            };

            dataFactory.getUserIntracByUserId = function (userId) {
                return $resource(urlBase + '/user/intraction/comment/' + userId, {});
            };

//=============================================================================================================
//===========================User Rating Service===========================================================
//=============================================================================================================
            //POST============================================================
            dataFactory.addUserRate = function (userId, intractWithId, intractionDate, userRate, intractWith, callback) {//save user comment
                var userContRate = $resource(urlBase + '/user/intraction/rate/add', {}, {
                    'create': {method: 'POST'}
                });
                //console.log('@rest interId, uerComm, commentDate= '+ interactionId+ ' ' +userComm+' '+commentDate);
                return userContRate.save({userId: userId, essId: intractWithId, rateDate: intractionDate, userRate: userRate, status: '0', intractWith: intractWith}, function(res, httpHeader){
                    callback(res.data);
                });
            };

            //PUT============================================================
            dataFactory.updateUserRate = function (intractionId, intractionDate, userRate, callback) {//update uom
                var userContRate = $resource(urlBase + '/user/intraction/rate/update', {}, {
                    'update': {method: 'PUT', params: {intractionId: '@intractionId'}}
                });
                return userContRate.update({intractionId: intractionId},{intractionId: intractionId, rateDate: intractionDate, userRate: userRate, status: '1'}, function(res, httpHeader){
                    callback(res.data);
                });
            };

//=============================================================================================================
//===========================User Commenting Service===========================================================
//=============================================================================================================
            //POST comment on Essentials============================================================
            dataFactory.addUserComment = function (interactionId, userComm, commentDate, callback) {//save user comment
                var userComment = $resource(urlBase + '/user/intraction/comment/add', {}, {
                    'create': {method: 'POST'}
                });
                console.log('@rest interId, uerComm, commentDate= '+ interactionId+ ' ' +userComm+' '+commentDate);
                return userComment.save({intractionId: interactionId, userComment: userComm, commentDate: commentDate}, function(res, httpHeader){
                    callback(res.data);
                });
            };

            //DELETE============================================================
            dataFactory.deleteComment = function (userCommentId, callback) {//delete user comment
                var userComment = $resource(urlBase + '/' + 'user/intraction/comment/delete/' + userCommentId, {}, {
                    'delete': {method: 'DELETE'}
                });
                return userComment.delete({}, function(res, httpHeader){
                    callback(res.data);
                });
            };
//=============================================================================================================
//===========================Essentials CheckIn Service===========================================================
//=============================================================================================================

            dataFactory.getUserCheckInStatus = function (userId, checkInDate, essId) {//get User check in status
                return $resource(urlBase + '/user/intraction/checkIn/status/'+userId+'/'+checkInDate+'/'+essId, {});
            };

            //POST checkIn on Essentials============================================================
            dataFactory.addUserCheckIn = function (interactionId, userCheckIn, checkInDate, callback) {//save user checkIn
                var userCheckInInfo = $resource(urlBase + '/user/intraction/checkIn/add', {}, {
                    'create': {method: 'POST'}
                });
                console.log('@rest interId, uerCheckIn, checkInDate= '+ interactionId+ ' ' +userCheckIn+' '+checkInDate);
                return userCheckInInfo.save({intractionId: interactionId, userCheckIn: userCheckIn, checkInDate: checkInDate, remark: 'userCheckIn'}, function(res, httpHeader){
                    callback(res.data);
                });
            };

            //DELETE checkIn ============================================================
            dataFactory.deleteCheckIn = function (userCheckInId, callback) {//delete user CheckIn
                var userComment = $resource(urlBase + '/' + 'user/intraction/checkIn/delete/' + userCheckInId, {}, {
                    'delete': {method: 'DELETE'}
                });
                return userComment.delete({}, function(res, httpHeader){
                    callback(res.data);
                });
            };

//================================================================================================
//=============================================================================================================
//=======================Event Services===============================================================================
//================================================================================================================
//================================================================================================

            dataFactory.getEventDetails = function (eventId, userId) {//get event detail with address and logedIn user info
                return $resource(urlBase + '/user/events/details/'+ eventId +'/'+ userId, {});
            };

            dataFactory.getTopEvents = function () {//get top classified
                return $resource(urlBase + '/user/events/top/rateIndex', {});
            };

            dataFactory.getAllEventsByUserId = function (userId) {//get all events by user id
                return $resource(urlBase + '/user/userEvents/'+ userId, {});
            };

            dataFactory.getEventsWithUserRatingIndex = function (userId) {//get all events with userRatingIndex by user id
                return $resource(urlBase + '/user/events/interaction/userRate/rateIndex/'+ userId, {});
            };

            dataFactory.getUserEventComments = function (eventId) {//get all events comments
                return $resource(urlBase + '/user/events/comment/'+ eventId, {});
            };

            //Event CRUD
            //POST============================================================
            dataFactory.createEvent = function (userId, event, pictureUrl, callback) {//save classified
                var classified = $resource(urlBase + '/user/events/add', {}, {
                    'create': {method: 'POST'}
                });
                return classified.save(
                    {
                        userId: userId,
                        eventCategory: event.event_category.catagory_id,
                        eventName: event.event_name,
                        eventDesc: event.event_desc,
                        eventDate: event.event_date,
                        startTime: event.start_time,
                        eventFrequency: event.event_frequency.catagory_name,
                        eventLogo: pictureUrl,
                        eventPlace: event.event_place.ess_id,
                        eventOrganizer: event.event_organizer,
                        eventFee: event.event_fee,
                        eventStatus: '1',//Active status 1
                        eventRemark: 'remark'
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };

            //DELETE============================================================
            dataFactory.deleteEvent = function (eventId, callback) {//delete classified
                var classified = $resource(urlBase + '/user/events/delete/' + eventId, {}, {
                    'delete': {method: 'DELETE'}
                });
                return classified.delete({}, function(res, httpHeader){
                    callback(res.data);
                });
            };


//================================================================================================
//================================================================================================
//================================================================================================
//========================GET ALL List OF USERS FOR EXPLORE============================================================
            dataFactory.getRecentListForExplore = function (userId) {//get all user list order by recent date
                return $resource(urlBase + '/user/ess/explore/list/all/'+userId, {});
            };

            dataFactory.getUserListComment = function (listId, currTimestamp) {
                return $resource(urlBase + '/user/list/comment/' + listId +'/'+currTimestamp, {});
            };

            //GET ALL List OF USERS FOR EXPLORE============================================================
            dataFactory.getUserEssList = function () {//get all user list order by recent date
                return $resource(urlBase + '/user/ess/explore/list/all', {});
            };

            dataFactory.getUserEssListDetails = function (listId) {//get list details by listId
                return $resource(urlBase + '/user/ess/list/get/details/'+ listId, {});
            };

            //POST============================================================
            dataFactory.createEssList = function (userId, listInfo, callback) {//save essentials list
                var essList = $resource(urlBase + '/user/ess/list/add', {}, {
                    'create': {method: 'POST'}
                });
                return essList.save(
                    {
                        userId: userId,
                        createdOnDate: listInfo.createdDate,
                        listTitle: listInfo.listTitle,
                        listStory: listInfo.listStory,
                        status: '1',
                        remark: 'remark'
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };

            //POST============================================================
            dataFactory.createEssListDetail = function (listId, i, listInfoDetail, callback) {//save essentials list
                var essList = $resource(urlBase + '/user/ess/list/detail/add', {}, {
                    'create': {method: 'POST'}
                });
                return essList.save(
                    {
                        listId: listId,
                        essId: listInfoDetail.ess_id,
                        rank: i,
                        status: 'status',
                        remark: listInfoDetail.remark
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };

            //DELETE============================================================
            dataFactory.deleteUserList = function (listId, callback) {//delete list
                var userList = $resource(urlBase + '/user/ess/list/delete/' + listId, {}, {
                    'delete': {method: 'DELETE'}
                });
                return userList.delete({}, function(res, httpHeader){
                    callback(res.data);
                });
            };

            //DELETE============================================================
            dataFactory.deleteAllUserList = function (listId, callback) {//delete list
                var userList = $resource(urlBase + '/user/ess/all/list/detail/delete/' + listId, {}, {
                    'delete': {method: 'DELETE'}
                });
                return userList.delete({}, function(res, httpHeader){
                    callback(res.data);
                });
            };

            //DELETE============================================================
            dataFactory.deleteListDetails = function (listDetailId, callback) {//delete list details
                var listDetail = $resource(urlBase + '/user/ess/list/detail/delete/' + listDetailId, {}, {
                    'delete': {method: 'DELETE'}
                });
                return listDetail.delete({}, function(res, httpHeader){
                    callback(res.data);
                });
            };
//================================================================================================
//================================================================================================
//================================================================================================
            //POST============================================================
            dataFactory.createEssentials = function (userId, ess, pictureUrl, callback) {//save essentials
                var essentials = $resource(urlBase + '/user/ess/info/insert/add', {}, {
                    'create': {method: 'POST'}
                });
                return essentials.save(
                    {
                        user_id: userId,
                        catagory_id: ess.ess_category.catagory_id,
                        ess_name: ess.ess_name,
                        est_on_date: 'N/A',
                        ess_logo: pictureUrl,
                        map_marker: 'bar.png',
                        moto: 'N/A',
                        status: '1',
                        remark: ess.ess_category.catagory_name
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };

            //POST============================================================
            dataFactory.createBranch = function (essId, ess, callback) {//save essentials branch
                var branchModel = $resource(urlBase + '/user/branch/info/insert/add', {}, {
                    'create': {method: 'POST'}
                });
                return branchModel.save(
                    {
                        ess_id: essId,
                        branch_type: 'Head Offices',
                        branch_name: ess.ess_name,
                        open_since:'N/A',
                        status: '1',
                        remark: ess.ess_category.catagory_name
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };

            //POST============================================================
            dataFactory.createAddress = function (branchId, ess, callback) {//save essentials address
                var addressModel = $resource(urlBase + '/user/address/info/insert/add', {}, {
                    'create': {method: 'POST'}
                });
                return addressModel.save(
                    {
                        branch_id: branchId,
                        country: 'Ethiopia',
                        city: ess.city,
                        sub_city: 'subCity',
                        email: ess.email,
                        website: ess.website,
                        facebook: 'https://facebook.com/'+ess.facebook,
                        twitter: 'https://twitter.com/'+ess.twitter,
                        google_plus: 'https://plus.google.com/'+ess.google_plus,
                        pobox: ess.pobox,
                        local_name: ess.local_name,
                        latitude: ess.lat,
                        longtiude: ess.lng
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };

            //POST============================================================
            dataFactory.createPhone = function (branchId, ess, callback) {//save essentials phone
                var phoneModel = $resource(urlBase + '/user/phone/info/insert/add', {}, {
                    'create': {method: 'POST'}
                });
                return phoneModel.save(
                    {
                        branch_id: branchId,
                        phone_num: ess.phone_num,
                        type: 'type'
                    }, function(res, httpHeader){
                        callback(res.data);
                    });
            };


            return dataFactory;
        }]);