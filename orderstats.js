//read file
//cleanup function: standardize time & date, states, capitalization, phone nums?, putting together people w multiple orders
//make everything objects with properties: arrays for platform, product
//make a function to search for a given property
//make a function to remove things with specific properties from object sets
//make a function to search for associative pairs of properties
//find total $ so far
//find $/day
//find avg amt spent/person, domestic/intl
//find a good graphing utility and automatically graph everything
//bar graph of countries
//bar graph of u.s. states
//bar graph module popularity
//most popular orders
//map countries, cities as dots
//mapping over time (gradient?) or even just Dragon v. Celery

var file = './ordertracking.csv';
var csv = require('csv');


function clean (data) {
	function timefixer (timecell) {
		return timecell
	}
	for (var row in data) {
		//console.log(timefixer(data[row][2]));
	}
	return(data)
}

csv()
	.from.path(file, { delimiter: ',', escape: '"' })
	.to.array( function(data){
		var orders = clean(data);
		var paidorders = selectorders(orders, 'order_status', 'paid_balance');
		//check to make sure this really works
		var usorders = selectorders(orders, 'buyer_country', 'US' || 'United States')
 		var countries = {};
 		for ( i = 1; i < orders.length; i++) {
 			var country = orders[i][3];
 			if (country in countries) {
 				countries[country] += 1;
 			} else {
 				countries[country] = 1;
 			}
 		}
 		//console.log(usorders)
 		//console.log(sortthings(countries))
 		console.log(counttessels(totalorders(paidorders)))
 		console.log(sortthings(totalorders(paidordersgit )));
 	});

function selectorders (orders, param, val) {
	//returns from a list of orders only those matching param/val
	var headers = orders[0]
	var param = headers.indexOf(param);
	var selection = [];
	for (var index = 1; index < orders.length; index++) {
		if (orders[index][param] == val) {
			selection.push(orders[index])
		}
	}
	return selection;
}

function sortthings (things) {
	//takes an object with numerical values, returns a sorted array of arrays
	//in the form of [[key, value], [key, value], ... ] descending order
	var sortable = [];
	for (var i in things) {
		sortable.push([i, things[i]]);
	}
    return sortable.sort(function(a, b) {return b[1] - a[1]});
}

function totalorders (orders) {
	//takes FIX THIS UP OR SOMETHING
	var countries = {};
 	for ( i = 1; i < orders.length; i++) {
 		var country = orders[i][20];
 		var qty = parseInt(orders[i][21])
 		if (country in countries) {
 			countries[country] += qty;
 		} else {
 			countries[country] = qty;
 		}
 	}
 	return countries
}

function counttessels (products) {
//takes an object 'products' whose keys are product names, values qty ordered
//e.g. {'The Master Pack': 274} ...
//probably best to pass a an object that has cancelled orders removed first
//returns the number of Tessels ordered
	var tesselcount = 0;
	for (var product in products) {
		//sorts for only products which include Tessels
		if (((product.indexOf("Tessel") + product.indexOf("Master") + product.indexOf("Everything")) > -3) && ((product.indexOf("T-Shirt") + product.indexOf("Modules")) < -1)) {
			//Betas come with 3 boards, so triples
			if (product.indexOf("Beta") > -1) {
				tesselcount += 3 * products[product];
			} else {
				tesselcount += products[product];
			}
		}
	}
	return tesselcount;
}