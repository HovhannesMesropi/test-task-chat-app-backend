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
