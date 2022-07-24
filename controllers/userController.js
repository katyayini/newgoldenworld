const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  //Update a user
  updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true })
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No such user exists!' });
          return;
        }
        res.json(user);
      })
      .catch(err => res.json(err))
  },

  // Add a friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user with this userId!' });
          return;
        }

        User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $addToSet: { friends: req.params.userId } },
          { new: true, runValidators: true }
        )
          .then(users => {
            if (!users) {
              res.status(404).json({ message: 'No user with this friendId' })
              return;
            }
            res.json(user);
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));

  },
  // Remove a friend
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then(user => {
        if (!user) {
          res.status(404).json({ message: 'No user with this userId' });
          return;
        }

        User.findOneAndUpdate(
          { _id: req.params.friendId },
          { $pull: { friends: req.params.userId } },
          { new: true, runValidators: true }
        )
          .then(users => {
            if (!users) {
              res.status(404).json({ message: 'No user with this friendId' })
              return;
            }
            res.json({ message: 'Successfully removed friend' });
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
  }
};
