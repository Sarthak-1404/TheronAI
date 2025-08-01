const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// In-memory chat storage (in production, use a database)
const chatMessages = new Map();
const chatRooms = new Map();

// @route   POST /api/chat/messages
// @desc    Send a message
// @access  Private
router.post('/messages', [
  body('recipientId')
    .isMongoId()
    .withMessage('Valid recipient ID is required'),
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['text', 'image', 'file'])
    .withMessage('Valid message type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { recipientId, message, type = 'text' } = req.body;
    const senderId = req.user._id;

    // Create chat room ID (sorted to ensure consistency)
    const roomId = [senderId.toString(), recipientId].sort().join('_');

    // Initialize chat room if it doesn't exist
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, {
        participants: [senderId.toString(), recipientId],
        createdAt: new Date()
      });
    }

    // Create message object
    const newMessage = {
      id: Date.now().toString(),
      senderId: senderId.toString(),
      recipientId,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    // Store message
    if (!chatMessages.has(roomId)) {
      chatMessages.set(roomId, []);
    }
    chatMessages.get(roomId).push(newMessage);

    // Emit message to recipient via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${recipientId}`).emit('receive_message', {
      senderId: senderId.toString(),
      message,
      timestamp: new Date(),
      roomId
    });

    res.status(201).json({
      status: 'success',
      message: 'Message sent successfully',
      data: {
        message: newMessage
      }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send message'
    });
  }
});

// @route   GET /api/chat/messages/:recipientId
// @desc    Get chat messages with a specific user
// @access  Private
router.get('/messages/:recipientId', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user._id.toString();
    const { page = 1, limit = 50 } = req.query;

    // Create chat room ID
    const roomId = [userId, recipientId].sort().join('_');

    // Get messages for this room
    const messages = chatMessages.get(roomId) || [];

    // Filter messages for this user
    const userMessages = messages.filter(msg => 
      msg.senderId === userId || msg.recipientId === userId
    );

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedMessages = userMessages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + parseInt(limit))
      .reverse(); // Show oldest first

    res.status(200).json({
      status: 'success',
      data: {
        messages: paginatedMessages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: userMessages.length,
          pages: Math.ceil(userMessages.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get messages'
    });
  }
});

// @route   GET /api/chat/conversations
// @desc    Get user's conversations
// @access  Private
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const conversations = new Map();

    // Find all chat rooms involving this user
    for (const [roomId, room] of chatRooms) {
      if (room.participants.includes(userId)) {
        const messages = chatMessages.get(roomId) || [];
        const otherParticipantId = room.participants.find(id => id !== userId);
        
        if (otherParticipantId) {
          const lastMessage = messages[messages.length - 1];
          const unreadCount = messages.filter(msg => 
            msg.recipientId === userId && !msg.read
          ).length;

          conversations.set(otherParticipantId, {
            participantId: otherParticipantId,
            lastMessage: lastMessage ? {
              message: lastMessage.message,
              timestamp: lastMessage.timestamp,
              senderId: lastMessage.senderId
            } : null,
            unreadCount,
            updatedAt: lastMessage ? lastMessage.timestamp : room.createdAt
          });
        }
      }
    }

    // Convert to array and sort by last message time
    const conversationsArray = Array.from(conversations.values())
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.status(200).json({
      status: 'success',
      data: {
        conversations: conversationsArray
      }
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get conversations'
    });
  }
});

// @route   PUT /api/chat/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/messages/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id.toString();

    // Find and mark message as read
    let messageFound = false;
    for (const [roomId, messages] of chatMessages) {
      const message = messages.find(msg => 
        msg.id === messageId && msg.recipientId === userId
      );
      
      if (message) {
        message.read = true;
        messageFound = true;
        break;
      }
    }

    if (!messageFound) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Mark message read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark message as read'
    });
  }
});

// @route   DELETE /api/chat/messages/:messageId
// @desc    Delete a message
// @access  Private
router.delete('/messages/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id.toString();

    // Find and delete message
    let messageFound = false;
    for (const [roomId, messages] of chatMessages) {
      const messageIndex = messages.findIndex(msg => 
        msg.id === messageId && msg.senderId === userId
      );
      
      if (messageIndex !== -1) {
        messages.splice(messageIndex, 1);
        messageFound = true;
        break;
      }
    }

    if (!messageFound) {
      return res.status(404).json({
        status: 'error',
        message: 'Message not found or unauthorized'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete message'
    });
  }
});

// @route   POST /api/chat/typing
// @desc    Send typing indicator
// @access  Private
router.post('/typing', [
  body('recipientId')
    .isMongoId()
    .withMessage('Valid recipient ID is required'),
  body('isTyping')
    .isBoolean()
    .withMessage('isTyping must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { recipientId, isTyping } = req.body;
    const senderId = req.user._id;

    // Emit typing indicator via Socket.IO
    const io = req.app.get('io');
    io.to(`user_${recipientId}`).emit('user_typing', {
      userId: senderId.toString(),
      isTyping
    });

    res.status(200).json({
      status: 'success',
      message: 'Typing indicator sent'
    });
  } catch (error) {
    console.error('Send typing indicator error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to send typing indicator'
    });
  }
});

// @route   GET /api/chat/unread-count
// @desc    Get unread message count
// @access  Private
router.get('/unread-count', async (req, res) => {
  try {
    const userId = req.user._id.toString();
    let totalUnread = 0;
    const unreadByConversation = {};

    // Count unread messages
    for (const [roomId, messages] of chatMessages) {
      const unreadMessages = messages.filter(msg => 
        msg.recipientId === userId && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        const otherParticipantId = chatRooms.get(roomId)?.participants.find(id => id !== userId);
        if (otherParticipantId) {
          unreadByConversation[otherParticipantId] = unreadMessages.length;
          totalUnread += unreadMessages.length;
        }
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalUnread,
        unreadByConversation
      }
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get unread count'
    });
  }
});

// @route   POST /api/chat/read-all/:recipientId
// @desc    Mark all messages from a user as read
// @access  Private
router.post('/read-all/:recipientId', async (req, res) => {
  try {
    const { recipientId } = req.params;
    const userId = req.user._id.toString();

    // Create chat room ID
    const roomId = [userId, recipientId].sort().join('_');
    const messages = chatMessages.get(roomId) || [];

    // Mark all messages from this recipient as read
    let updatedCount = 0;
    messages.forEach(msg => {
      if (msg.recipientId === userId && msg.senderId === recipientId && !msg.read) {
        msg.read = true;
        updatedCount++;
      }
    });

    res.status(200).json({
      status: 'success',
      message: `Marked ${updatedCount} messages as read`,
      data: {
        updatedCount
      }
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to mark messages as read'
    });
  }
});

module.exports = router; 