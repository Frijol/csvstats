var file = './orders-2013-10-18_TESSEL_FINAL.csv';
var csv = require('csv');

csv()
	.from.path(file, { delimiter: ',', escape: '"' })
	.to.array( function(orders){
 		var headers = orders[0];
 		var countries = {};
 		for ( i = 1; i < orders.length; i++) {
 			var country = orders[i][14];
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
    	console.log(sortable.sort(function(a, b) {return b[1] - a[1]}));
 	});