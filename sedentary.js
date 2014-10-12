var http = require('http');
var cheerio = require('cheerio');
var urllib = require('url');
var querystring = require('querystring');

// make this 2 instead of 3 when it's a single-command (no invoking with node)
if (process.argv.length < 3 || process.argv[1] == '-h' || process.argv[1] == '--help') {
  console.log('try:\n\n    node sedentary.js remove blank lines')
  process.exit(0);
}

searchTerms = process.argv.filter(function (s) {
  return s != 'node' &&
         s.slice(-12) != 'sedentary.js';
});
searchTerms.push('sed');

console.log('search terms:', searchTerms);

function httpCallback(f) {
  return function (response) {
    var buf = '';

    response.on('data', function (chunk) {
      buf += chunk;
    });

    response.on('end', function() {
      f(buf);
    });
  };
}

function serpCallback() {
  return httpCallback(function (page) {
    //console.log(page);
    var $ = cheerio.load(page);
    $('h3.r a').each(function () {
      console.log($(this).text());
    });
    var googleUrl = urllib.parse('http://google.com' + $('h3.r a').first().map(function () {
      console.log($(this).attr('href'));
      return $(this).attr('href');
    })[0]);
    sedCmdFromResultUrl(querystring.parse(googleUrl.query).q);
  });
}


http.request({
  host: 'www.google.com',
  path: '/search?q=' + searchTerms.join('+'),
  headers: {
    'User-Agent': 'Sedentary'
  }
}, serpCallback()).end();

function resultCallback() {
  return httpCallback(function (page) {
    var $ = cheerio.load(page);
    var lines = [];
    $('code,pre').each(function () {
      var codelines = $(this).text().split('\n');
      console.log(codelines);
      // my kingdom for a flatmap
      for (var i = 0; i < codelines.length; i++) {
        var m = codelines[i].match(/sed( -[er]+)? +(['"])[^']*\2/);
        if (m != null) {
          lines.push(m[0]);
        }
      }
    });
    var hist = {};
    lines.forEach(function (line) {
      if (!(line in hist)) {
        hist[line] = 0;
      }
      hist[line] = hist[line] + 1;
    });
    var topScore = 0;
    var topCommand = '';
    Object.keys(hist).forEach(function (cmd) {
      if (hist[cmd] > topScore) {
        topCommand = cmd;
        topScore = hist[cmd];
      }
    });
    console.log(topCommand);
  });
}

function sedCmdFromResultUrl(resultUrl) {
  //console.log(resultUrl);
  var parsedUrl = urllib.parse(resultUrl);

  http.request({
    host: parsedUrl.host,
    path: parsedUrl.path,
    headers: {
      'User-Agent': 'Sedentary'
    }
  }, resultCallback()).end();
}
