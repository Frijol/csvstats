module.exports = function clean (data) {
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