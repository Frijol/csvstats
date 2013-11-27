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
		lines = splitrows(orders);
		//matchnames(orders);
	})
})

function splitrows (orders) {
	//takes in orders, creates a new line for each item in the order
	//returns 'lines', each of which has one item
	var lines = [];
	index = 0; //for indexing lines
	for (var order in orders) {
		//add array of modules to 'one of everything' option
		if (orders[order].product.indexOf('Everything') > -1) {
			orders[order].options_value_1 = ['accelerometer', 'ble', 'gps', '2g', 'nrf', 'servo', 'ambient', 'camera', 'relay', 'audio', 'climate', 'microsd', 'rfid']
		}
		//iterate for 'quantity' value
		for (var num = 0; num < parseInt(orders[order].quantity); num ++) {
			lines[index] = orders[order];
			lines[index].quantity = 1;
			index ++
			//UNCHECKED: how are e.g. multiple master pack orders handled?
		}
		//make array for 'one of everything' orders
	}
	var currentlength = index;
	for (var line = 0; line < currentlength; line ++) {
		//make line for each tessel IGNORING BETAS, THANKS, TEES
		if ((lines[line].product.indexOf('Master') > -1)
		|| (lines[line].product.indexOf('Everything') > -1)
		|| (lines[line].product.indexOf('One') > -1)
		|| (lines[line].product.indexOf('free') > -1)) {
			lines[index] = orders[order];
			lines[index].item = 'tessel'; //setting new property 'item'
			index ++;
			//make a new line for each item in Dragon's 'selected' and for 'everything's
			if (typeof lines[line].options_value_1 == 'object') {
				for (x in lines[line].options_value_1) {
					lines[index] = lines[line];
					lines[index].item = lines[line].options_value_1[x];
					index ++;
				}
			//make a new line for each item in Celery's options
			} else if (lines[line].options_value_1 == 'string') {
				lines[index] = lines[line];
				lines[index].item = lines[line].options_value_1.toLowerCase();
				index ++;
			}
		} else if ((lines[line].product.indexOf('est') + lines[line].product.indexOf('hank') + lines[line].product.indexOf('hirt')) < 0) {
			console.log(lines[line])
		}
		//make a new line for each module
		//fuck I got distracted but I need to do something like take the ifs out of the bigger if
	}
	//console.log(lines)
	return lines
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
			product: row[7], //
			quantity: row[11], //
			unit_price: row[1], //
			line_total: row[17], //
			options_name_1: row[6], //
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