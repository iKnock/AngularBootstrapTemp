/**
 * Created by iknock on 9/17/2014.
 */

var http = require('http');
var connection = require('../config/dbConfig');
var config = require('../config/config');
var FB = require('fb');
var Step = require('step');


exports.findUserEssRate = function(req, res) {
    var userId = parseInt(req.params.userId);
    var essId = parseInt(req.params.essId);
    console.log('UserId= '+userId);
    console.log('EssId= '+essId);
    connection.query("SELECT * " +
        "FROM tbl_zuiv_user zu " +
        "INNER JOIN `tbl_user_interaction` ui " +
        "ON ui.user_id = zu.user_id " +
        "INNER JOIN tbl_essentials es " +
        "ON es.ess_id    = ui.intract_with " +
        "WHERE es.ess_id = " +essId, function(err, rows){
        res.json(rows);
    });
};

/**exports.findUserRate = function(req, res) {
    var userId = parseInt(req.params.userId);
    var essId = parseInt(req.params.essId);
    console.log('UserId= '+userId);
    console.log('EssId= '+essId);
    connection.query("SELECT * " +
        "FROM tbl_zuiv_user zu " +
        "INNER JOIN `tbl_user_interaction` ui " +
        "ON ui.user_id = zu.user_id " +
        "INNER JOIN tbl_essentials es " +
        "ON es.ess_id    = ui.intract_with " +
        "WHERE es.ess_id = " +essId+
        "AND zu.user_id  = " +userId, function(err, rows){
        res.json(rows);
    });
};**/

exports.findEssTotRating = function(req, res) {
    var essId = parseInt(req.params.essId);
    console.log('EssId= '+essId);
    connection.query("SELECT DISTINCT zu.user_id, " +
        "  COUNT(zu.user_id) num_of_user, " +
        "  SUM(ui.user_rate) tot_user_rate, " +
        "  ui.user_rate, " +
        "  es.ess_id, " +
        "  es.ess_name " +
        "FROM tbl_essentials es " +
        "INNER JOIN `tbl_user_interaction` ui " +
        "ON es.ess_id = ui.intract_with " +
        "INNER JOIN tbl_zuiv_user zu " +
        "ON ui.user_id  = zu.user_id " +
        "WHERE ui.remark = 'ess' && es.ess_id= " +essId, function(err, rows){
        res.json(rows);
    });
};

exports.findCommentsByEssId = function(req, res) {
    var essId = parseInt(req.params.essId);
    var now = req.params.currTimestamp;
    console.log('Current TIme Stamp= '+now);
    connection.query("SELECT COALESCE(USER_COMMENT.user_id, 0) user_id, " +
        "  COALESCE(USER_COMMENT.user_photo, 'profilePic.jpg') user_photo, " +
        "  COALESCE(USER_COMMENT.ess_id, 0) ess_id, " +
        "  COALESCE(USER_COMMENT.user_comment_id, 0) user_comment_id, " +
        "  COALESCE(USER_COMMENT.screen_name, 'N/A') screen_name, " +
        "  COALESCE(USER_COMMENT.user_comment, 'N/A') user_comment, " +
        "  COALESCE(USER_COMMENT.comment_date, '') comment_date, " +
        "  TIMESTAMPDIFF(MINUTE, USER_COMMENT.comment_date, NOW()) AS timeDiff " +
        "FROM " +
        "  (SELECT uc.comment_date, " +
        "    uc.user_comment, " +
        "    zu.user_id, " +
        "    zu.screen_name, " +
        "    COALESCE(zu.user_photo, 'profilePic.jpg') user_photo, " +
        "    es.ess_id, " +
        "    uc.user_comment_id " +
        "  FROM tbl_essentials es " +
        "  INNER JOIN `tbl_user_interaction` ui " +
        "  ON es.ess_id = ui.intract_with " +
        "  INNER JOIN tbl_zuiv_user zu " +
        "  ON ui.user_id = zu.user_id " +
        "  INNER JOIN tbl_user_comment uc " +
        "  ON uc.intraction_id = ui.intraction_id " +
        "  WHERE ui.remark     = 'ess' " +
        "    && es.ess_id      = ? " +
        "  ) USER_COMMENT", [essId], function(err, rows){
        res.json(rows);
        //console.log('comments= '+JSON.stringify(rows));
    });
};

exports.findCommentsByListId = function(req, res) {
    var listId = parseInt(req.params.listId);
    var now = req.params.currTimestamp;
    console.log('Current TIme Stamp= '+now);
    connection.query("SELECT COALESCE(USER_COMMENT.user_id, 0) user_id, " +
        "  COALESCE(USER_COMMENT.user_photo, 'profilePic.jpg') user_photo, " +
        "  COALESCE(USER_COMMENT.list_id, 0) list_id, " +
        "  COALESCE(USER_COMMENT.user_comment_id, 0) user_comment_id, " +
        "  COALESCE(USER_COMMENT.screen_name, 'N/A') screen_name, " +
        "  COALESCE(USER_COMMENT.user_comment, 'N/A') user_comment, " +
        "  COALESCE(USER_COMMENT.comment_date, '') comment_date, " +
        "  TIMESTAMPDIFF(MINUTE, USER_COMMENT.comment_date, NOW()) AS timeDiff " +
        "FROM " +
        "  (SELECT uc.comment_date, " +
        "    uc.user_comment, " +
        "    zu.user_id, " +
        "    zu.screen_name, " +
        "    COALESCE(zu.user_photo, 'profilePic.jpg') user_photo, " +
        "    es.list_id, " +
        "    uc.user_comment_id " +
        "  FROM tbl_user_list es " +
        "  INNER JOIN `tbl_user_interaction` ui " +
        "  ON es.list_id = ui.intract_with " +
        "  INNER JOIN tbl_zuiv_user zu " +
        "  ON ui.user_id = zu.user_id " +
        "  INNER JOIN tbl_user_comment uc " +
        "  ON uc.intraction_id = ui.intraction_id " +
        "  WHERE ui.remark     = 'list' " +
        "    && es.list_id      = ? " +
        "  ) USER_COMMENT", [listId], function(err, rows){
        res.json(rows);
        //console.log('comments= '+JSON.stringify(rows));
    });
};

exports.findUserIntractionByUserId = function(req, res) {
    var userId = parseInt(req.params.userId);
    console.log('userId= '+userId);
    connection.query("SELECT * " +
        "FROM tbl_essentials es " +
        "INNER JOIN `tbl_user_interaction` ui " +
        "ON es.ess_id = ui.intract_with " +
        "INNER JOIN tbl_zuiv_user zu " +
        "ON ui.user_id   = zu.user_id " +
        "WHERE ui.remark = 'ess' " +
        "  && zu.user_id = "+ userId, function(err, rows){
        res.json(rows);
    });
};

exports.rateContent = function(req, res) {
    console.log("RateContent called= "+ JSON.stringify(req.body));
    connection.query('INSERT ' +
            'INTO `tbl_user_interaction` ' +
            '  ( ' +
            '    `user_id`, ' +
            '    `intract_with`, ' +
            '    `intraction_date`, ' +
            '    `user_rate`, ' +
            '    `status`, ' +
            '    `remark` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.userId + '", ' +
            '    "' + req.body.essId + '", ' +
            '    "' + req.body.rateDate + '", ' +
            '    "' + req.body.userRate + '", ' +
            '    "' + req.body.status + '", ' +
            '    "' + req.body.intractWith + '" ' +
            '  )',
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    '',
                    id:     results.insertId
                });
                console.log('Inserted success '+results.insertId);
            }
        });
};

exports.updateContentRate = function(req, res) {
    console.log("updateContentRate= "+ JSON.stringify(req.body));

    connection.query("UPDATE `tbl_user_interaction` " +
            "SET `intraction_date`      = '" +req.body.rateDate+ "', " +
            "  `user_rate`   = '" +req.body.userRate+ "', " +
            "  `status`        = '" +req.body.status+ "' " +
            "WHERE `intraction_id`= " + req.body.intractionId,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    err:    ''
                });
                console.log('updated success');
            }
        });
};

exports.addComment = function(req, res) {
    console.log("Body= "+ JSON.stringify(req.body));
    connection.query('INSERT ' +
            'INTO `tbl_user_comment` ' +
            '  ( ' +
            '    `intraction_id`, ' +
            '    `user_comment`, ' +
            '    `comment_date`, ' +
            '    `remark` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.intractionId + '", ' +
            '    "' + req.body.userComment + '", ' +
            '    "' + req.body.commentDate + '", ' +
            '    "remark" ' +
            '  )',
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    '',
                    id:     results.insertId
                });
                console.log('Inserted success '+results.insertId);
            }
        });
};

exports.deleteComment = function(req, res) {
    var userCommentId = parseInt(req.params.userCommentId);
    console.log("Body= "+ JSON.stringify("userCommentId= "+userCommentId));
    connection.query('DELETE FROM tbl_user_comment where tbl_user_comment.user_comment_id = '+userCommentId,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    ''
                });
                console.log('Deleted Very very success!!!!');
            }
        });
};

//====================User Ess CheckIn================================
//================================================================
//================================================================

exports.findUserCheckInStatus = function(req, res) {
    var chkInDate = req.params.checkInDate;
    var userId = parseInt(req.params.userId);
    var essId = parseInt(req.params.essId);
    console.log('checkInDate: ' + chkInDate);
    console.log('userId: ' + userId);
    var queryString = "SELECT ck.`user_check_in_id`, " +
        "  ck.`intraction_id`, " +
        "  ck.`check_in`, " +
        "  ck.`check_in_date`, " +
        "  ck.`remark` " +
        "FROM `tbl_user_check_in` ck " +
        "INNER JOIN `tbl_user_interaction` ui " +
        "ON ck.intraction_id = ui.intraction_id " +
        "INNER JOIN tbl_essentials ess " +
        "ON ess.ess_id        = ui.intract_with " +
        "WHERE ck.check_in_date = ?" +
        "AND ui.remark        = 'ess' " +
        "AND ess.ess_id       = ? " +
        "AND ui.user_id     = ?";
    connection.query(queryString, [chkInDate, essId, userId], function(err, rows){
        if (err) throw err;

        res.json(rows);
    });
};

exports.insertCheckIn = function(req, res) {
    console.log("Body= "+ JSON.stringify(req.body));
    connection.query('INSERT ' +
            'INTO `tbl_user_check_in` ' +
            '  ( ' +
            '    `intraction_id`, ' +
            '    `check_in`, ' +
            '    `check_in_date`, ' +
            '    `remark` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.intractionId + '", ' +
            '    "' + req.body.userCheckIn + '", ' +
            '    "' + req.body.checkInDate + '", ' +
            '    "' + req.body.remark + '" ' +
            '  )'  ,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    '',
                    id:     results.insertId
                });
                console.log('Inserted success '+results.insertId);
            }
        });
};

exports.deleteCheckIn = function(req, res) {
    var userCheckInId = parseInt(req.params.userCheckInId);
    connection.query('DELETE FROM `tbl_user_check_in` WHERE `user_check_in_id`= '+userCheckInId,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    ''
                });
                console.log('Deleted Very very success!!!!');
            }
        });
};

//=================================================================================
//==================User List CRUD=========================================================
//=================================================================================
exports.findAllUserList = function(req, res) {
    var userId = parseInt(req.params.userId);
    connection.query("SELECT * FROM `tbl_user_list` WHERE `user_id` ="+userId, function(err, rows){
        res.json(rows);
    });
};

exports.findRecentUsersList = function(req, res) {
    var userId = parseInt(req.params.userId);
    connection.query("SELECT USER_LIST.list_id, " +
            "  USER_LIST.user_id, " +
            "  USER_LIST.created_on_date, " +
            "  USER_LIST.list_title, " +
            "  USER_LIST.list_desc, " +
            "  USER_LIST.status, " +
            "  USER_LIST.remark, " +
            "  USER_LIST.screen_name, " +
            "  USER_LIST.user_photo, " +
            "  COALESCE(USER_LIST_RATE.user_id, 0) user_id, " +
            "  COALESCE(USER_LIST_RATE.intraction_id, 0) intraction_id, " +
            "  COALESCE(USER_LIST_RATE.intract_with,'0') intract_with, " +
            "  COALESCE(USER_LIST_RATE.user_rate,'0') user_rate, " +
            "  COALESCE(USER_LIST_RATE.intraction_date,'0') intraction_date, " +
            "  LIST_TOT_RATE.rate_index " +
            "FROM " +
            "  (SELECT DISTINCT COALESCE(ui.intraction_id, 0) intraction_id, " +
            "    COALESCE(ui.user_id, 0) user_id, " +
            "    COALESCE(ui.intract_with,'0') intract_with, " +
            "    COALESCE(ui.user_rate,'0') user_rate, " +
            "    COALESCE(ui.remark,'0') remark, " +
            "    COALESCE(ltt.list_id,'0') list_id, " +
            "    COALESCE(ui.intraction_date,'0') intraction_date, " +
            "    COALESCE((SUM(ui.user_rate) * 10) / (COUNT(ui.user_id) * 5) ,'0') rate_index " +
            "  FROM `tbl_user_interaction` ui " +
            "  INNER JOIN tbl_user_list ltt " +
            "  ON ltt.list_id  = ui.intract_with " +
            "  WHERE ui.remark = 'list' " +
            "  GROUP BY ltt.list_id " +
            "  ) LIST_TOT_RATE " +
            "RIGHT JOIN " +
            "  (SELECT lt.*, " +
            "    zu.screen_name, " +
            "    zu.user_photo " +
            "  FROM tbl_user_list lt " +
            "  INNER JOIN tbl_zuiv_user zu " +
            "  ON zu.user_id                    = lt.user_id " +
            "  ) USER_LIST ON USER_LIST.list_id = LIST_TOT_RATE.list_id " +
            "LEFT JOIN " +
            "  (SELECT COALESCE(USERS.user_id, 0) user_id, " +
            "    COALESCE(USERS.screen_name, '-') screen_name, " +
            "    COALESCE(USER_RATE.intraction_id, 0) intraction_id, " +
            "    COALESCE(USER_RATE.intract_with,'0') intract_with, " +
            "    COALESCE(USER_RATE.user_rate,'0') user_rate, " +
            "    COALESCE(USER_RATE.intraction_date,'0') intraction_date " +
            "  FROM " +
            "    ( SELECT DISTINCT COALESCE(zu.user_id, 0) user_id, " +
            "      COALESCE(zu.screen_name, 0) screen_name " +
            "    FROM tbl_zuiv_user zu " +
            "    ) USERS " +
            "  LEFT JOIN " +
            "    ( SELECT DISTINCT COALESCE(ui.intraction_id, 0) intraction_id, " +
            "      COALESCE(ui.user_id, 0) user_id, " +
            "      COALESCE(ui.intract_with,'0') intract_with, " +
            "      COALESCE(ui.user_rate,'0') user_rate, " +
            "      COALESCE(ui.intraction_date,'0') intraction_date " +
            "    FROM `tbl_user_interaction` ui " +
            "    WHERE ui.remark = 'list' " +
            "    ) USER_RATE " +
            "  ON USERS.user_id = USER_RATE.user_id " +
            "  WHERE USERS.user_id = ? " +
            "  ) USER_LIST_RATE ON USER_LIST_RATE.intract_with = USER_LIST.list_id " +
            "GROUP BY USER_LIST.list_id", [userId]
        , function(err, rows){
        res.json(rows);
    });
};

exports.findAllUserListDetails = function(req, res) {
    var listId = parseInt(req.params.listId);
    console.log('listId= '+listId);
    connection.query("SELECT USER_ESS_LIST.ess_id, " +
        "  USER_ESS_LIST.rank, " +
        "  USER_ESS_LIST.ess_logo, " +
        "  USER_ESS_LIST.remark, " +
        "  USER_ESS_LIST.list_detail_id, " +
        "  USER_ESS_LIST.list_id, " +
        "  USER_ESS_LIST.ess_name, " +
        "  USER_ESS_LIST.branch_id, " +
        "  USER_ESS_LIST.status, " +
        "  USER_ESS_LIST.latitude, " +
        "  USER_ESS_LIST.longtiude, " +
        "  COALESCE((SUM(USER_ESS_RATE.user_rate) * 10) / (COUNT(USER_ESS_RATE.user_id) * 5) ,0) rate_index " +
        "FROM " +
        "  (SELECT ld.rank, " +
        "    ld.remark, " +
        "    ld.list_detail_id, " +
        "    ld.list_id, " +
        "    ess.ess_id, " +
        "    br.branch_id, " +
        "    ess.ess_name, " +
        "    ad.latitude, " +
        "    ad.longtiude, " +
        "    ess.ess_logo, " +
        "    ld.status " +
        "  FROM `tbl_list_detail` ld " +
        "  INNER JOIN tbl_essentials ess " +
        "  ON ess.ess_id = ld.ess_id " +
        "  INNER JOIN tbl_branch br " +
        "  ON br.ess_id = ess.ess_id " +
        "  LEFT JOIN tbl_address ad " +
        "  ON ad.branch_id = br.branch_id " +
        "  ) USER_ESS_LIST " +
        "LEFT OUTER JOIN " +
        "  (SELECT COALESCE(USERS.user_id, 0) user_id, " +
        "    COALESCE(USERS.screen_name, '-') screen_name, " +
        "    COALESCE(USER_RATE.intraction_id, 0) intraction_id, " +
        "    COALESCE(USER_RATE.intract_with,0) intract_with, " +
        "    COALESCE(USER_RATE.user_rate,0) user_rate " +
        "  FROM " +
        "    ( SELECT DISTINCT COALESCE(zu.user_id, 0) user_id, " +
        "      COALESCE(zu.screen_name, 0) screen_name " +
        "    FROM tbl_zuiv_user zu " +
        "    ) USERS " +
        "  LEFT JOIN " +
        "    ( SELECT DISTINCT COALESCE(ui.intraction_id, 0) intraction_id, " +
        "      COALESCE(ui.user_id, 0) user_id, " +
        "      COALESCE(ui.intract_with,0) intract_with, " +
        "      COALESCE(ui.user_rate,0) user_rate, " +
        "      COALESCE(ui.intraction_date,0) intraction_date " +
        "    FROM `tbl_user_interaction` ui " +
        "    WHERE ui.remark = 'ess' " +
        "    ) USER_RATE " +
        "  ON USERS.user_id = USER_RATE.user_id " +
        "  ) USER_ESS_RATE ON USER_ESS_RATE.intract_with = USER_ESS_LIST.ess_id " +
        "WHERE USER_ESS_LIST.list_id =? " +
        "GROUP BY USER_ESS_LIST.ess_id", [listId], function(err, rows){
        res.json(rows);
    });
};

exports.insertUserList = function(req, res) {
    console.log("Body= "+ JSON.stringify(req.body));
    connection.query('INSERT ' +
            'INTO `tbl_user_list` ' +
            '  ( ' +
            '    `user_id`, ' +
            '    `created_on_date`, ' +
            '    `list_title`, ' +
            '    `list_desc`, ' +
            '    `status`, ' +
            '    `remark` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.userId + '", ' +
            '    "' + req.body.createdOnDate + '", ' +
            '    "' + req.body.listTitle + '", ' +
            '    "' + req.body.listStory + '", ' +
            '    "' + req.body.status + '", ' +
            '    "' + req.body.remark + '" ' +
            '  )',
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    '',
                    id:     results.insertId
                });
                console.log('Inserted success '+results.insertId);
            }
        });
};

exports.insertUserListDetails = function(req, res) {
    console.log("Body= "+ JSON.stringify(req.body));
    connection.query('INSERT ' +
            'INTO `tbl_list_detail` ' +
            '  ( ' +
            '    `list_id`, ' +
            '    `ess_id`, ' +
            '    `rank`, ' +
            '    `status`, ' +
            '    `remark` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.listId + '", ' +
            '    "' + req.body.essId + '", ' +
            '    "' + req.body.rank + '", ' +
            '    "' + req.body.status + '", ' +
            '    "' + req.body.remark + '" ' +
            '  )'  ,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    '',
                    id:     results.insertId
                });
                console.log('Inserted success '+results.insertId);
            }
        });
};

exports.deleteUserList = function(req, res) {
    var listId = parseInt(req.params.listId);
    connection.query('DELETE FROM `tbl_user_list` WHERE `list_id` = '+listId,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    ''
                });
                console.log('Deleted Very very success!!!!');
            }
        });
};

exports.deleteListDetail = function(req, res) {
    var listDetailId = parseInt(req.params.listDetailId);
    connection.query('DELETE FROM `tbl_list_detail` WHERE `list_detail_id` = '+listDetailId,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    ''
                });
                console.log('Deleted Very very success!!!!');
            }
        });
};

exports.deleteAllListDetail = function(req, res) {
    var listId = parseInt(req.params.listId);
    connection.query('DELETE FROM `tbl_list_detail` WHERE `list_id` = '+listId,
        function selectCb(err, results, fields) {
            if (err) throw err;
            else{
                res.send({
                    result: 'success',
                    data: results,
                    err:    ''
                });
                console.log('Deleted Very very success!!!!');
            }
        });
};

//=================================================================================

//=================================================================================
//==================Find All User Security=========================================================
//=================================================================================
/*exports.findAllUser = function(userName, callback) {
    var screenName = toString(userName);
    console.log('userName= '+userName);
    connection.query("SELECT * " +
        "FROM `tbl_zuiv_user` " +
        "WHERE `screen_name`= "+ "'"+screenName+"'", function(err, rows){
        callback(err, rows);
    });
};*/

/*exports.findAllUser = function(userName, password, callback) {
    console.log('userName and Pass= '+userName+' '+password);
    connection.query("SELECT * " +
        "FROM `tbl_zuiv_user` " +
        "WHERE `screen_name`= "+ "'"+userName+"'"+
        "AND password = "+ "'"+password+"'", function(err, rows){
        callback(err, rows);
    });
};*/

exports.findAllUser = function(userName, password, callback) {
    console.log('userName and Pass= '+userName+' '+password);
    connection.query("SELECT * " +
        "FROM `tbl_zuiv_user` " +
        "WHERE `email`= "+ "'"+userName+"'"+
        "AND password = "+ "'"+password+"'", function(err, rows){
        callback(err, rows);
    });
};

exports.findFacebookUser = function(req, res) {
    var socialId = req.params.socialId;
    console.log('socialId= '+socialId);
    connection.query("SELECT * " +
        "FROM `tbl_zuiv_user` " +
        "WHERE `social_id`= "+ "'"+socialId+"'", function(err, rows){
        res.json(rows);
    });
};

exports.saveUser = function(req, res) {
    connection.query('INSERT ' +
            'INTO `tbl_zuiv_user` ' +
            '  ( ' +
            '    `full_name`, ' +
            '    `screen_name`, ' +
            '    `email`, ' +
            '    `password`, ' +
            '    `gender`, ' +
            '    `social_id`, ' +
            '    `user_photo`, ' +
            '    `user_role`, ' +
            '    `remark`, ' +
            '    `status` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.fullName + '", ' +
            '    "' + req.body.screenName + '", ' +
            '    "' + req.body.userEmail + '", ' +
            '    "' + req.body.passw + '", ' +
            '    "' + req.body.gender + '", ' +
            '    "' + req.body.socialId + '", ' +
            '    "' + req.body.userPhoto + '", ' +
            '    "' + req.body.userRole + '", ' +
            '    "' + req.body.userRemark + '", ' +
            '    "' + req.body.userStatus + '" ' +
            '  )',
        function selectCb(err, results, fields) {
            if (err) throw err;
            else {
                res.send({
                    result: 'success',
                    data: results,
                    err: '',
                    id: results.insertId
                });
            }
             console.log('Inserted success '+results.insertId);
        });
};

/*exports.saveUser = function(fullName, screenName, userEmail, pass, gender, socialId, userPhoto, userRole, userRemark, userStatus, callback) {
    connection.query('INSERT ' +
            'INTO `tbl_zuiv_user` ' +
            '  ( ' +
            '    `full_name`, ' +
            '    `screen_name`, ' +
            '    `email`, ' +
            '    `password`, ' +
            '    `gender`, ' +
            '    `social_id`, ' +
            '    `user_photo`, ' +
            '    `user_role`, ' +
            '    `remark`, ' +
            '    `status` ' +
            '  ) ' +
            '  VALUES ' +
            '  ( ' +
            '    "' + req.body.intractionId + '", ' +
            '    "' + fullName + '", ' +
            '    "' + screenName + '", ' +
            '    "' + userEmail + '", ' +
            '    "' + pass + '", ' +
            '    "' + gender + '", ' +
            '    "' + socialId + '", ' +
            '    "' + userPhoto + '", ' +
            '    "' + userRole + '", ' +
            '    "' + userRemark + '", ' +
            '    "' + userStatus + '" ' +
            '  )',
        function selectCb(err, results, fields) {
            //if (err) throw err;
            //else{
            callback(err, results);
            console.log('Inserted success '+results.insertId);
            //}
        });
};*/

//=========
//===============================================================================
//===============================================================================
//===============================================================================
//=====================Facebook==========================================================
//===============================================================================

exports.loginCallback = function (req, res, next) {
    var code            = req.query.code;

    console.log('Function Login callback called');

    if(req.query.error) {
        // user might have disallowed the app
        return res.send('login-error ' + req.query.error_description);
    } else if(!code) {
        return res.redirect('/');
    }

    Step(
        function exchangeCodeForAccessToken() {
            FB.napi('oauth/access_token', {
                client_id:      FB.options('appId'),
                client_secret:  FB.options('appSecret'),
                redirect_uri:   FB.options('redirectUri'),
                code:           code
            }, this);
        },
        function extendAccessToken(err, result) {
            if(err) throw(err);
            FB.napi('oauth/access_token', {
                client_id:          FB.options('appId'),
                client_secret:      FB.options('appSecret'),
                grant_type:         'fb_exchange_token',
                fb_exchange_token:  result.access_token
            }, this);
        },
        function (err, result) {
            if(err) return next(err);

            req.session.access_token    = result.access_token;
            req.session.expires         = result.expires || 0;

            if(req.query.state) {
                var parameters              = JSON.parse(req.query.state);
                parameters.access_token     = req.session.access_token;

                console.log(parameters);

                FB.api('/me/' + config.facebook.appNamespace, 'post', parameters , function (result) {
                    console.log(result);
                    if(!result || result.error) {
                        return res.send(500, result || 'error');
                        // return res.send(500, 'error');
                    }

                    return res.redirect('/');
                });
            } else {
                return res.redirect('/');
            }
        }
    );
};

exports.search = function (req, res) {
    var parameters              = req.query;
    parameters.access_token     = req.session.access_token;
    FB.api('/search', req.query, function (result) {
        if(!result || result.error) {
            return res.send(500, 'error');
        }
        res.send(result);
    });
};