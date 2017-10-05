// Pulling all installed packages
var http     = require('http'),
	express  = require('express'),
	mysql    = require('mysql')
	parser   = require('body-parser');
 
// Database Connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'node_api'
});
try {
	connection.connect();
	
} catch(e) {
	console.log('Database Connetion failed:' + e);
}
 
 // Setup an App with express, configure app to use body parser and assign port to our app.
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 5000);
 
 // Set default route
app.get('/', function (req, res) {
	res.send('<html><body><p>Welcome to NODE API</p></body></html>');
});
 
app.get('/employees_list', function (req,res) {
	connection.query('SELECT * from employees', function(err, rows, fields) {
  		if (!err){
  			var response = [];
			response.push({'result' : 'success'});
			if (rows.length != 0) {
				response.push({'data' : rows});
			} else {
				response.push({'msg' : 'No Result Found'});
			}
 
			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});
 
 app.post('/employees/add', function (req,res) {
	var response = [];
 
	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.sal !== 'undefined' && 
		typeof req.body.imageUrl !== 'undefined'
	) {
		var name = req.body.name, sal = req.body.sal, imageUrl = req.body.imageUrl;
 
		connection.query('INSERT INTO employees (emp_name, emp_sal, emp_image) VALUES (?, ?, ?)', 
			[name, sal, imageUrl], 
			function(err, result) {
		  		if (!err){
 
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}
 
					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});
 
	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.status(200).send(JSON.stringify(response));
	}
});
 
app.post('/employees/edit/:id', function (req,res) {
	var id = req.params.id, response = [];
 
	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.sal !== 'undefined' && 
		typeof req.body.imageUrl !== 'undefined'
	) {
		var name = req.body.name, sal = req.body.sal, imageUrl = req.body.imageUrl;
 
		connection.query('UPDATE employees SET emp_name = ?, emp_sal = ?, emp_image = ? WHERE id = ?', 
			[name, sal, imageUrl, id], 
			function(err, result) {
		  		if (!err){
 
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}
 
					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});
 
	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.send(200, JSON.stringify(response));
	}
});
 
app.delete('/employees/delete/:id', function (req,res) {
	var id = req.params.id;
 
	connection.query('DELETE FROM employees WHERE id = ?', [id], function(err, result) {
  		if (!err){
  			var response = [];
 
			if (result.affectedRows != 0) {
				response.push({'result' : 'success'});
			} else {
				response.push({'msg' : 'No Result Found'});
			}
 
			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});
 
app.get('/employees/:id', function (req,res) {
	var id = req.params.id;
 
	connection.query('SELECT * from employees where id = ?', [id], function(err, rows, fields) {
  		if (!err){
  			var response = [];
 
			if (rows.length != 0) {
				response.push({'result' : 'success', 'data' : rows});
			} else {
				response.push({'result' : 'error', 'msg' : 'No Results Found'});
			}
 
			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});
 
http.createServer(app).listen(app.get('port'), function(){
	console.log('Server listening on port ' + app.get('port'));
});