const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const port = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	if (req.method === 'OPTIONS') {
		return res.status(200);
	}
	next();
});

app.use('/', (req, res, next) => {
    const url = decodeURIComponent(req.query.url);
    const stringUrl = url.toString();
    axios.get(stringUrl).then(resp => {
        res.send(resp.data)
    }).catch(err => {
        next(err)
    })
})

app.use((error, req, res, next) => {
    const errorFile = 'error.txt';
	const status = error.stausCode || 500;
    const data = error.data;
	console.log(error)
    fs.appendFile(errorFile, `${error}\r\n`, () => {console.log('Error written')})
	res.status(status).send({
		message: error,
		data: data
	});
});

app.listen(port, () => {
    console.log(`Running on ${port}`);
})

