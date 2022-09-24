const express = require("express")
const Student = require("./model")
const mongoose = require('mongoose');
const cors =require("cors")
const server = express()
server.use(cors())
server.use(express.urlencoded({extended:true}))
server.use(express.json())
const port = 8000
const database = "student"
const uri = `mongodb+srv://maimone154:m001-mongodb-basics@firstcluster.g8xd1rs.mongodb.net/${database}?retryWrites=true&w=majority`

server.get("/",(req,res)=>{
    res.send("<h1>Node Server</h1>")
})

server.post("/api/students/search",async(req,res)=>{
    // console.log(req.body)
    // var jsonData = JSON.parse(fs.readFileSync("data.json","utf8"))
    // var filtered_students = jsonData.filter((student)=>student.strongSubject === req.body.wksub || student.weakSubject === req.body.sgsub)
    try{
        var db = await mongoose.connect(uri)
        var students;
        if(req.body.stdtype === "group"){
            students = await Student.find({$or:[{strong_subject:req.body.wksub},{weak_subject:req.body.sgsub}]}).exec()
        }
        else{
            data = await Student.findOne({$or:[{strong_subject:req.body.wksub},{weak_subject:req.body.sgsub}]}).exec()
            students = [data]
        }
        db.disconnect()
        return res.json({status:"success",students})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:e.name})
    }
    
})

server.post("/api/students/create",async(req,res)=>{
    // console.log(req.body)
    const {student_id,username,password,strong_subject,weak_subject} = req.body
    try{
        var db = await mongoose.connect(uri)
        var student = new Student({student_id,username,password,strong_subject,weak_subject})
        const doc = await student.save()
        db.disconnect()
        return res.json({doc})
    }
    catch(e){
        console.log(e)
        return res.json({error:e.name})
    }

})

server.delete("/api/students/delete/:id",async(req,res)=>{
    const {id} = req.params
    if (isNaN(id)) return res.status(500).json({})
    try{
        var db = await mongoose.connect(uri)
        const student = await Student.findOneAndDelete({student_id:id})
        db.disconnect()
        return res.json({student})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:e.name})
    }
})
   


server.get("/api/students",async(req,res)=>{
    try{
        var db = await mongoose.connect(uri)
        let all_students;
        const {ssub,wsub} = req.query
        if(ssub && !wsub){
            all_students = await Student.find({strong_subject:ssub}).exec()
        }
        else if(wsub && !ssub){
            all_students = await Student.find({weak_subject:wsub}).exec()
        }
        else if(ssub && wsub){
            all_students = await Student.find({$and:[{strong_subject:ssub},{weak_subject:wsub}]})
        }
        else{
            all_students = await Student.find({}).exec()
        }
        
        const data = all_students.map((student)=>{
           const {student_id,username,weak_subject,strong_subject} = student
           return {id:student_id,username,strong_subject,weak_subject}
        })
        db.disconnect()
        return res.json({students:data})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:e.name})
    }
})

server.get("/api/students/:id",async(req,res)=>{
    const {id} = req.params
    if (isNaN(id)) return res.status(500).json({})
    try{
        var db = await mongoose.connect(uri)
        var student = await Student.findOne({student_id:parseInt(id)}).exec()
        db.disconnect()
        return res.json({student:student ? {id:student.student_id,
            username:student.username,
            strong_subject:student.strong_subject,
            weak_subject:student.weak_subject} : {}})
    }
    catch(e){
        console.log(e)
        return res.status(500).json({error:e.name})
    }
})

server.listen(port,()=>console.log("server listening..."))