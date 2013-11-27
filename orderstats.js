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

//Objective:
//Integrate Celery orders into appropriate Dragon orders
//Find the number of total shipments
//Estimate the total quantity of skus per each order (pick & pack)
//Estimate weight of each order (shipping)
//Find geographic distribution (shipping)


//most important: refactor to match the same person up w self, deal w many modules/line

//need to find a way to read both csvs..
var dragonfile = '../tesselcampaign_orders.csv'
var celeryfile = '../celeryorders.csv'////'./ordertracking.csv';
var csv = require('csv');

csv()
	.from.path(dragonfile, { delimiter: ',', escape: '"' })
	.to.array( function(data) {
		var orders = clean(data);
		var paidorders = selectorders(orders, 'order_status', 'paid_balance');
		var usorders = selectorders(orders, 'buyer_country', 'United States')
		var dragonorders = selectorders(orders, 'order_platform', 'Dragon');
 		var countries = {};
 		for ( var i = 1; i < orders.length; i++) {
 			var country = orders[i][3];
 			if (country in countries) {
 				countries[country] += 1;
 			} else {
 				countries[country] = 1;
 			}
 		}

 		//console.log(sortthings(countthings(paidorders, 'buyer_country')))
 		//console.log(usorders)
 		//console.log(sortthings(countries))
 		//console.log(counttessels(countqtys(paidorders)))
 		//console.log(sortthings(countqtys(usorders, 'buyer_state')));
 		console.log(sortthings(countqtys(paidorders, 'product')));
 		//console.log(sortthings(countqtys(paidorders, 'product')));
 		//console.log(moduledistribution(dragonorders))
 		//console.log(arrayselected(orders))

 	});

 function arrayselected (orders) {
	//takes in orders (only from the Dragon file)
	//returns array of arrays of modules ordered, each order
	headers = orders[0];
	param = headers.indexOf('selected');
	var res = []
 	for ( i = 1; i < orders.length; i++) {
 		res.push(eval(orders[i][param]));
 	}
 	return res;
 }

function selectorders (orders, param, val) {
	//returns from a list of orders only those matching param/val
	var headers = orders[0]
	var param = headers.indexOf(param);
	var selection = [];
	selection.push(headers)
	for (var index = 1; index < orders.length; index++) {
		if (orders[index][param] == val) {
			selection.push(orders[index])
		}
	}
	return selection;
}

function countthings (orders, param) {
	//takes array of orders and a param (categ.)
	//returns an object with numerical values e.g. {'type': 2}
	var types = {};
	headers = orders[0];
	param = headers.indexOf(param);
 	for ( i = 1; i < orders.length; i++) {
 		var type = orders[i][param];
 		if (type in types) {
 			types[type] += 1;
 		} else {
 			types[type] = 1;
 		}
 	}
 	return types
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

function countqtys (orders, param) {
	//takes an array of orders and a column head (param)
	//returns an object with the total quantity of each unique type in param
	//BROKEN? RETURNS NAN
	var types = {};
	headers = orders[0];
	param = headers.indexOf(param);
 	for ( i = 1; i < orders.length; i++) {
 		var type = orders[i][param];
 		var qty = parseInt(orders[i][headers.indexOf('quantity')])
 		if (type in types) {
 			types[type] += qty;
 		} else {
 			types[type] = qty;
 		}
 		if (types[type] == NaN) {
 			console.log(types)
 		}
 	}
 	return types
}

function counttessels (products) {
//takes an object 'products' whose keys are product names, values qty ordered
//e.g. {'The Master Pack': 274} ..., output of countqtys(paidorders, 'product')
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

function countitems (products) {
//takes an object 'products' whose keys are product names, values qty ordered
//e.g. {'The Master Pack': 274} ... output of countqtys(paidorders, 'product')
//returns the number of total items ordered
	var itemcount = 0;
	for (var product in products) {
		if (product.indexOf('Master') > -1) {
			itemcount += 11 * products[product]; //10 modules, 1 tessel
		} else if (product.indexOf('+') > -1) {
			itemcount += 2 * products[product]; //1 module, 1 tessel
		} else if (product.indexOf('Module') > -1) {
			itemcount += products[product]; //1 module
		} else if (product.indexOf('Everything') > -1) {
			itemcount += 14 * products[product]; //13 modules, 1 tessel
		}
	}
	return itemcount;
}

function countmodules (products) {
//takes an object 'products' whose keys are product names, values qty ordered
//e.g. {'The Master Pack': 274} ... output of countqtys(paidorders, 'product')
//returns the number of total classes of modules ordered
	var tessel = 0;
	var classA = 0; var classB = 0;
	var climate = 0; var relay = 0; var ambient = 0;
	var microsd = 0; var servo = 0; var accel = 0;
	var nrf = 0; var gprs = 0; var gps = 0; var ble = 0;
	var rfid = 0; var camera = 0; var audio = 0;
	for (var product in products) {
		var qty = products[product];
		if ((product.indexOf('Master') > -1)
		|| (product.indexOf('Everything') > -1)
		|| (product.indexOf('Beta') > -1)) { //not really accurate on master pack & beta, but w/e
			if (product.indexOf('Beta') > -1) {
				tessel += 3 * qty;
			} else {
				tessel += qty;
			}
			climate += qty; relay += qty; ambient += qty;
			microsd += qty; servo += qty; accel += qty;
			nrf += qty; gprs += qty; gps += qty; ble +=qty;
			rfid += qty; camera += qty; audio += qty;

		} else if (product.indexOf('Climate') > -1) {
			climate += qty;
		} else if (product.indexOf('Relay') > -1) {
			relay += qty;
		} else if (product.indexOf('Ambient') > -1) {
			ambient += qty;
		} else if (product.indexOf('MicroSD') > -1) {
			microsd += qty;
		} else if (product.indexOf('Servo') > -1) {
			servo += qty;
		} else if (product.indexOf('Accelerometer') > -1) {
			accel += qty;
		} else if (product.indexOf('nRF24') > -1) {
			nrf += qty;
		} else if (product.indexOf('GPRS') > -1) {
			gprs += qty;
		} else if (product.indexOf('GPS') > -1) {
			gps += qty;
		} else if (product.indexOf('RFID') > -1) {
			rfid += qty;
		} else if (product.indexOf('Camera') > -1) {
			camera += qty;
		} else if (product.indexOf('Audio') > -1) {
			audio += qty;
		} else if (product.indexOf('Bluetooth') > -1) {
			ble += qty;
		}
	}
	classA = climate + relay + ambient + microsd + servo + accel + nrf;
	classB = gprs + gps + rfid + camera + ble + audio;
	return [tessel, classA, classB, climate, relay, ambient, microsd, servo, accel, nrf, gprs, gps, rfid, camera, ble, audio];
}

function moduledistribution (orders) {
	//supposed to give distribution of modules ordered
	//probably buggy as hell
	ea = countmodules(countqtys(orders, 'product'));
	collector = [];
	for (var j = 3; j < ea.length; j++) {
		collector.push(ea[j]/orders.length);
	}
	return collector;
}

function clean (data) {
	var headers = data[0]
	//console.log(headers)
	function timefixer (timecell) {
		return timecell
	}
	for (var row in data) {
		//standardize countries
		//clean up w csv implementation http://www.paladinsoftware.com/Generic/countries.htm
		var country = data[row][headers.indexOf('buyer_country')]
		if (country == 'US') {
			data[row][headers.indexOf('buyer_country')] = 'United States'
		} else if (country == 'DE') {
			data[row][headers.indexOf('buyer_country')] = 'Denmark'
		} else if (country == 'CA') {
			data[row][headers.indexOf('buyer_country')] = 'Canada'
		} else if (country == 'AU') {
			data[row][headers.indexOf('buyer_country')] = 'Australia'
		} else if (country == 'GB') {
			data[row][headers.indexOf('buyer_country')] = 'United Kingdom'
		} else if (country == 'IT') {
			data[row][headers.indexOf('buyer_country')] = 'Italy'
		} else if (country == 'JP') {
			data[row][headers.indexOf('buyer_country')] = 'Japan'
		} else if (country == 'CH') {
			data[row][headers.indexOf('buyer_country')] = 'China'
		} else if (country == 'RU' || country == 'Russian Federation') {
			data[row][headers.indexOf('buyer_country')] = 'Russia'
		} else if (country == 'NO') {
			data[row][headers.indexOf('buyer_country')] = 'Norway'
		} else if (country == 'SG') {
			data[row][headers.indexOf('buyer_country')] = 'Singapore'
		} else if (country == 'IL') {
			data[row][headers.indexOf('buyer_country')] = 'Israel'
		} else if (country == 'AT') {
			data[row][headers.indexOf('buyer_country')] = 'Austria'
		} else if (country == 'SE') {
			data[row][headers.indexOf('buyer_country')] = 'Sweden'
		} else if (country == 'RO') {
			data[row][headers.indexOf('buyer_country')] = 'Romania'
		}
		country = data[row][headers.indexOf('buyer_country')]
		//standardize states
		if (country == 'United States') {
			data[row][headers.indexOf('buyer_state')] = data[row][headers.indexOf('buyer_state')].toUpperCase()
			state = data[row][headers.indexOf('buyer_state')];
			if (state == 'CALIFORNIA' || state == 'CA - CALIFORNIA' || state == 'CALIFORNIA (CA)') {
				data[row][headers.indexOf('buyer_state')] = 'CA'
			} else if (state == 'NEW YORK') {
				data[row][headers.indexOf('buyer_state')] = 'NY'
			} else if (state == 'TEXAS' || state == 'TX - TEXAS' || state == 'TX-TEXAS') {
				data[row][headers.indexOf('buyer_state')] = 'TX'
			} else if (state == 'NORTH CAROLINA') {
				data[row][headers.indexOf('buyer_state')] = 'NC'
			} else if (state == 'COLORADO' || state == 'CO - COLORADO') {
				data[row][headers.indexOf('buyer_state')] = 'CO'
			} else if (state == 'VIRGINIA') {
				data[row][headers.indexOf('buyer_state')] = 'VA'
			} else if (state == 'FLORIDA') {
				data[row][headers.indexOf('buyer_state')] = 'FL'
			} else if (state == 'ILLINOIS') {
				data[row][headers.indexOf('buyer_state')] = 'IL'
			} else if (state == 'TENNESSEE') {
				data[row][headers.indexOf('buyer_state')] = 'TN'
			} else if (state == 'GEORGIA') {
				data[row][headers.indexOf('buyer_state')] = 'GA'
			} else if (state == 'SOUTH CAROLINA') {
				data[row][headers.indexOf('buyer_state')] = 'SC'
			} else if (state == 'MINNESOTA') {
				data[row][headers.indexOf('buyer_state')] = 'MN'
			} else if (state == 'MICHIGAN') {
				data[row][headers.indexOf('buyer_state')] = 'MI'
			} else if (state == 'NEW JERSEY') {
				data[row][headers.indexOf('buyer_state')] = 'NJ'
			} else if (state == 'WISCONSIN') {
				data[row][headers.indexOf('buyer_state')] = 'WI'
			} else if (state == 'MARYLAND') {
				data[row][headers.indexOf('buyer_state')] = 'MD'
			} else if (state == 'OREGON') {
				data[row][headers.indexOf('buyer_state')] = 'OR'
			} else if (state == 'WASHINGTON' || state == 'WA - WASHINGTON') {
				data[row][headers.indexOf('buyer_state')] = 'WA'
			} else if (state == 'MASSACHUSETTS' || state == 'MA - MASSACHUSETTS') {
				data[row][headers.indexOf('buyer_state')] = 'MA'
			} else if (state == 'PUERTO RICO') {
				data[row][headers.indexOf('buyer_state')] = 'PR'
			} else if (state == 'CONNECTICUT') {
				data[row][headers.indexOf('buyer_state')] = 'CT'
			} else if (state == 'DELAWARE') {
				data[row][headers.indexOf('buyer_state')] = 'DE'
			} else if (state == 'MAINE') {
				data[row][headers.indexOf('buyer_state')] = 'ME'
			} else if (state == 'ARIZONA') {
				data[row][headers.indexOf('buyer_state')] = 'AZ'
			} else if (state == 'NEBRASKA') {
				data[row][headers.indexOf('buyer_state')] = 'NE'
			} else if (state == 'OH - OHIO') {
				data[row][headers.indexOf('buyer_state')] = 'OH'
			} else if (state == 'IDAHO') {
				data[row][headers.indexOf('buyer_state')] = 'ID'
			} else if (state == 'MISSOURI' || state == 'MO-MISSOURI') {
				data[row][headers.indexOf('buyer_state')] = 'MO'
			} else if (state == 'VERMONT') {
				data[row][headers.indexOf('buyer_state')] = 'VT'
			} else if (state == 'PENNSYLVANIA') {
				data[row][headers.indexOf('buyer_state')] = 'PA'
			} else if (state == 'DISTRICT OF COLUMBIA') {
				data[row][headers.indexOf('buyer_state')] = 'DC'
			} else if (state == 'NEVADA') {
				data[row][headers.indexOf('buyer_state')] = 'NV'
			} else if (state == 'UTAH') {
				data[row][headers.indexOf('buyer_state')] = 'UT'
			}
		}
	}
	return(data)
}