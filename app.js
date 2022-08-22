const express = require('express');
const multer = require('multer');

const app = express();
const port = 9000;

const storage = multer.diskStorage({
  destination: (req, file, callbackFunc) => {
    callbackFunc(null, 'uploaded/')
  },
  filename: (req, file, callbackFunc) => {
    // console.log(file);

    // 1st approach ->
      const newFileName = Date.now() + '_' + file.originalname;

    // 2nd approach ->
    // var newFileName = '';
    // switch(file.mimetype){
    //   case "application/pdf": {
    //     newFileName = Date.now() + '_PdfFile' + '.pdf';
    //     break;
    //   }
    //   case "image/jpeg" : {
    //     newFileName = Date.now() + '_ImageFile' + '.jpeg';
    //     break;
    //   }
    // }
    callbackFunc(null, newFileName)
  }
});


const upload = multer({ storage: storage}).any();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/static', express.static('public'));

app.get('/index.html', (req, res)=>{
  res.sendFile(__dirname + '/public/html/index.htm')
})


app.post('/upload', upload, (req, res) =>{
  
  try {
    const paths = [];
    req.files.forEach(val => {
      paths.push({path: val.path});
    })
    res.send({ paths });

  } catch (error) {
    console.log('Error Z')
  }
})



app.get('/login', (req, res) =>{
  console.log(req.body);
  res.send('Hello World');
})

app.post('/register', (req, res) =>{

  console.log(req.body);
  res.send('Created Post request');
})


app.put('/', (req, res) =>{
  res.send('Hello World put');
})
app.delete('/', (req, res) =>{
  res.send('Hello World delete');
})

app.listen(port, ()=>{
  console.log(`Server Started at port ${port}`);
})