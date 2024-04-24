import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";

// Controller for sending a message
export const sendMessage = async (req, res) => {
	try {
		// Extract message content from request body
		const { message } = req.body;

		// Extract receiver's user ID from request parameters
		const { id: receiverId } = req.params;

		// Extract sender's user ID from authenticated user object
		const senderId = req.user._id;

		// Find existing conversation or create a new one if it doesn't exist
		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			// Create a new conversation if it doesn't exist
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		// Create a new message object
		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		// Push the message ID to the conversation's messages array
		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		// Save the conversation and the new message (parallel execution)
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// Emit a socket event to the receiver's socket
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		// If all steps are successful, send a success response with the new message
		res.status(201).json(newMessage);
	} catch (error) {
		// Handle errors that occur during message sending process
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Controller for retrieving messages between users
export const getMessages = async (req, res) => {
	try {
		// Extract the ID of the user to chat with from request parameters
		const { id: userToChatId } = req.params;

		// Extract the sender's user ID from authenticated user object
		const senderId = req.user._id;

		// Find the conversation between the sender and the user to chat with
		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // Populate the 'messages' field with actual message documents

		// If no conversation is found, return an empty array of messages
		if (!conversation) return res.status(200).json([]);

		// Extract messages from the conversation
		const messages = conversation.messages;

		// Send the messages as a response
		res.status(200).json(messages);
	} catch (error) {
		// Handle errors that occur during message retrieval process
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
