const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {

    Thought.create(req.body)
      .then(thought => {
        User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        )
          .then(thought => {
            if (!thought) {
              res.status(404).json({ message: 'No user with this id!' });
              return;
            }
            res.json(thought);
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.status(400).json(err));


  },
  // Delete a thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json(thought);
      })
      .catch(err => res.status(400).json(err));


  },
  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add a reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true, runValidators: true })
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json(thought);
      })
      .catch(err => res.status(400).json(err))

  },

  // Delete a reaction
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.body.reactionId } } },
      { new: true, runValidators: true }
    )
      .then(thought => {
        if (!thought) {
          res.status(404).json({ message: 'No thought with this id!' });
          return;
        }
        res.json({ message: 'Successfully deleted reaction' });
      })
      .catch(err => res.status(500).json(err));
  }
};