module.exports = function(express, app){
    var router = express.Router();

    // index.html
    router.get('/', function(req, res, next){
        res.render('index', {title: 'Welcome to MjaoChat'});
    })

    // chatrooms.html
    router.get('/chatrooms', function(req, res, next){
        res.render('chatrooms', {title: 'Chatrooms'});
    })

    //set session demo
    router.get('/setcolor', function(req, res, next){
        req.session.favColor = 'Red';
        res.send('Setting fav color!!');
    })
    //get session demo
    router.get('/getcolor', function(req,res,next){
        res.send('Your fav color: ' + (req.session.favColor===undefined?'not found':req.session.favColor))
    })

    
    app.use('/', router);
}