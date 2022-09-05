const express = require('express');
const multer = require('multer');

const mongoose = require('mongoose');
const Task = require('./Task');

const app = express();
const port = 9000;

const connectWithDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin:admin@batchapril.ziat2u3.mongodb.net/test?retryWrites=true&w=majority");
    console.log('DB Connected');
  } catch(error){
    console.log("Error while connecting with DB", error.message)
  }
}
connectWithDB();



app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
    callbackFunc(new Error('Some Occurred'), newFileName)
  }
});
const upload = multer({ storage: storage}).any();

app.use('/static', express.static('public'));
app.post('/upload', (req, res) =>{
  upload(req, res, (err)=> {
      if(err){
        return res.status(400).send({
          message: "Some error occurred",
        })
      }
    console.log(err);
    try { 
      const paths = [];
      req.files.forEach(val => {
        paths.push({path: val.path});
      })
      return res.send({ paths });
    } catch (error) {
      return res.status(400).send({
        message: "Some error occurred",
      })
    }
  });
})

// TODO APIs 

const todoList = [];



// API to create the new task
app.post('/task', async (req, res) => {

  const { name, description } = req.body;
  const id = Math.floor(Math.random() * 10000);
  console.log(id);
  const newTask = {
    name, 
    description,
    id
  };
  todoList.push(newTask);
 

  //Logic to add in Db
  const task = new Task(newTask);
  await task.save();



  res.status(200).send({
    status: true,
    message: "Task Created Successfully",
  });
});



// API for getting all the tasks
app.get('/task', async (req, res) => {

  // using DB
  const tasks = await Task.find();

  res.status(200).send({
    status: true,
    message: "Tasks fetched Successfully",
    data: todoList,
    dbTask: tasks
  });

})



// API for getting the task by id
app.get('/task/:id', (req, res) => {
  try{
    console.log(req.params);
    const { id } = req.params;
    // const result = todoList.find(obj => obj.id == id);
    var result = {};
    var index = -1;
    for(var i=0; i<todoList.length; i++){
      if(id == todoList[i].id){
        result = todoList[i];
        index = i;
      }
    }
    if(index != -1){
      res.status(200).send({
        status: true,
        message: "Tasks fetched Successfully",
        data: result
      });
    }
    else {
      res.status(400).send({
        status: false,
        message: "Record not found",
      });
    }
  } catch(e){
    res.status(400).send({
      status: false,
      message: "Error: " + e.message,
    });
  }
})

//API to update the particular to task

app.put('/task/:id', (req, res) => {
   const { id } = req.params;
   const { name, description } = req.body;
   
   for(var i=0; i<todoList.length; i++){
     if(todoList[i].id == id){
       todoList[i] = { ...todoList[i], name, description };
       break;
     }
   }
   console.log(i);
   res.status(200).send({
    status: true,
    message: "Tasks updated Successfully",
    data: todoList[i]
  });
});


//API to delete the particular to task

app.delete('/task/:id', (req, res) => {
  const { id } = req.params;
  
  // for(var i=0; i<todoList.length; i++){
  //   if(todoList[i].id == id){
  //     todoList[i] = { ...todoList[i], name, description };
  //     break;
  //   }
  // }

  const index = todoList.findIndex(task => task.id == id);
  const deletedTask = todoList[index];
  // console.log(index);
  todoList.splice(index, 1);

  res.status(200).send({
   status: true,
   message: "Tasks deleted Successfully",
   data: deletedTask
 });
});


app.listen(port, ()=>{
  console.log(`Server Started at port ${port}`);
})