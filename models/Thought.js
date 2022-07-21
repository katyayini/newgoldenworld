const { Schema, model, Types } = require('mongoose');
const moment = require('moment');

// ReactionSchema
const ReactionSchema = new Schema(
    {
    reactionId: {
        type: Schema.Types.ObjectId,
        default: ()=> new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        maxlength: 280
    },
    username: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtDate) => moment(createdAtDate).format('MMM DD, YYYY [at] hh:mm a')
    }
    },
    {
    toJSON: {
        getters: true
    } 
    }
);

// ThoughtSchema
const ThoughtSchema = new Schema(
    {
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: (createdAtDate) => moment(createdAtDate).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: true
    },
    // Use ReactionsSchema to validate data
    reactions: [ReactionSchema]
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
    }
)


ThoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});


const Thought = model('Thought', ThoughtSchema);

module.exports = Thought;