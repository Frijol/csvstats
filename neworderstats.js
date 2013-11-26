//Objective:
//Integrate Celery orders into appropriate Dragon orders
//Find the number of total shipments
//Estimate the total quantity of skus per each order (pick & pack)
//Estimate weight of each order (shipping)
//Find geographic distribution (shipping)

var csv = require('csv');
var dragonfile = '../tesselcampaign_orders.csv'
var celeryfile = '../celeryorders.csv'////'./ordertracking.csv';

csv().from.path(dragonfile, {delimiter: ',', escape: '"'}).to.array(function(dragondata) {
	csv().from.path(celeryfile, {delimiter: ',', escape: '"'}).to.array(function(celerydata) {
		console.log(dragondata);
		console.log(celerydata);
	})
})