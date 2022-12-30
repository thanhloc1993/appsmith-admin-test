export const textFieldMessageKey = 'TextField Message';
export const sendMessageButtonKey = 'Send Message Button';
export const fileButtonKey = 'File Button';
export const imageButtonKey = 'Image Button';
export const imageViewerKey = 'Image Viewer';
export const pdfViewerKey = 'PDF Viewer';
export const conversationDetail = `Conversation Detail`;
export const messagingScreen = `Messaging Screen`;

export const messageTimeKey = (index: number) => `Message Time ${index}`;
export const messageImageKey = (index: number) => `Message Image ${index}`;
export const messageFileKey = (index: number) => `Message File ${index}`;
export const messageZipFileKey = (index: number) => `Message Zip File ${index}`;
export const messageHyperlinkKey = (index: number) => `Hyperlink ${index}`;
export const messagePdfContentKey = (index: number) => `Message File Content ${index}`;
export const messageZipContentKey = (index: number) => `Message Zip File Content ${index}`;
export const messageTextKey = (index: number, message: string | undefined) =>
    `${index} - ${message}`;
export const readMessageKey = (index: number) => `Read Message Status ${index}`;
export const repliedMessageKey = (index: number, learnerAccountType: string): string =>
    `Conversation Reply ${learnerAccountType} ${index}`;
export const conversationKey = (index: number, message: string, seenStatus: string) =>
    `Conversation ${message} ${index} ${seenStatus}`;

export const studentConversationName = (studentId: string, name: string) =>
    `Student Conversation ${studentId} name ${name}`;

export const parentConversationName = (studentId: string, name: string) =>
    `Parent Conversation ${studentId} name ${name}`;

export const parentConversationLabel = (studentId: string) =>
    `Parent Conversation ${studentId} with parent label`;

export const emptyConversationListKey = 'Empty Conversation List';

export const userNameConversationKey = (name: string, studentId: string): string =>
    `User Name Conversation ${name} ${studentId}`;

export const userAvatarConversationKey = (name: string, studentId: string): string =>
    `User Avatar Conversation ${name} ${studentId}`;

export const repliedConversationKey = (studentId: string, isParent: boolean): string =>
    `${_learnerType(isParent)} Conversation Replied ${studentId}`;

export const conversationUnseenStatusKey = (studentId: string, isParent: boolean): string =>
    `${_learnerType(isParent)} Conversation Unseen Status ${studentId}`;

export const contentConversationKey = (
    index: number,
    studentId: string,
    message: string | undefined,
    seen: boolean
) => `Conversation ${index} ${message} ${studentId} ${_seenStatus(seen)}`;

const _seenStatus = (seen: boolean): string => (seen ? 'Seen' : 'Unseen');
const _learnerType = (isParent: boolean): string => (isParent ? 'Parent' : 'Student');
