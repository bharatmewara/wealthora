const http = require('http');

async function testEndpoint(path, name) {
  return new Promise((resolve) => {
    const req = http.get({ hostname: 'localhost', port: 5002, path }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          console.log(`${name}: status ${res.statusCode}, items: ${Array.isArray(data) ? data.length : '?'}`);
        } catch (e) {
          console.log(`${name}: status ${res.statusCode}, response: ${body.substring(0, 100)}`);
        }
        resolve();
      });
    });
    req.on('error', err => {
      console.log(`${name}: ERROR - ${err.message}`);
      resolve();
    });
  });
}

(async () => {
  await testEndpoint('/api/services', 'Services');
  await testEndpoint('/api/testimonials', 'Testimonials');
  await testEndpoint('/api/enquiries', 'Enquiries');
  await testEndpoint('/api/hero', 'Hero');
  await testEndpoint('/api/blogs', 'Blogs');
  process.exit(0);
})();
