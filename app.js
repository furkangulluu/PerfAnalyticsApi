const app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios')
var cors = require('cors')
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Get data with the last in 30min
app.get('/datas',(req,res) => {
    let currentDate = new Date();
    const dataList= [];

    axios.get("https://perfanalyticsdb.firebaseio.com/data.json")
    .then((response) => {
        let data=response.data;
        
        for (let key in data) {
            dataList.push({ ...data[key], id : key })
        }

        let result = dataList.filter(data=>{
            let takenDate = new Date(data.createdTime);
            return (Math.abs(currentDate - takenDate) < 1800000)
        })

        res.status(200).send(result)
        if(result.length>0){
        }else{
            res.status(404).send({message: 'Data not found'})
        }
    })
    .catch((e) => {
        res.status(404).send({message: 'Code Problem!'+e})
    });
})

//Post data
app.post('/datas',(req,res) => {
    const postData = {
        ttfb : req.body.ttfb,
        fcp : req.body.fcp,
        domLoad : req.body.domLoad,
        windowLoad : req.body.windowLoad,
        createdTime : new Date()
    }
    axios.post("https://perfanalyticsdb.firebaseio.com/data.json", postData)
        .then(response => {
            res.status(200).send(response.data);
        })
        .catch( e=> {
            res.status(404).send(e);
        })
})

app.listen(process.env.PORT || 4000, () => {
    console.log('server is working..')
})
