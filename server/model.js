import mongoose from 'mongoose';
const { Schema } = mongoose;

// Users Collection Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  year: { type: Number, required: true },
  prs : [{ type: Schema.Types.ObjectId, ref: 'PullRequest' }],
  roles: [{ type: String, enum: ['reviewe', 'requwster'], default: 'approver' }],

});

const approverSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});


// PullRequests Collection Schema
const pullRequestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvers: [[approverSchema]],
  flow: {type: String, enum: ['Parallel', 'Sequential', 'Hybrid'], default: 'Parallel'},
  status: { type: String, enum: ['Open', 'Approved', 'Rejected'], default: 'Open' },
  comments : [{ username: { type: String, required: true }, comment: { type: String, required: true } ,createdAt: { type: Date, default: Date.now }}],
  index : {type: Number, default: 0},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


// Approvals Collection Schema
// const approvalSchema = new Schema({
//   pullRequestId: { type: Schema.Types.ObjectId, ref: 'PullRequest', required: true },
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
//   createdAt: { type: Date, default: Date.now },
// });

const User = mongoose.model('User', userSchema);
const PullRequest = mongoose.model('PullRequest', pullRequestSchema);
// const Review = mongoose.model('Review', reviewSchema);
// const Approval = mongoose.model('Approval', approvalSchema);

export { User, PullRequest };
