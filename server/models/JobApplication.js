import mongoose from 'mongoose'

const JobApplicationSchema = new mongoose.Schema({
    userId: { type: String, ref:'User', required: true },
    companyId: {type: mongoose.Schema.Types.ObjectId, ref:'companyId', required: true},
    jobId: {type: mongoose.Schema.Types.ObjectId, ref:'job', required: true},
    status: {type:String, default:'pending' },
    date: {type: Number, required: true}
})

const JobApplication = mongoose.model('JobApplication', JobApplicationSchema)

export default JobApplication;