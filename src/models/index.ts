import mongoose, { Schema } from 'mongoose';

// Define the message schema for each individual message within the session
const messageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // Set current time as default for the message timestamp
  }
});

// Define the chat history schema for the entire session
const chatHistorySchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      required: true
    },
    messages: [messageSchema], // Array of messages, each structured based on messageSchema
    startTime: {
      type: Date,
      default: Date.now // Automatically set the start time to current time when the session begins
    },
    endTime: {
      type: Date
    }
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the chat history model, creating it if it doesn't exist
const chatHistory = mongoose.models.chatHistory || mongoose.model("chatHistory", chatHistorySchema);

export default chatHistory;
