//Objective:
//Integrate Dragon and Celery orders for uniformity
//Split each order into a separate line per individual item
//Sort into packages
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
		lines = splitRows(orders);
		packages = pack(lines)
		console.log(packages)
		//console.log(lines.sort(compare))
	})
})

function pack (lines) {
	//takes lines, 1 item/line; for each address creates a 'package' of all items to send there
	//returns 'packages' object of 'package's array of 'line' objects
	packages = {}
	lines.forEach(function (line) {
		var address = line.buyer_country + ' ' + line.buyer_zip + ' ' + line.buyer_street + ' ' + line.buyer_street2 + ' ' + line.buyer_name;
		if (address in packages) {
			//if the address is already in addresses, add this line to its array of lines
			packages[address].push(line);
		} else {
			//otherwise, make this address a new key and put the first line in the array
			packages[address] = [];
			packages[address].push(line);
		}
	});
	return packages;
}

function compare (a, b) {
  if (a.buyer_email < b.buyer_email)
     return -1;
  if (a.buyer_email > b.buyer_email)
    return 1;
  return 0;
}

function splitRows (orders) {
	//takes in orders, creates a new line for each item in the order
	//returns 'lines', each of which has one item
	var lines = [];
	index = 0; //for indexing lines
	orders.forEach( function (order) {
		//make array for 'one of everything' orders
		if (order.product.indexOf('Everything') > -1) {
			order.options_value_1 = ['accelerometer', 'ble', 'gps', '2g', 'nrf', 'servo', 'ambient', 'camera', 'relay', 'audio', 'climate', 'microsd', 'rfid']
		}
		//iterate for 'quantity' value
		for (var num = 0; num < parseInt(order.quantity); num ++) {
			lines[index] = order;
			lines[index].quantity = 1;
			index ++;
			//UNCHECKED: how are e.g. multiple master pack orders handled?
		}
	});
	var currentLength = index;
	for (var line = 0; line < currentLength; line ++) {
		//make a line for each tessel
		var productName = lines[line].product;
		if ((productName.indexOf('Master') > -1)
		|| (productName.indexOf('Everything') > -1)
		|| (productName.indexOf('One') > -1)) {
			lines[index] = lines[line];
			lines[index].item = 'tessel'; //setting new property 'item'
			index ++;
		} else if ((productName.indexOf('Module') > -1) && (lines[line].options_name_1 == '')) {
			//make a new line for each module
			lines[index] = lines[line];
			lines[index].item = productName.split(' ')[0].split('/')[0].toLowerCase();
			index++;
		}
		//make a new line for each item in arrays of items
		if (typeof lines[line].options_value_1 == 'object') {
			for (var x in lines[line].options_value_1) {
				lines[index] = lines[line];
				lines[index].item = lines[line].options_value_1[x];
				index ++;
				//BUG: sometimes just repeats the last value in the array over and over
			}
		//make a new line for each item that is already a string
		} 
		else if ((typeof lines[line].options_value_1 == 'string') && (productName.indexOf('One') > -1)) {
			lines[index] = lines[line];
			lines[index].item = lines[line].options_value_1.toLowerCase();
			index ++;
		}
	}
	//console.log(lines);
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