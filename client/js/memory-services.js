'use strict';
var allCatg = [];

angular.module('myApp.memoryServices', [])
    .factory('dataFactoryLocal', [
        function () {
            //var urlBase = 'http://localhost:3000/category';
            var dataFactoryLocal = {};
            var db;
            var dataset;            

            dataFactoryLocal.initDatabase = function () {
                console.debug('called initDatabase()');
                try {
                    if (!window.openDatabase) {
                        alert('not supported');
                    } else {
                        var shortName = 'AddisEssentialsLocalDb';
                        var version = '1.0';
                        var displayName = 'Database AddEss';
                        var maxSizeInBytes = 65536;
                        db = openDatabase(shortName, version, displayName, maxSizeInBytes);
                        
                        dataFactoryLocal.createTables();
                        return db;
                    }
                } catch(e) {
                    if (e == 2) {
                        alert('Invalid database version');
                    } else {
                        alert('Unknown error ' + e);
                    }
                    return;
                }
            }

            dataFactoryLocal.createTables = function() {
            //console.debug('called createCategoryTable()');
                //dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init
                var sql = "CREATE TABLE IF NOT EXISTS tbl_catagory " +
                            "  ( " +
                            "    catagory_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                            "    catagory_name TEXT, " +
                            "    catagory_logo TEXT, " +
                            "    parent TEXT " +
                            "  )";
                var sqlEss = "CREATE TABLE IF NOT EXISTS tbl_essentials (ess_id INTEGER PRIMARY KEY AUTOINCREMENT, catagory_id INTEGER, ess_name TEXT, est_on_date TEXT,ess_logo TEXT, moto TEXT, status TEXT, remark TEXT)";
                var sqlBranch = "CREATE TABLE IF NOT EXISTS tbl_branch (branch_id INTEGER PRIMARY KEY AUTOINCREMENT, ess_id INTEGER, branch_type TEXT, branch_name TEXT, open_since TEXT, status TEXT, remark TEXT)";
                var sqlAddress = "CREATE TABLE IF NOT EXISTS tbl_address (address_id INTEGER PRIMARY KEY AUTOINCREMENT, branch_id INTEGER, country TEXT, city TEXT, sub_city TEXT, email TEXT, website TEXT, " +
                                  "facebook TEXT, "+
                                  "twitter TEXT, "+
                                  "google_plus TEXT, "+
                                  "pobox TEXT, "+
                                  "local_name TEXT, "+
                                  "latitude TEXT, "+
                                  "longtiude TEXT)";
                var sqlPhone = "CREATE TABLE IF NOT EXISTS tbl_phone_num " +
                                "  ( " +
                                "    phone_num_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                                "    branch_id    INTEGER, " +
                                "    phone_num TEXT, " +
                                "    type TEXT )" ;      
                var sqlWorkDays = "CREATE TABLE IF NOT EXISTS tbl_working_days " +
                                    "  ( " +
                                    "    working_days_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                                    "    branch_id       INTEGER, " +
                                    "    name TEXT )";    
                var sqlWorkHours = "CREATE TABLE IF NOT EXISTS `tbl_working_hours` " +
                                    "  ( " +
                                    "    working_hours_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                                    "    working_day_id   INTEGER, " +
                                    "    start_time TEXT, " +
                                    "    end_time TEXT )";                                                                                        
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql);
                        tx.executeSql(sqlEss);
                        tx.executeSql(sqlBranch);
                        tx.executeSql(sqlAddress);
                        tx.executeSql(sqlPhone);
                        tx.executeSql(sqlWorkDays);
                        tx.executeSql(sqlWorkHours);
                        //tx.executeSql(sql, [], getCategoryList, handleErrors);
                    }
                );
            }                            

            dataFactoryLocal.getCategoryList = function(callback) {
                //console.debug('called getCategoryList()');
                //dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init                
                var categoryJson = [];
                var sql = "SELECT * FROM tbl_catagory";
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql, [], function(tx, results){                          
                            var catagory_id, catagory_name, catagory_logo, parent;
                            for (var i=0; i < results.rows.length; i++) {
                                catagory_id = results.rows.item(i).catagory_id;
                                catagory_name = results.rows.item(i).catagory_name;
                                catagory_logo = results.rows.item(i).catagory_logo;
                                parent = results.rows.item(i).parent;                    
             
                                categoryJson.push({catagory_id: catagory_id, catagory_name: catagory_name, catagory_logo: catagory_logo, parent: parent});                                
                                //categoryJson.push(clone(results.rows.item(i)));
                            }
                            callback(categoryJson);                                                       
                        }, function(tx, error){
                            console.log('Category List Selection faild!!!');
                        });
                    }
                );                
            }                                 

            dataFactoryLocal.searchEssByCategory = function(id, callback) {
                //console.debug('called getCategoryList()');
                dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init                
                var essByCategJson = [];
                var sql = "SELECT * FROM tbl_essentials e INNER JOIN tbl_catagory c ON e.catagory_id = c.catagory_id WHERE c.catagory_id = ?";
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql, [id], function(tx, results){                          
                            var ess_id, catagory_id, ess_name, est_on_date, ess_logo, moto, status, remark, catagory_name, parent, catagory_logo;
                            for (var i=0; i < results.rows.length; i++) {

                                ess_id = results.rows.item(i).ess_id;
                                catagory_id = results.rows.item(i).catagory_id;                                
                                ess_name = results.rows.item(i).ess_name;
                                est_on_date = results.rows.item(i).est_on_date;         
                                ess_logo = results.rows.item(i).ess_logo;
                                moto = results.rows.item(i).moto; 
                                status = results.rows.item(i).status;
                                remark = results.rows.item(i).remark; 
                                catagory_name = results.rows.item(i).catagory_name;
                                parent = results.rows.item(i).parent;       
                                catagory_logo = results.rows.item(i).catagory_logo;     
             
                                essByCategJson.push({ess_id: ess_id, catagory_id: catagory_id, ess_name: ess_name, est_on_date: est_on_date, ess_logo: ess_logo, moto: moto, status: status, remark: remark, catagory_name: catagory_name, parent: parent, catagory_logo: catagory_logo});                                
                            }
                            callback(essByCategJson);                                                       
                        }, function(tx, error){
                            console.log('Essentials List Selection faild!!!');
                        });
                    }
                );                
            }            

            dataFactoryLocal.searchBranchOfEss = function(id, callback) {
                //console.debug('called getCategoryList()');
                //dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init                
                var essByCategJson = [];
                var sql = "SELECT COALESCE(c.catagory_id, 'NULL') catagory_id, " +
                            "  COALESCE(c.catagory_name, '-') catagory_name, " +
                            "  COALESCE(c.catagory_logo, '-') catagory_logo, " +
                            "  COALESCE(e.ess_id, '-') ess_id, " +
                            "  COALESCE(e.ess_name, 'EssName') ess_name, " +
                            "  COALESCE(e.est_on_date, 'EstOnDate') est_on_date, " +
                            "  COALESCE(e.ess_logo, '-') ess_logo, " +
                            "  COALESCE(e.moto, 'moto') moto, " +
                            "  COALESCE(e.status, '-') ess_status, " +
                            "  COALESCE(e.remark, '-') remark, " +
                            "  COALESCE(b.branch_id, '-') branch_id, " +
                            "  COALESCE(b.branch_type, 'branchType') branch_type, " +
                            "  COALESCE(b.branch_name, 'branchName') branch_name, " +
                            "  COALESCE(b.open_since, 'openSince') open_since, " +
                            "  COALESCE(b.status, '-') branch_status, " +
                            "  COALESCE(b.remark, '-') remark " +
                            "FROM tbl_essentials e " +
                            "INNER JOIN tbl_catagory c " +
                            "ON e.catagory_id = c.catagory_id " +
                            "LEFT JOIN tbl_branch b " +
                            "ON b.ess_id = e.ess_id " +
                            "WHERE e.ess_id = ?";
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql, [id], function(tx, results){                          
                            var ess_id, catagory_id, ess_name, est_on_date, ess_logo, moto, ess_status, remark, catagory_name, parent, catagory_logo, branch_id, branch_type, branch_name, open_since, branch_remark;
                            for (var i=0; i < results.rows.length; i++) {

                                ess_id = results.rows.item(i).ess_id;
                                catagory_id = results.rows.item(i).catagory_id;                                
                                ess_name = results.rows.item(i).ess_name;
                                est_on_date = results.rows.item(i).est_on_date;         
                                ess_logo = results.rows.item(i).ess_logo;
                                moto = results.rows.item(i).moto; 
                                ess_status = results.rows.item(i).ess_status;
                                remark = results.rows.item(i).remark; 
                                catagory_name = results.rows.item(i).catagory_name;
                                parent = results.rows.item(i).parent;       
                                catagory_logo = results.rows.item(i).catagory_logo;  

                                branch_id = results.rows.item(i).branch_id;
                                branch_type = results.rows.item(i).branch_type; 
                                branch_name = results.rows.item(i).branch_name;
                                open_since = results.rows.item(i).open_since;       
                                branch_remark = results.rows.item(i).remark;    
             
                                essByCategJson.push({ess_id: ess_id, catagory_id: catagory_id, ess_name: ess_name, est_on_date: est_on_date, ess_logo: ess_logo, moto: moto, ess_status: ess_status, remark: remark, catagory_name: catagory_name, parent: parent, catagory_logo: catagory_logo, branch_id: branch_id, branch_type: branch_type, branch_name: branch_name, open_since: open_since, branch_remark: branch_remark});
                            }
                            callback(essByCategJson);                                                       
                        }, function(tx, error){
                            console.log('Category List Selection faild!!!');
                        });
                    }
                );                
            }

            dataFactoryLocal.searchBranchAddress = function(id, callback) {
                //console.debug('called getCategoryList()');
                //dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init                
                var branchAddress = [];
                var sql = "SELECT COALESCE(c.catagory_id, 'NULL') catagory_id, " +
                            "  COALESCE(c.catagory_name, '-') catagory_name, " +
                            "  COALESCE(c.catagory_logo, '-') catagory_logo, " +
                            "  COALESCE(e.ess_id, '-') ess_id, " +
                            "  COALESCE(e.ess_name, 'EssName') ess_name, " +
                            "  COALESCE(e.est_on_date, 'EstOnDate') est_on_date, " +
                            "  COALESCE(e.ess_logo, '-') ess_logo, " +
                            "  COALESCE(e.moto, 'moto') moto, " +
                            "  COALESCE(e.status, '-') ess_status, " +
                            "  COALESCE(e.remark, '-') remark, " +
                            "  COALESCE(b.branch_id, '-') branch_id, " +
                            "  COALESCE(b.branch_type, 'branchType') branch_type, " +
                            "  COALESCE(b.branch_name, 'branchName') branch_name, " +
                            "  COALESCE(b.open_since, 'openSince') open_since, " +
                            "  COALESCE(b.status, '-') branch_status, " +
                            "  COALESCE(b.remark, '-') remark, " +
                            "  COALESCE(a.address_id, '-') address_id, " +
                            "  COALESCE(a.country, 'country') country, " +
                            "  COALESCE(a.city, 'city') city, " +
                            "  COALESCE(a.sub_city, 'subcity') sub_city, " +
                            "  COALESCE(a.email, 'email') email, " +
                            "  COALESCE(a.website, 'website') website, " +
                            "  COALESCE(a.facebook, 'facebook') facebook, " +
                            "  COALESCE(a.twitter, 'twitter') twitter, " +
                            "  COALESCE(a.google_plus, 'googlePlus') google_plus, " +
                            "  COALESCE(a.pobox, 'pobox') pobox, " +
                            "  COALESCE(a.local_name, 'localName') local_name, " +
                            "  COALESCE(a.latitude, 'latitude') latitude, " +
                            "  COALESCE(a.longtiude, 'longtiude') longtiude " +
                            "FROM tbl_essentials e " +
                            "INNER JOIN tbl_catagory c " +
                            "ON e.catagory_id = c.catagory_id " +
                            "LEFT JOIN tbl_branch b " +
                            "ON b.ess_id = e.ess_id " +
                            "LEFT JOIN tbl_address a " +
                            "ON a.branch_id    = b.branch_id " +
                            "WHERE b.branch_id    = ?";
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql, [id], function(tx, results){                          
                            var ess_id, catagory_id, ess_name, est_on_date, ess_logo, moto, ess_status, remark, catagory_name, parent, catagory_logo, branch_id, branch_type, branch_name, open_since, branch_remark, address_id, country, city, sub_city, email, website, facebook, twitter, google_plus, pobox, local_name, latitude, longtiude;
                            for (var i=0; i < results.rows.length; i++) {

                                ess_id = results.rows.item(i).ess_id;
                                catagory_id = results.rows.item(i).catagory_id;                                
                                ess_name = results.rows.item(i).ess_name;
                                est_on_date = results.rows.item(i).est_on_date;         
                                ess_logo = results.rows.item(i).ess_logo;
                                moto = results.rows.item(i).moto; 
                                ess_status = results.rows.item(i).ess_status;
                                remark = results.rows.item(i).remark; 
                                catagory_name = results.rows.item(i).catagory_name;
                                parent = results.rows.item(i).parent;       
                                catagory_logo = results.rows.item(i).catagory_logo;  

                                branch_id = results.rows.item(i).branch_id;
                                branch_type = results.rows.item(i).branch_type; 
                                branch_name = results.rows.item(i).branch_name;
                                open_since = results.rows.item(i).open_since;       
                                branch_remark = results.rows.item(i).remark;    

                                address_id = results.rows.item(i).address_id;
                                country = results.rows.item(i).country; 
                                city = results.rows.item(i).city;
                                sub_city = results.rows.item(i).sub_city;       
                                email = results.rows.item(i).email;

                                website = results.rows.item(i).website;
                                facebook = results.rows.item(i).facebook; 
                                twitter = results.rows.item(i).twitter;
                                google_plus = results.rows.item(i).google_plus;       
                                pobox = results.rows.item(i).pobox;

                                local_name = results.rows.item(i).local_name;
                                latitude = results.rows.item(i).latitude;       
                                longtiude = results.rows.item(i).longtiude;
             
                                branchAddress.push({ess_id: ess_id, catagory_id: catagory_id, ess_name: ess_name, est_on_date: est_on_date, ess_logo: ess_logo, moto: moto, ess_status: ess_status, remark: remark, catagory_name: catagory_name, parent: parent, catagory_logo: catagory_logo, branch_id: branch_id, branch_type: branch_type, branch_name: branch_name, open_since: open_since, branch_remark: remark, address_id: address_id, country: country, city: city, sub_city: sub_city, email: email, website: website, facebook: facebook, twitter: twitter, google_plus: google_plus, pobox: pobox, local_name: local_name, latitude: latitude, longtiude: longtiude});
                            }
                            callback(branchAddress);                                                       
                        }, function(tx, error){
                            console.log('Branch Address Selection faild!!!');
                        });
                    }
                );                
            }

            dataFactoryLocal.searchBranchPhones = function(id, callback) {
                //console.debug('called getCategoryList()');
                //dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init                
                var branchPhones = [];
                var sql = "SELECT COALESCE(c.catagory_id, 'NULL') catagory_id, " +
                            "  COALESCE(c.catagory_name, '-') catagory_name, " +
                            "  COALESCE(c.catagory_logo, '-') catagory_logo, " +
                            "  COALESCE(e.ess_id, '-') ess_id, " +
                            "  COALESCE(e.ess_name, 'EssName') ess_name, " +
                            "  COALESCE(e.est_on_date, 'EstOnDate') est_on_date, " +
                            "  COALESCE(e.ess_logo, '-') ess_logo, " +
                            "  COALESCE(e.moto, 'moto') moto, " +
                            "  COALESCE(e.status, '-') ess_status, " +
                            "  COALESCE(e.remark, '-') remark, " +
                            "  COALESCE(b.branch_id, '-') branch_id, " +
                            "  COALESCE(b.branch_type, 'branchType') branch_type, " +
                            "  COALESCE(b.branch_name, 'branchName') branch_name, " +
                            "  COALESCE(b.open_since, 'openSince') open_since, " +
                            "  COALESCE(b.status, '-') branch_status, " +
                            "  COALESCE(b.remark, '-') remark, " +
                            "  COALESCE(pn.phone_num_id, '-') phone_num_id, " +
                            "  COALESCE(pn.phone_num, 'phoneNum') phone_num, " +
                            "  COALESCE(pn.type, 'phoneType') phone_type " +
                            "FROM tbl_essentials e " +
                            "INNER JOIN tbl_catagory c " +
                            "ON e.catagory_id = c.catagory_id " +
                            "LEFT JOIN tbl_branch b " +
                            "ON b.ess_id = e.ess_id " +
                            "LEFT JOIN tbl_phone_num pn " +
                            "ON pn.branch_id = b.branch_id " +
                            "WHERE b.branch_id    = ?";
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql, [id], function(tx, results){                          
                            var ess_id, catagory_id, ess_name, est_on_date, ess_logo, moto, ess_status, remark, catagory_name, parent, catagory_logo, branch_id, branch_type, branch_name, open_since, branch_remark, phone_num_id, phone_num, phone_type;
                            for (var i=0; i < results.rows.length; i++) {

                                ess_id = results.rows.item(i).ess_id;
                                catagory_id = results.rows.item(i).catagory_id;                                
                                ess_name = results.rows.item(i).ess_name;
                                est_on_date = results.rows.item(i).est_on_date;         
                                ess_logo = results.rows.item(i).ess_logo;
                                moto = results.rows.item(i).moto; 
                                ess_status = results.rows.item(i).ess_status;
                                remark = results.rows.item(i).remark; 
                                catagory_name = results.rows.item(i).catagory_name;
                                parent = results.rows.item(i).parent;       
                                catagory_logo = results.rows.item(i).catagory_logo;  

                                branch_id = results.rows.item(i).branch_id;
                                branch_type = results.rows.item(i).branch_type; 
                                branch_name = results.rows.item(i).branch_name;
                                open_since = results.rows.item(i).open_since;       
                                branch_remark = results.rows.item(i).remark;    

                                phone_num_id = results.rows.item(i).phone_num_id;
                                phone_num = results.rows.item(i).phone_num; 
                                phone_type = results.rows.item(i).phone_type;                                
             
                                branchPhones.push({ess_id: ess_id, catagory_id: catagory_id, ess_name: ess_name, est_on_date: est_on_date, ess_logo: ess_logo, moto: moto, ess_status: ess_status, remark: remark, catagory_name: catagory_name, parent: parent, catagory_logo: catagory_logo, branch_id: branch_id, branch_type: branch_type, branch_name: branch_name, open_since: open_since, branch_remark: remark, phone_num_id: phone_num_id, phone_num: phone_num, phone_type: phone_type});
                            }
                            callback(branchPhones);                                                       
                        }, function(tx, error){
                            console.log('Branch Phone Selection faild!!!');
                        });
                    }
                );                
            }

            dataFactoryLocal.searchBranchHours = function(id, callback) {
                //console.debug('called getCategoryList()');
                //dataFactoryLocal.initDatabase();//init database. later add logic to check if database is already init                
                var branchHours = [];
                var sql = "SELECT COALESCE(c.catagory_id, 'NULL') catagory_id, " +
                            "  COALESCE(c.catagory_name, '-') catagory_name, " +
                            "  COALESCE(c.catagory_logo, '-') catagory_logo, " +
                            "  COALESCE(e.ess_id, '-') ess_id, " +
                            "  COALESCE(e.ess_name, 'EssName') ess_name, " +
                            "  COALESCE(e.est_on_date, 'EstOnDate') est_on_date, " +
                            "  COALESCE(e.ess_logo, '-') ess_logo, " +
                            "  COALESCE(e.moto, 'moto') moto, " +
                            "  COALESCE(e.status, '-') ess_status, " +
                            "  COALESCE(e.remark, '-') remark, " +
                            "  COALESCE(b.branch_id, '-') branch_id, " +
                            "  COALESCE(b.branch_type, 'branchType') branch_type, " +
                            "  COALESCE(b.branch_name, 'branchName') branch_name, " +
                            "  COALESCE(b.open_since, 'openSince') open_since, " +
                            "  COALESCE(b.status, '-') branch_status, " +
                            "  COALESCE(b.remark, '-') remark, " +
                            "  COALESCE(wd.working_days_id, '-') working_days_id, " +
                            "  COALESCE(wd.name, 'workDays') work_days, " +
                            "  COALESCE(wh.working_hours_id, '-') working_hours_id, " +
                            "  COALESCE(wh.start_time, 'startTime') start_time, " +
                            "  COALESCE(wh.end_time, 'EndTime') end_time " +
                            "FROM tbl_essentials e " +
                            "INNER JOIN tbl_catagory c " +
                            "ON e.catagory_id = c.catagory_id " +
                            "LEFT JOIN tbl_branch b " +
                            "ON b.ess_id = e.ess_id " +
                            "LEFT JOIN tbl_working_days wd " +
                            "ON wd.branch_id = b.branch_id " +
                            "LEFT JOIN tbl_working_hours wh " +
                            "ON wh.working_day_id = wd.working_days_id " +
                            "WHERE b.branch_id    = ?";
                db.transaction(
                    function (tx) {
                        tx.executeSql(sql, [id], function(tx, results){                          
                            var ess_id, catagory_id, ess_name, est_on_date, ess_logo, moto, ess_status, remark, catagory_name, parent, catagory_logo, branch_id, branch_type, branch_name, open_since, branch_remark, working_days_id, work_days, working_hours_id, start_time, end_time;
                            for (var i=0; i < results.rows.length; i++) {

                                ess_id = results.rows.item(i).ess_id;
                                catagory_id = results.rows.item(i).catagory_id;                                
                                ess_name = results.rows.item(i).ess_name;
                                est_on_date = results.rows.item(i).est_on_date;         
                                ess_logo = results.rows.item(i).ess_logo;
                                moto = results.rows.item(i).moto; 
                                ess_status = results.rows.item(i).ess_status;
                                remark = results.rows.item(i).remark; 
                                catagory_name = results.rows.item(i).catagory_name;
                                parent = results.rows.item(i).parent;       
                                catagory_logo = results.rows.item(i).catagory_logo;  

                                branch_id = results.rows.item(i).branch_id;
                                branch_type = results.rows.item(i).branch_type; 
                                branch_name = results.rows.item(i).branch_name;
                                open_since = results.rows.item(i).open_since;       
                                branch_remark = results.rows.item(i).remark;    

                                working_days_id = results.rows.item(i).working_days_id;
                                work_days = results.rows.item(i).work_days;
                                working_hours_id = results.rows.item(i).working_hours_id;                                
                                start_time = results.rows.item(i).start_time;
                                end_time = results.rows.item(i).end_time;  
             
                                branchHours.push({ess_id: ess_id, catagory_id: catagory_id, ess_name: ess_name, est_on_date: est_on_date, ess_logo: ess_logo, moto: moto, ess_status: ess_status, remark: remark, catagory_name: catagory_name, parent: parent, catagory_logo: catagory_logo, branch_id: branch_id, branch_type: branch_type, branch_name: branch_name, open_since: open_since, branch_remark: remark,working_days_id: working_days_id, work_days: work_days, working_hours_id: working_hours_id, start_time: start_time, end_time: end_time});
                            }
                            callback(branchHours);                                                       
                        }, function(tx, error){
                            console.log('Branch Working Hours Selection faild!!!');
                        });
                    }
                );                
            }
             

//=====================================Controller DAO===============================================
//===========================================================================
            dataFactoryLocal.getCategories = function () {                
                return {
                    query: function (callback) {
                        var catgList = [];                        
                        dataFactoryLocal.getCategoryList(function(categoryList){//Note calling Asyncronous function must use callback
                            catgList = categoryList;                                                       
                            console.log('CategoryList@Caller= '+catgList); 
                            callback(catgList);
                        });                        
                    },
                    get: function (category) {
                        return dataFactoryLocal.getCategoryById();//'ll be implimented in the future
                    }
                }            
            };                           

            dataFactoryLocal.getEssByCategory = function (id) {//by category_id                
                return {
                    query: function (callback) {
                        var essByCatg = [];
                        dataFactoryLocal.searchEssByCategory(id, function(essByCatgId){
                            essByCatg = essByCatgId;
                            console.log('EssBYCatg@Caller= '+essByCatg); 
                            callback(essByCatg);
                        });                          
                    },
                    get: function (category) {

                    }
                }
            };

            dataFactoryLocal.getEssBranchs = function (id) {//by ess_id
                return {
                    query: function (callback) {
                        var essBranchs = [];
                        dataFactoryLocal.searchBranchOfEss(id, function(essBranchsList){
                            essBranchs = essBranchsList;
                            //console.log('EssBranchs@Caller= '+JSON.stringfy(essBranchsList)); 
                            callback(essBranchsList);
                        });                          
                    },
                    get: function (category) {

                    }
                }
            };

            dataFactoryLocal.getBranchDetail = function (id) {//by branch_id
                return {
                    query: function (callback) {
                        var branchAddress = [];
                        dataFactoryLocal.searchBranchAddress(id, function(branchAddress){
                            branchAddress = branchAddress;
                            //console.log('EssBranchs@Caller= '+JSON.stringfy(essBranchsList)); 
                            callback(branchAddress);
                        });                          
                    },
                    get: function (category) {

                    }
                }
            };

            dataFactoryLocal.getBranchPhones = function (id) {//by branch_id
                return {
                    query: function (callback) {
                        var branchPhones = [];
                        dataFactoryLocal.searchBranchPhones(id, function(branchPhones){
                            branchPhones = branchPhones;
                            //console.log('EssBranchs@Caller= '+JSON.stringfy(essBranchsList)); 
                            callback(branchPhones);
                        });                          
                    },
                    get: function (category) {

                    }
                }
            };

            dataFactoryLocal.getBranchHours = function (id) {//by branch_id
                return {
                    query: function (callback) {
                        var branchHours = [];
                        dataFactoryLocal.searchBranchHours(id, function(branchHours){
                            branchHours = branchHours;
                            console.log('EssBranchs@CalWorkDays= '+branchHours[0].work_days); 
                            callback(branchHours);
                        });                          
                    },
                    get: function (category) {

                    }
                }
            };

            return dataFactoryLocal;
        }]);//End of dataFactoryLocal factory