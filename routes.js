var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var rp = require('request-promise');

router.use(bodyparser.json());
router.use(express.static(__dirname + '/views'));


schema = require('./schema/schema.js');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/mydatabse'
mongoose.connect(mongoDB);
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));



//Render HTML on server load

router.get('/',function(req,res){
	res.sendFile('index.html');
})

//Make APi call to get the current top stories
router.post('/showFrontPage',function(req,res){

var options = {
    uri: 'https://hn.algolia.com/api/v1/search?tags=front_page',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};
 
rp(options)
    .then(function (repos) {
       res.send(repos.hits);
       
       db.collection('topStories').count(function (err, count) {
   			if (!err && count === 0) {
        	db.collection('topStories').insert(repos.hits);
    	}
    		else{
    			db.collection('topStories').drop()
    			db.collection('topStories').insert(repos.hits);
    		}
    })

})


    .catch(function (err) {
        res.send(err);
        console.log('Error!');
    });



});

//Make APi call to get all time top stories
router.post('/showAlltimePopular',function(req,res){

var options = {
    uri: 'https://hn.algolia.com/api/v1/search?numericFilters',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};
 
rp(options)
    .then(function (repos) {
       res.send(repos.hits);

       db.collection('allTimeTop').count(function (err, count) {
   			if (!err && count === 0) {
        	db.collection('allTimeTop').insert(repos.hits);
    	}
    		else{
    			db.collection('allTimeTop').drop()
    			db.collection('allTimeTop').insert(repos.hits);
    		}
    })

  })


    .catch(function (err) {
        res.send(err);
        console.log('Error!');
    });


})

//Search stories using a particular keyword
router.post('/searchStories',function(req,res){

	//get keyword from client
	var data=req.body;
	var searchQry =data.searchData
	var options = {
    uri: 'http://hn.algolia.com/api/v1/search?query='+searchQry+'&tags=story',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};
 
rp(options)
    .then(function (repos) {
       res.send(repos.hits);
       db.collection('searchStories').insert(repos.hits);
    })


    .catch(function (err) {
        res.send(err);
        console.log('Error!');
    });


});

//Make API call to get stories from last 24 hrs
router.post('/last24hrs',function(req,res){

var options = {
    uri: 'http://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=created_at_i>86400'
,
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};
 
rp(options)
    .then(function (repos) {
       res.send(repos.hits);
       db.collection('last24hrs').count(function (err, count) {
            if (!err && count === 0) {
            db.collection('last24hrs').insert(repos.hits);
        }
            else{
                db.collection('last24hrs').drop()
                db.collection('last24hrs').insert(repos.hits);
            }
    })       

    })


    .catch(function (err) {
        res.send(err);
        console.log('Error!');
    });



});


//Api to find stories from DB

router.post('/api/topStories/:id',function(req,res){
    var id = req.params.id;
    var query= {
        "objectID":id
    };
    db.collection('topStories').find(query).toArray()
    .then(function(doc){
        res.send(doc);
    })
   
    
});

router.post('/api/allTimeTop/:id',function(req,res){
    var id = req.params.id;
    var query= {
        "objectID":id
    };
    db.collection('allTimeTop').find(query).toArray()
    .then(function(doc){
        res.send(doc);
    })
   
    
});

router.post('/api/searchStories/:id',function(req,res){
    var id = req.params.id;
    var query= {
        "objectID":id
    };
    db.collection('searchStories').find(query).toArray()
    .then(function(doc){
        res.send(doc);
    })
   

});

router.post('/api/last24hrs/:id',function(req,res){
    var id = req.params.id;
    var query= {
        "objectID":id
    };
    db.collection('last24hrs').find(query).toArray()
    .then(function(doc){
        res.send(doc);
    })
   
})


module.exports=router;

