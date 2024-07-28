import Messages from "../models/messages";

export const allMessages = async () => {
  return await Messages.findAll();
};

export const newMessage = async (name: string, message: string) => {
  return await Messages.create({
    name,
    message,
  });
};

export const removeOldestMessage = async () => {
  const messages = await Messages.findAll();
  if(messages.length > 9) {
    await messages[0].destroy();
  }
}
