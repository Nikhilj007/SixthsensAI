import { User, PullRequest } from './model.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createRequest = async (req, res) => {
  try {
    const { title, description, requesterId, approvers , flow } = req.body;
    //get the approvers year from the user collection
    const arr = [];
    const users = await User.find({ _id: { $in:approvers } });
    users.forEach(user => {        
      const yearIndex = user.year - 1;
      if (!arr[yearIndex]) {
          arr[yearIndex] = [];
      }
      arr[yearIndex].push({ userId: user._id, action: 'Pending' });
  });
    // Create a new pull request
    const newPullRequest = new PullRequest({
      title,
      description,
      requesterId,
      approvers: arr,
      flow,
    });

    // Save the pull request to the database
    await newPullRequest.save();
    users.map(async user => {
      user.prs.push(newPullRequest._id);
      await user.save();
    } );


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
        const pullRequestExists = await PullRequest.exists({ _id: pullRequestId });
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

export const addComment = async (req, res) => {
    try {
      // Extract data from the request body
      const { pullRequestId, username, comment } = req.body;
  
      const pullRequest = await PullRequest.findById(pullRequestId);
      if (!pullRequest) {
        throw new Error('Pull Request not found');
      }
  
      // Add the new comment to the comments array
      pullRequest.comments.push({ username, comment });
  
      // Save the updated pull request document
      await pullRequest.save();
      res.status(201).json('Comment added successfully');
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
//edit comment
//add approval by editing the pull request in sequenital, parallel and hybrid flow
export const addApproval = async (req, res) => {
    try {
      // Extract data from the request body
      const { pullRequestId, userId, action } = req.body;
  
      // Check if the pull request with associated pullRequestId exists
      const pullRequestExists = await PullRequest.findById(pullRequestId);
      if (!pullRequestExists) {
        return res.status(404).json({ error: 'Pull Request not found' });
      }
  
      // Update the pull request with the new approval approvers is array of array of objects
      if(pullRequestExists.flow === 'Parallel'){
        await PullRequest.updateOne(
          { _id: pullRequestId },
          { status: action}
        );
        pullRequestExists.approvers.flat().forEach(approver => {
          if (approver!=null && approver.userId == userId) {
            approver.action = action;
          }
        }
        );
        await pullRequestExists.save();
      }

      if(pullRequestExists.flow === 'Sequential'){
        const ind= pullRequestExists.index;
        pullRequestExists.approvers[ind].forEach(approver => {
          if (approver.userId == userId) {
            approver.action = action;
          }
        }
        );
        pullRequestExists.markModified(`approvers.${ind}`);
        await pullRequestExists.save();
        //if all the approvers in newapprover have approved the pull request increment the index and if the index is equal to the length of the approvers array then set the status to approved
        if(pullRequestExists.approvers[ind].every(approver => approver.action === 'Approved')){
          if(ind === pullRequestExists.approvers.length - 1){
            await PullRequest.updateOne(
              { _id: pullRequestId },
              { status: 'Approved' }
            );
          }
          else{
            await PullRequest.updateOne(
              { _id: pullRequestId },
              { index: ind+1 }
            );
          }
        }
        else if(pullRequestExists.approvers[ind].some(approver => approver.action === 'Rejected')){
          await PullRequest.updateOne(
            { _id: pullRequestId },
            { status: 'Rejected' }
          );
        }
        else{
          await PullRequest.updateOne(
            { _id: pullRequestId },
            { approvers: pullRequestExists.approvers }
          );
        }
      }
  
      res.status(200).json({message:`${action} successfully`} );
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

export const signup = async (req, res) => {
    try {
      const { username, email, password, year } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne ({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists' });
      }

      // Create a new user
      const newUser = new User({ username, email, password, year });

      // Save the user to the database
      await newUser.save();
      res.status(201).json(newUser);
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }