import mongoose from 'mongoose';
const { Schema } = mongoose;

// Users Collection Schema
const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: ['Approver', 'Reviewer', 'Requester'], default: ['Requester'] },
});


// PullRequests Collection Schema
const pullRequestSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  approvers: [{
    approverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    comments: { type: String },
  }],
  status: { type: String, enum: ['Open', 'Approved', 'Rejected'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Reviews Collection Schema
const reviewSchema = new Schema({
  pullRequestId: { type: Schema.Types.ObjectId, ref: 'PullRequest', required: true },
  reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: { type: String , required: true},
  createdAt: { type: Date, default: Date.now },
});

// Approvals Collection Schema
const approvalSchema = new Schema({
  pullRequestId: { type: Schema.Types.ObjectId, ref: 'PullRequest', required: true },
  approverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const PullRequest = mongoose.model('PullRequest', pullRequestSchema);
const Review = mongoose.model('Review', reviewSchema);
const Approval = mongoose.model('Approval', approvalSchema);

export { User, PullRequest, Review, Approval };
