//Objective:
//Integrate Dragon and Celery orders for uniformity
//Combine shipments where possible
//Remove Celery orders with no Dragon counterpart
//Find the number of total shipments
//Estimate the total quantity of skus per each order (pick & pack)
//Estimate weight of each order (shipping)
//Find geographic distribution (shipping)

var csv = require('csv');
var dragonfile = '../tesselcampaign_orders.csv'
var celeryfile = '../celeryorders.csv'////'./ordertracking.csv';

//Read both order files
csv().from.path(dragonfile, {delimiter: ',', escape: '"'}).to.array(function(dragondata) {
	csv().from.path(celeryfile, {delimiter: ',', escape: '"'}).to.array(function(celerydata) {
		integrate(dragondata, celerydata);
	})
})

function integrate (dragondata, celerydata) {
	var orders = []
	//objectify Celery orders
	for (i = 1; i < celerydata.length; i++) {
		orders[i-1] = {
			order_id: celerydata[i][0], 
			date: celerydata[i][1],
			order_status: celerydata[i][2],
			shipped_status: celerydata[i][3],
			buyer_email: celerydata[i][4],
			buyer_name: celerydata[i][5],
			buyer_company: celerydata[i][6],
			buyer_street: celerydata[i][7],
			buyer_street2: celerydata[i][8],
			buyer_city: celerydata[i][9],
			buyer_state: celerydata[i][10],
			buyer_zip: celerydata[i][11],
			buyer_country: celerydata[i][12],
			buyer_phone: celerydata[i][13],
			payment_method: celerydata[i][14],
			order_total: celerydata[i][15],
			order_taxes: celerydata[i][16],
			order_notes: celerydata[i][17],
			coupon_code: celerydata[i][18],
			product: celerydata[i][19],
			quantity: celerydata[i][20],
			unit_price: celerydata[i][21],
			line_total: celerydata[i][22],
			options_name_1: celerydata[i][23],
			options_value_1: celerydata[i][24],
			options_price_1: celerydata[i][25]
		}
	}
	console.log(orders)
	console.log(dragondata[0])
	console.log(celerydata[0])
}