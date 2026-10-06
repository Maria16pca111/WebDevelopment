export type Message = {
  id: string;
  senderId: string;
  senderDisplayName: string;
  senderImageUrl: string;
  recipientId: string;
  recipientDisplayname: string;
  recipientImageUrl: string;
  content: string;
  dateRead?: string;
  messageSent: string;
  currentUserGender: boolean;
};
