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


csv()
	.from.path(file, { delimiter: ',', escape: '"' })
	.to.array( function(orders){
 		var headers = orders[0];
 		var countries = {};
 		for ( i = 1; i < orders.length; i++) {
 			var country = orders[i][13];
 			if (country in countries) {
 				countries[country] += 1;
 			} else {
 				countries[country] = 1;
 			}
 		}
 		var sortable = [];
		for (var country1 in countries) {
			sortable.push([country1, countries[country1]]);
		}
    	//console.log(sortable.sort(function(a, b) {return b[1] - a[1]}));
 	});