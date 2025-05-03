const Message = require('../Models/userChatMessage');
const SelectedUsers = require('../Models/userSelected');
const Announcement = require("../Models/ApartmentAnnouncementsModel");
const Apartment = require("../Models/ApartmentUserModel");
const { encrypt, decrypt } = require("../utils/encryptionutils");
const userSocket = require('../Models/userSockets');
let users = {}
class Iointialize {
    constructor() {
        this.io = null;
    }
    initSocket(io) {
        this.io = io;
        io.on('connection', async (socket) => {

            socket.on('identify', async ({ username, aptId }) => {
                const user = await userSocket.findOne({
                    username: username
                });
                if (user) {
                    await userSocket.findOneAndUpdate({ username: username }, {
                        socketId: socket.id,
                        isLogged: true,
                    })
                } else {
                    const newUser = new userSocket({
                        username: username,
                        socketId: socket.id,
                        isLogged: true
                    })
                    try {
                        await newUser.save();
                    } catch (error) {
                        console.error('could not add a user to userSocket')
                    }
                }

                const uniqueUsers = await Apartment.distinct('username', { apartment_id: aptId });
                io.emit('user-list', uniqueUsers);
            })


            socket.on('get-selected-users', async ({ username, aptId }) => {
                try {
                    if (!username || username.trim() === '') {
                        console.error('Invalid username received');
                        socket.emit('load-selected-users', ['groupchat']);
                        return;
                    }
                    const user = await SelectedUsers.findOne({ username, aptId });
                    if (user) {
                        socket.emit('load-selected-users', user.selectedUsers);
                    } else {
                        socket.emit('load-selected-users', ['groupchat']);
                    }
                } catch (error) {
                    console.error('Error fetching selected users:', error);
                }
            });


            socket.on('save-selected-users', async ({ username, selectedUsers, aptId }) => {
                try {
                    let existingUser = await SelectedUsers.findOne({ username, aptId });
                    if (existingUser) {
                        existingUser.selectedUsers = selectedUsers;
                        await existingUser.save();
                    } else {
                        const newUser = new SelectedUsers({ username, selectedUsers, aptId });
                        await newUser.save();
                    }
                } catch (error) {
                    console.error('Error saving selected users:', error);
                }
            });

            socket.on('priv-chat-msgs', async (msg) => {
                const encryptedText = encrypt(msg.msg)
                const newMessage = new Message({
                    userId: msg.userId,
                    to: msg.to,
                    msg: encryptedText,
                    // aptId:socket.aptId,
                    aptId: msg.aptId,
                    time: msg.time
                });
                try {
                    const msg1 = await newMessage.save();
                    msg1.msg = msg.msg;
                    socket.emit('priv-chat-msgs', msg1);
                    const sendSocketTo = await userSocket.findOne({ username: msg1.to });
                    socket.to(sendSocketTo.socketId).emit('priv-chat-msgs', msg1);
                }
                catch (error) {
                    console.error(error)
                }
            });


            socket.on('get-priv-chat-history', async ({ from, to, aptId }) => {
                try {
                    const messages = await Message.find({
                        $or: [
                            { userId: from, to: to, aptId: aptId },
                            { userId: to, to: from, aptId: aptId }
                        ]
                    }).sort({ timestamp: 1 });
                    const decryptedMessages = messages.map((msg) => ({
                        ...msg._doc,
                        msg: decrypt(msg.msg)
                    }));
                    socket.emit('priv-chat-history', decryptedMessages);
                } catch (error) {
                    console.error('Error fetching private chat history:', error);
                }
            });




            socket.on('get-grp-chat-history', async ({ to, aptId }) => {
                try {
                    const messages = await Message.find({
                        to: to, aptId: aptId,
                    }).sort({ timestamp: 1 });
                    const decryptedMessages = messages.map((msg) => ({
                        ...msg._doc,
                        msg: decrypt(msg.msg)
                    }));
                    socket.emit('grp-chat-history', decryptedMessages);
                } catch (error) {
                    console.error('Error fetching group chat history:', error);
                }
            });


            socket.on('chat-msgs', async (msg) => {
                const encryptedText = encrypt(msg.msg);
                const newMessage = new Message({
                    userId: msg.userId,
                    to: 'groupchat',
                    msg: encryptedText,
                    // aptId:socket.aptId,
                    aptId: msg.aptId,
                    time: msg.time,

                }); try {
                    const msg1 = await newMessage.save()
                    msg1.msg = msg.msg;
                    io.emit('chat-msgs', msg1)
                } catch (error) {
                    console.error(error)
                }
            });

            socket.on('handle-delete-msgs', async ({ msgId }) => {
                try {
                    const message = await Message.findById(msgId);
                    if (!message) {
                        console.error(`Message with ID ${msgId} not found.`);
                        return;
                    }
                    const replacementMsg = '🛇 This message was deleted';
                    const encryptedText = encrypt(replacementMsg);
                    await Message.findByIdAndUpdate(msgId, { deleteForAll: true, msg: encryptedText });
                    socket.emit('message-deleted', {
                        msgId,
                        replacementMsg: decrypt(encryptedText),
                        // deleteForAll:true
                    });
                } catch (error) {
                    console.error('Error deleting message:', error);
                }
            });

            // socket.on('get-announcement-messages-history', async ({ aptId }) => {
            //     try {
            //         const announcement_messages = await Announcement.find({
            //             apartment_id: aptId
            //         }).sort({ timestamp: -1 });
            //         socket.emit('announcement-messages-history', announcement_messages);
            //     } catch (error) {
            //         console.error('Error fetching announcement messages:', error);
            //     }
            // });
            // socket.on('announcement-messages', async (msg) => {
            //     const newMessage = new Announcement({
            //         apartment_username: msg.username,
            //         apartment_id: msg.aptId,
            //         user_designation: msg.role,
            //         announcement_msg: msg.msg,
            //     });
            //     try {
            //         const msg1 = await newMessage.save();


            //         io.emit('announcement-messages', msg1)
            //     } catch (error) {
            //         console.error('could not save message!!')
            //     }

            // })



            socket.on('disconnect', async () => {
                await userSocket.findOneAndUpdate({ socketId: socket.id }, {
                    isLogged: false
                })
            })


        });
    }

}
module.exports = Iointialize;
