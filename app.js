var express = require('express')
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

var commentaires = require('./commentaires.json');

app.listen(1337, function() {
	console.log('listening on 1337');
});

var cheminFront = path.join(__dirname,'build/unbundled');

app.set('case sensitive routing', false);
app.use(express.static(__dirname));

app.use(bodyParser.json());

app.get('/',function(req, res) {
	return res.sendFile('index.html');
});

app.get('/comments', function(req,res) {
	fs.readFile('commentaires.json','utf-8',function(err, data) {
		if(err) console.log(err);
		var data = JSON.parse(data);
		return res.json(data);
	});
});

app.post('/write', function(req, res) {
	var c = req.body.commentaire;
	var t = Date.now();
	var nouveau = {commentaire: c, likes: 0, dislikes: 0, auteur: req.body.nom, 'heure': t};
	commentaires.push(nouveau);
	fs.writeFile('commentaires.json', JSON.stringify(commentaires, null, 2), function(err) {
		if(err) { console.log(err); res.json('KO'); }
		return res.json('OK');
	});
});




app.post('/like/:heure', function(req,res) {
	var heure = req.params.heure;
	for(var i = 0; i< commentaires.length; i++) {
		if(heure == commentaires[i].heure) {
			var n = ++commentaires[i].likes;
			fs.writeFile('commentaires.json', JSON.stringify(commentaires, null, 2), function(err) {
				if(err) console.log(err);
				return res.send("" + n);
			});
		}
	} 
});

app.post('/dislike/:heure', function(req,res) {
	var heure = req.params.heure;
	for(var i = 0; i< commentaires.length; i++) {
		if(heure == commentaires[i].heure) {
			var n = ++commentaires[i].dislikes;
			fs.writeFile('commentaires.json', JSON.stringify(commentaires, null, 2), function(err) {
				if(err) console.log(err);
				return res.send("" + n);
			});
		}
	} 
});



