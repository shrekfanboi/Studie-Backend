const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    student_id:{type:Number,unique:true,required:true},
    username:{type:String,unique:true,max:20,required:true},
    password:{type:String,min:6,default:'aadmin'},
    strong_subject:{type:String,enum:['math','science','english','computer']},
    weak_subject:{type:String,enum:['math','science','english','computer']}
},{collection:'students'})

const Student = mongoose.model('StudentModel',studentSchema)
module.exports = Student;
