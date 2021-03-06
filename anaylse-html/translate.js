var http = require('http'),
      querystring = require('querystring');

module.exports = function(params, callback) {
	if (typeof params === 'string') {
		params = {
			query: params
		};
	}

	params = {
		from: params.from || 'zh',
		to: params.to || 'en',
		query: params.query || ''
	};

	let data = querystring.stringify(params);
	let	options = {
			host: 'fanyi.baidu.com',
			port: 80,
			path: '/v2transapi',
			method: 'POST',
			headers: {
				'Content-Type':'application/x-www-form-urlencoded',
				'Content-Length': data.length
			}
		};

	var req = http.request(options, function(res) {
		var result = '';

		res.setEncoding('utf8');
		res.on('data', function(data) {
      console.log('返回是什么', res)
			result += data;
		});
		res.on('end', function() {
      console.log('resultresult', result)
			var obj = JSON.parse(result),
				str = obj.trans_result.data[0].dst;
			callback(str);
		});
	});

	req.on('error', function(err) {
		console.log(err);
		setTimeout(function() {
			translation(query, callback);
		}, 3000);
	});

	req.write(data);
	req.end();
};