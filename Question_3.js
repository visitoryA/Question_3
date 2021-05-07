const url = 'codequiz.azurewebsites.net';
const arg = process.argv.slice(2)[0];
const mapper = new Map();
const https = require('https');


const options = {
    hostname: url,
    path: '/',
    method: 'GET',
    headers: { 
        'Cookie': 'hasCookie=true'
    }
}

https.get(options, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        try {
            const data = rawData.split('</script>')[1].split('<table>')[1].split('</table>')[0];
            const trData = data.split('</tr>').slice(1);
            for (let i = 0; i < trData.length; i++) {
                const ls = trData[i].split('<td>');
                if (ls && ls.length > 2) {
                    const key = ls[1].replace(' ', '').replace('</td>', '');
                    const val = ls[2].replace(' ', '').replace('</td>', '');
                    mapper.set(key, val);
                }
            }
            console.log(mapper.get(arg));
        } catch (e) {
            console.log(e.message);
        }
    });
});