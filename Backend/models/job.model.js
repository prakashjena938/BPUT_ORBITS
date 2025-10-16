import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    tittle:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,

    },
    requirments:{
        type:String,
        required:true,

    },
    location:{
        type:true,
        required:true,

    },
    salary:{
        type:Number,
        required:true,

    },
    jobType:{
        type:String,
        required:true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"company",
        required:true,
    },
    position:{
        type:String,
        required:true
        
    },
    created_By:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    application:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Aplication",
        default:null
    }


})

export const Job = mongoose.model("Job",jobSchema);
