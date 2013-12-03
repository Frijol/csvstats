//Objective:
//Integrate Dragon and Celery orders for uniformity
//Split each order into a separate line per individual item
//Sort into packages
//Remove Celery orders with no Dragon counterpart
//Find the number of total shipments
//Estimate the total quantity of skus per each order (pick & pack)
//Estimate weight of each order (shipping)
//Find geographic distribution (shipping)

/*
UNSOLVED MYSTERIES
Why are there so many tessels?
Why do Master Packs and Everythings repeat?
*/

var csv = require('csv');
var dragonfile = '../tesselcampaign_orders.csv'
var celeryfile = '../celeryorders.csv'////'./ordertracking.csv';

//Read both order files
csv().from.path(dragonfile, {delimiter: ',', escape: '"'}).to.array(function(dragonData) {
	csv().from.path(celeryfile, {delimiter: ',', escape: '"'}).to.array(function(celeryData) {
		objects = objectify(dragonData, celeryData);
		orders = clean(objects);
		quantOrders = multiply(objects);
		lines = splitRows(quantOrders);
		items = getRidOfStuff(lines); //removes betas, tees, thanks, tests, failed Celeries
		packages = pack(items);
		//console.log(Object.keys(packages))
		selection = requireDragon(packages);
		//getDistr(items, 'buyer_country')
		//printStats(selection);
		//console.log(itemDistr(selection));
	});
})

function findCustomerByEmail (email) {
	objects.forEach(function(entry) {
		if (entry.buyer_email == email) {
			console.log(entry)
		}
	});
}

function getDistr (selection, attr) {
	//prints stats about elements of selection.attr NOT WORKING W ARG
	var attrs = {}
	selection.forEach(function (entry) {
		var attribute = entry.item//MANUAL RIGHT NOW
		if (attribute in attrs) {
			attrs[attribute] ++;
		} else {
			attrs[attribute] = 1;
		}
	});
	console.log(sortObjIntoArr(attrs))
}

function sortObjIntoArr (obj) {
	var sortable = [];
	for (var entry in obj) {
		sortable.push([entry, obj[entry]])
	}
	return sortable.sort(function(a, b) {return b[1] - a[1]})
}

function printStats (selection) {
	console.log('Total number of shipments: ' + selection.length);
		// console.log('Distribution of items per shipment: '); //sorted array [#items: #shipments]
		// console.log('Weight distribution of shipments: '); //sorted array [weight: #shipments]
		// console.log('Geographic distribution of shipments: '); //sorted array [country: #shipments]
		// console.log('Per country: '); //each country is a key in an object. The value is a sorted
		// 							//array of the weight distribution within the country.
}

function itemDistr (selection) {
	//find the distribution of items/package (fulfillment)
	var amounts = {};
	totalcount = 0;
	selection.forEach(function(pkg) {
		var amount = pkg.length;
		if (amount in amounts) {
			amounts[amount] ++;
			totalcount++;
		} else {
			amounts[amount] = 1;
			totalcount++;
		}
	});
	for (i in amounts) {
		console.log(amounts[i]/totalcount)
	}
	return amounts;
}

function weightDistribution (selection) {
	//set weight of each item (oz.)
	tesselWt = 1.8;
	accelWt = .1;
	relayWt = .2;
	climateWt = .1;
	ambientWt = .1;
	servoWt = 7;
	microsdWt = .2;
	nrfWt = .2;
	rfidWt = .7;
	audioWt = .2;
	cameraWt = 2.1;
	gprsWt = .2;
	gpsWt = .2;
	bleWt = .1;
	bagWt = .1;
	boxWt = .2;
	//add up weight of each item, bag for each item, box for each shipment
	//store these vals in an object: {package: weight}
	//make a sorted object: {weight: #packages}
}

function requireDragon (packages) {
	//returns only those packages which include at least one Dragon order
	selection = []; //BETTER IF THIS WERE AN OBJECT
	for (i in packages) {
		dragonCount = 0;
		packages[i].forEach(function (line) {
			if (line.orderPlatform == 'Dragon') {
				dragonCount += 1;
			}
		});
		if (dragonCount > 0) {
			selection.push(packages[i]);
		}
	}
	return selection;
}

function pack (items) {
	//takes lines, 1 item/line; for each address creates a 'package' of all items to send there
	//returns 'packages' object of 'package's array of 'line' objects
	packages = {}
	items.forEach(function (line) {
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

function getRidOfStuff (lines) {
	//gets rid of lines for betas, tests, tees, thanks
	var items = []
	lines.forEach(function (line) {
		var productName = line.product
		if ((productName.indexOf('est') == -1) && (productName.indexOf('irt') == -1) && (productName.indexOf('hank') == -1)) {
			items.push(line)
		}
	})
	return items
}

function multiply (orders) {
	var index = 0;
	var quantOrders = [];
	orders.forEach(function (order) {
		for (var num = 0; num < parseInt(order.quantity); num++) {
			quantOrders[index] = order;
			quantOrders[index].quantity = 1;
			index++
		}
	});
	return quantOrders;
}

function splitRows (quantOrders) {
	//returns 'lines', each of which has one item
	index = 0;
	var lines = []
	quantOrders.forEach(function (order) {
		for (var myVar in order.options_value_1) {
			lines[index] = order;
			lines[index].item = order.options_value_1[myVar];
			index++;
		}
	});
	return lines
}

function clean (objects) {
	for (var i in objects) {
		entry = objects[i];
		//standardize countries
		var country = entry.buyer_country;
		if (country == 'US') {
			entry.buyer_country = 'United States'
		} else if (country == 'DE') {
			entry.buyer_country = 'Denmark'
		} else if (country == 'CA') {
			entry.buyer_country = 'Canada'
		} else if (country == 'AU') {
			entry.buyer_country = 'Australia'
		} else if (country == 'GB') {
			entry.buyer_country = 'United Kingdom'
		} else if (country == 'IT') {
			entry.buyer_country = 'Italy'
		} else if (country == 'JP') {
			entry.buyer_country = 'Japan'
		} else if (country == 'CH') {
			entry.buyer_country = 'Switzerland'
		} else if (country == 'RU' || country == 'Russian Federation') {
			entry.buyer_country = 'Russia'
		} else if (country == 'NO') {
			entry.buyer_country = 'Norway'
		} else if (country == 'SG') {
			entry.buyer_country = 'Singapore'
		} else if (country == 'IL') {
			entry.buyer_country = 'Israel'
		} else if (country == 'AT') {
			entry.buyer_country = 'Austria'
		} else if (country == 'SE') {
			entry.buyer_country = 'Sweden'
		} else if (country == 'RO') {
			entry.buyer_country = 'Romania'
		} else if (country == 'TW' || country == 'Taiwan, Province of China') {
			entry.buyer_country = 'Taiwan'
		} else if (country == 'IE') {
			entry.buyer_country = 'Ireland'
		} else if (country == 'UA') {
			entry.buyer_country = 'Ukraine'
		} else if (country == 'CN') {
			entry.buyer_country = 'China'
		} else if (country == 'Moldova, Republic of') {
			entry.buyer_country = 'Moldova'
		} else if (country == 'Korea, Republic of') {
			entry.buyer_country = 'Korea'
		}
		country = entry.buyer_country;
		//standardize states
		if (country == 'United States') {
			entry.buyer_state = entry.buyer_state.toUpperCase();
			state = entry.buyer_state;
			if (state == 'CALIFORNIA' || state == 'CA - CALIFORNIA' || state == 'CALIFORNIA (CA)') {
				entry.buyer_state = 'CA'
			} else if (state == 'NEW YORK') {
				entry.buyer_state = 'NY'
			} else if (state == 'TEXAS' || state == 'TX - TEXAS' || state == 'TX-TEXAS') {
				entry.buyer_state = 'TX'
			} else if (state == 'NORTH CAROLINA') {
				entry.buyer_state = 'NC'
			} else if (state == 'COLORADO' || state == 'CO - COLORADO') {
				entry.buyer_state = 'CO'
			} else if (state == 'VIRGINIA') {
				entry.buyer_state = 'VA'
			} else if (state == 'FLORIDA') {
				entry.buyer_state = 'FL'
			} else if (state == 'ILLINOIS') {
				entry.buyer_state = 'IL'
			} else if (state == 'TENNESSEE') {
				entry.buyer_state = 'TN'
			} else if (state == 'GEORGIA') {
				entry.buyer_state = 'GA'
			} else if (state == 'SOUTH CAROLINA') {
				entry.buyer_state = 'SC'
			} else if (state == 'MINNESOTA') {
				entry.buyer_state = 'MN'
			} else if (state == 'MICHIGAN') {
				entry.buyer_state = 'MI'
			} else if (state == 'NEW JERSEY') {
				entry.buyer_state = 'NJ'
			} else if (state == 'WISCONSIN') {
				entry.buyer_state = 'WI'
			} else if (state == 'MARYLAND') {
				entry.buyer_state = 'MD'
			} else if (state == 'OREGON') {
				entry.buyer_state = 'OR'
			} else if (state == 'WASHINGTON' || state == 'WA - WASHINGTON') {
				entry.buyer_state = 'WA'
			} else if (state == 'MASSACHUSETTS' || state == 'MA - MASSACHUSETTS') {
				entry.buyer_state = 'MA'
			} else if (state == 'PUERTO RICO') {
				entry.buyer_state = 'PR'
			} else if (state == 'CONNECTICUT') {
				entry.buyer_state = 'CT'
			} else if (state == 'DELAWARE') {
				entry.buyer_state = 'DE'
			} else if (state == 'MAINE') {
				entry.buyer_state = 'ME'
			} else if (state == 'ARIZONA') {
				entry.buyer_state = 'AZ'
			} else if (state == 'NEBRASKA') {
				entry.buyer_state = 'NE'
			} else if (state == 'OH - OHIO') {
				entry.buyer_state = 'OH'
			} else if (state == 'IDAHO') {
				entry.buyer_state = 'ID'
			} else if (state == 'MISSOURI' || state == 'MO-MISSOURI') {
				entry.buyer_state = 'MO'
			} else if (state == 'VERMONT') {
				entry.buyer_state = 'VT'
			} else if (state == 'PENNSYLVANIA') {
				entry.buyer_state = 'PA'
			} else if (state == 'DISTRICT OF COLUMBIA') {
				entry.buyer_state = 'DC'
			} else if (state == 'NEVADA') {
				entry.buyer_state = 'NV'
			} else if (state == 'UTAH') {
				entry.buyer_state = 'UT'
			}
		}
		//make all option names arrays
		if (typeof entry.options_value_1 == 'string') {
			entry.options_value_1 = [entry.options_value_1.toLowerCase()]
		} else if (Object.prototype.toString.call(entry.options_value_1) === '[object Array]') {
			//may God preserve you just as you are, you beautiful bastard
		} else {
			entry.options_value_1 = []
		}
		//make array for 'one of everything' orders
		if (entry.product.indexOf('Everything') > -1) {
			entry.options_value_1.push('accelerometer', 'ble', 'gps', 'gprs', 'nrf', 'servo', 'ambient', 'camera', 'relay', 'audio', 'climate', 'microsd', 'rfid');
		}
		//make a line for each tessel
		var productName = entry.product;
		if ((productName.indexOf('Master') > -1)
		|| (productName.indexOf('Everything') > -1)
		|| (productName.indexOf('One') > -1)) {
			entry.options_value_1.push('tessel');
		} else if ((productName.indexOf('Module') > -1) && (productName.indexOf('Class') == -1)) {
			entry.options_value_1.push(productName);
		}
		//standardize product names
		for (var now in entry.options_value_1) {
			thisName = entry.options_value_1[now];
			if (thisName == 'nrf24' || thisName == 'nRF24 Module') {
				entry.options_value_1[now] = 'nrf'
			} else if (thisName == 'sdcard' || thisName == 'MicroSD Module') {
				entry.options_value_1[now] = 'microsd'
			} else if (thisName == '2g' || thisName == 'GPRS/SIM Module') {
				entry.options_value_1[now] = 'gprs'
			} else if (thisName == 'bluetooth low energy' || thisName == 'Bluetooth Low Energy Module') {
				entry.options_value_1[now] = 'ble'
			} else if (thisName == 'audio module' || thisName == 'Audio Module') {
				entry.options_value_1[now] = 'audio'
			} else if (thisName == 'GPS Module') {
				entry.options_value_1[now] = 'gps'
			} else if (thisName == 'Accelerometer Module') {
				entry.options_value_1[now] = 'accelerometer'
			} else if (thisName == 'RFID Module') {
				entry.options_value_1[now] = 'rfid'
			} else if (thisName == 'Camera Module') {
				entry.options_value_1[now] = 'camera'
			} else if (thisName == 'Servo Module') {
				entry.options_value_1[now] = 'servo'
			} else if (thisName == 'Climate Module') {
				entry.options_value_1[now] = 'climate'
			} else if (thisName == 'Ambient (Light and Sound) Module') {
				entry.options_value_1[now] = 'ambient'
			} else if (thisName == 'Relay Module') {
				entry.options_value_1[now] = 'relay'
			}
		}
	}
	return objects;
}

function objectify (dragonData, celeryData) {
	//takes input as shown MUST BE IN ORDER
	//returns orders as an array of objects
	var orders = []
	celeryData.shift()
	dragonData.shift()
	var i = 0;
	//objectify Celery orders
	celeryData.forEach(function (row) {
		orders[i++] = {
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
			orderPlatform: 'Celery'
		}
	});
	//map & objectify Dragon orders
	dragonData.forEach(function (row) {
		orders[i++] = {
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
			orderPlatform: 'Dragon'
		}
	});
	return orders;
}