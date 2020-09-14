const app = require('express')();
const bodyParser = require('body-parser');
const db = require('./db.json')
const axios = require('axios')
const uniqid = require('uniqid');
var cors = require('cors')
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Get data with the last in 30min
app.get('/datas',(req,res) => {
    let currentDate = new Date();
    
    let result = db.filter(data=>{
        let takenDate = new Date(data.createdTime);
        return (Math.abs(currentDate - takenDate) < 1800000)
    })
    res.send(result)
})

//Post data
app.post('/datas',(req,res) => {
    const newData={
        id: uniqid(),
        ttfb: req.body.ttfb,
        fpc: req.body.fpc,
        domLoad: req.body.domLoad,
        windowLoad: req.body.windowLoad,
        createdTime: new Date()
    }
    db.push(newData);
    res.status(200).send(newData)
})

app.listen(process.env.PORT || 4000, () => {
    console.log('server is working..')
})
