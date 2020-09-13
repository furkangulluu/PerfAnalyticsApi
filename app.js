const app = require('express')();
const db = require('./db.json');
var fs = require('fs');
const bodyParser = require('body-parser');
const uniqid = require('uniqid');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Get data with the last in 30min
app.get('/datas',(req,res) => {
    let currentDate = new Date();
    
    var result = db.datas.filter(data=>{
        let takenDate = new Date(data.createdTime);
        return (Math.abs(currentDate - takenDate)< 18000000)
    })

    if(result.length>0){
        res.status(200).send(result)
    }else{
        res.status(404).send({message: 'Data not found'})
    }
})

//Post data
app.post('/datas',(req,res) => {
    const postData = {
        id : uniqid(),
        ttfb : req.body.ttfb,
        fcp : req.body.fcp,
        domLoad : req.body.domLoad,
        windowLoad : req.body.windowLoad,
        createdTime : new Date()
    }
    db.datas.push(postData);
    res.send(db);
})

app.listen(process.env.PORT || 4000, () => {
    console.log('server is working..')
})
