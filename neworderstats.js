//Objective:
//Integrate Dragon and Celery orders for uniformity
//Split each order into a separate line per individual item
//Group orders sent to the same person
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
		orders = integrate(dragondata, celerydata);
		splitrows(orders);
		//matchnames(orders);
	})
})

function splitrows (orders) {
	//takes in orders, creates a new line for each sku in the order
	//returns 'lines', each of which has one item
	var lines = [];
	for (var order in orders) {
		index = 0; //for indexing lines
		console.log(orders[order])
		//determine how many items are in each order
		//iterate through items contained within each order
		//index each item with a new line ('tessel', 'relay'...)
		///as a new property of the otherwise copied order object
	}
}

function integrate (dragondata, celerydata) {
	//takes input as shown MUST BE IN ORDER
	//returns orders as an array of objects
	var orders = []
	celerydata.shift()
	dragondata.shift()
	//objectify Celery orders
	for (var i in celerydata) {
		row = celerydata[i];
		orders[i] = {
			order_id: row[0], 
			date: row[1],
			order_status: row[2],
			shipped_status: row[3],
			buyer_email: row[4],
			buyer_name: row[5],
			buyer_company: row[6],
			buyer_street: row[7],
			buyer_street2: row[8],
			buyer_city: row[9],
			buyer_state: row[10],
			buyer_zip: row[11],
			buyer_country: row[12],
			buyer_phone: row[13],
			payment_method: row[14],
			order_total: row[15],
			order_taxes: row[16],
			order_notes: row[17],
			coupon_code: row[18],
			product: row[19],
			quantity: row[20],
			unit_price: row[21],
			line_total: row[22],
			options_name_1: row[23],
			options_value_1: row[24],
			options_price_1: row[25],
			platform: 'Celery'
		}
	}
	//map & objectify Dragon orders
	for (var j in dragondata) {
		row = dragondata[j];
		orders[i + j] = {
			order_id: row[8], //row[0].split('(')[1].split(')')[0],
			date: row[4], //TODO: CONVERT TO CELERY TIME
			order_status: 'paid_balance',
			shipped_status: '',
			buyer_email: row[5], //
			buyer_name: row[18], //
			buyer_company: '',
			buyer_street: row[15], //
			buyer_street2: row[16], //
			buyer_city: row[2], //
			buyer_state: row[12], //TODO: MAKE UNIFORM
			buyer_zip: row[9], //
			buyer_country: row[3],//TODO: MAKE UNIFORM
			buyer_phone: '',
			payment_method: row[10], //'preference'
			order_total: row[17], //
			order_taxes: row[14], //'shipping_cost'
			order_notes: '',
			coupon_code: '',
			product: row[6], //
			quantity: row[11], //
			unit_price: row[1], //
			line_total: row[17], //
			options_name_1: row[7], //'incentive_name'
			options_value_1: eval(row[13]), //
			options_price_1: '',
			platform: 'Dragon'
		}
	}
	return orders
}

function matchnames (orders) {
	namelist = {}
	for (var i in orders){
		name = orders[i].buyer_name.toUpperCase()
		if (name in namelist) {
			console.log(orders[i])
		}
		namelist[name] += 1
	}
}