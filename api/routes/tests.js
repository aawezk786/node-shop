const express = require('express');
const router = express.Router();
const multer = require('multer');
const Test = require('../models/test');
const xlsx = require('xlsx');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + ' ' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
   
        cb(null, true);
   
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

router.post('/:goc',upload.single('file_name'),(req, res, next) => {
    console.log(req.file.path);
    const wb = xlsx.readFile(req.file.path);
    const ws = wb.SheetNames;
    const we = wb.Sheets[ws];
    const data = xlsx.utils.sheet_to_json(we);
    console.log(data);  
    
    data.map((record)=>{
     const name1 =   record.name;
     const sale = record.sale;
     const rate = record.sale * 2;
     const final = record.sale * rate;
      const title1 =   record.title;
      const mrp_dollar = record.mrp_dollar;
      const mrp_euro = record.mrp_euro;
      const inr = record.mrp_dollar + mrp_euro;
      const mrp_inr = inr * req.params.goc;
      console.log(mrp_inr)
      const test = new Test({
        _id: new mongoose.Types.ObjectId(),
        name: name1,
        title: title1,
        sale : sale,
        rate : rate,
        final : final,
        mrp_dollar : mrp_dollar,
        mrp_euro : mrp_euro,
        mrp_inr : mrp_inr,
        file_name : "http://Zewaa/" + req.file.path
       
    });
    test.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created Product Successfully',
            createdProduct: {
                name: result.name,
                title: result.title,
                
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    }).catch(err => {
       next(err)
    });
    })
   
    

  
});


router.put('/update/:goc',(req, res, next) => {
    let subtotal = 0;
    let total = [];
    let oldgoc = 2;
    let oldgocarray = [];
    let newgoc = 3;
    let newgocarray = [];
    Test.find().exec()
    .then(data=>{
        let count = data;
        console.log(count)
        for (var { mrp_inr: mrp_inr } of count) {
            let mrp_inrs = mrp_inr;
            total.push(mrp_inrs)
        }

        oldgocarray.push(oldgoc)
        for (let num of total) {
            subtotal = subtotal + num
        }
        
        let totallen = total.length;
        for(let i = 0;i < totallen - 1;i++){
            oldgocarray.push(oldgoc)
        }
        for(let i = 0;i <= totallen - 1;i++){
            newgocarray.push(newgoc)
        }
        var sum = oldgocarray.map(function (num, id) {
            return  total[id] / num;
          });
          var multiply = newgocarray.map(function (num, id) {
            return num * sum[id];
          });
        console.log(sum)
        console.log(newgocarray)
        console.log(total)
        console.log("latest mrp_inr:" + "" +multiply)
        
        const newvalue = { $set : {mrp_inr : multiply}};
        Test.updateOne({},newvalue)
            .then(data =>{
              return  res.status(200).json({
                    message: "User Has Been UnBlock Successfully"
                    
                });
            })
            .catch(err=>{
                next(err)
            });
    })
    .catch(err=>{
        next(err)
    })
});
module.exports = router;