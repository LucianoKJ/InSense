const express = require('express');
const path = require('path');

const app = express()

app.use(express.static('build'));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

const port = 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})