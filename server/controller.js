import { User, PullRequest , Review, Approval} from './model.js';

export const createRequest = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, description, requesterId, approvers } = req.body;
    const approversList = [];

    // Check if the requesterId exists in the Users collection
    const requesterExists = await User.exists({ _id: requesterId });
    if (!requesterExists) {
      return res.status(404).json({ error: 'Requester not found' });
    }

    await Promise.all(
      approvers.map(async (username) => {
        const approverExists = await User.exists({ username: username });
        if (!approverExists) {
          return res.status(404).json({ error: `Approver '${username}' not found` });
        }
        approversList.push({ approverId: approverExists._id });
      })
    );

    // Create a new pull request
    const newPullRequest = new PullRequest({
      title,
      description,
      requesterId,
      approvers: approversList,
      status: 'Open',
    });

    // Save the pull request to the database
    await newPullRequest.save();

    res.status(201).json(newPullRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export const updateRequest = async (req, res) => {
    try {
      // Extract data from the request body
      const { title, description, requesterId } = req.body;
      const { id: pullRequestId } = req.params;
  
        // Check if the pull request with associated requestId exists
        const pullRequestExists = await PullRequest.exists({ _id: pullRequestId, requesterId });
        if (!pullRequestExists) {
          return res.status(404).json({ error: 'Pull Request not found' });
        }

      // Update the pull request
      await PullRequest.updateOne(
        { _id: pullRequestId },
        { description, title , updatedAt: new Date() }
      );
  
      res.status(200).json({ message: 'Pull Request updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const deleteRequest = async (req, res) => {
    try {
      // Extract the pull request id from the request parameters
      const { id: pullRequestId } = req.params;
  
      // Delete the pull request
      await PullRequest.deleteOne({ _id: pullRequestId });
  
      res.status(200).json({ message: 'Pull Request deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const getRequests = async (req, res) => {
    try {
      // Extract the requesterId from the request query
      const { id: pullRequestId } = req.params;
      const { requesterId } = req.query;
        
       // find pull request by id
        if (pullRequestId) {
          const pullRequest = await PullRequest.findById(pullRequestId);
          return res.status(200).json(pullRequest);
        }
  
        // Find all the pull requests if no query parameters are provided
        if (!requesterId) {
          const pullRequests = await PullRequest.find();
          return res.status(200).json(pullRequests);
        }

        // Find all the pull requests for the requesterId
        const pullRequests = await PullRequest.find({ requesterId });
        res.status(200).json(pullRequests);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const getReviews = async (req, res) => {
    try {
      // Extract the pullRequestId from the request query
      const { pullRequestId } = req.query;
  
      // Find all the reviews for the pullRequestId
      const reviews = await Review.find({ pullRequestId });
  
      res.status(200).json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const createReview = async (req, res) => {
    try {
      // Extract data from the request body
      const { pullRequestId, reviewerId, comments } = req.body;
  
      // Check if the pull request with associated pullRequestId exists
      const pullRequestExists = await PullRequest.exists({ _id: pullRequestId });
      if (!pullRequestExists) {
        return res.status(404).json({ error: 'Pull Request not found' });
      }
  
      // Check if the reviewer with associated reviewerId exists
      const reviewerExists = await User.exists({ _id: reviewerId, roles: 'Reviewer' });
      if (!reviewerExists) {
        return res.status(404).json({ error: 'You are not a reviewer' });
      }
  
      // Create a new review
      const newReview = new Review({
        pullRequestId,
        reviewerId,
        comments,
      });
  
      // Save the review to the database
      await newReview.save();
  
      res.status(201).json(newReview);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const updateReview = async (req, res) => {
    try {
      // Extract data from the request body
      const { comments } = req.body;
      const { id: reviewId } = req.params;
  
      // Check if the review with associated reviewId exists
      const reviewExists = await Review.exists({ _id: reviewId });
      if (!reviewExists) {
        return res.status(404).json({ error: 'Review not found' });
      }
  
      // Update the review
      await Review.updateOne(
        { _id: reviewId },
        { comments, updatedAt: new Date() }
      );
  
      res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const getApprovals = async (req, res) => {
    try {
      // Extract the pullRequestId from the request query
      const { pullRequestId } = req.query;
  
      // Find all the approvals for the pullRequestId
      const approvals = await Approval.find({ pullRequestId });
  
      res.status(200).json(approvals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const addApproval = async (req, res) => {
    try {
      // Extract data from the request body
      const { pullRequestId, approverId, status } = req.body;
  
      // Check if the pull request with associated pullRequestId exists
      const pullRequestExists = await PullRequest.exists({ _id: pullRequestId });
      if (!pullRequestExists) {
        return res.status(404).json({ error: 'Pull Request not found' });
      }
  
      // Check if the approver with associated approverId exists
      const approverExists = await User.exists({ _id: approverId, roles: 'Approver' });
      if (!approverExists) {
        return res.status(404).json({ error: 'You are not an approver' });
      }
  
      // Create a new approval
      const newApproval = new Approval({
        pullRequestId,
        approverId,
        status,
      });
  
      // Save the approval to the database
      await newApproval.save();

      // Update the pull request status
      await PullRequest.updateOne(
        { _id: pullRequestId },
        { status }
      );
  
      res.status(201).json(newApproval);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

export const login = async (req, res) => {
   const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    res.status(200).json(user);
  }
  