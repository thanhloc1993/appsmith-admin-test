export class LessonKeys {
    static startPollButton = `Start Poll Button`;

    static stopPollButton = `Stop Poll Button`;

    static endPollButton = `End Poll Button`;

    static questionInput = `Question Input`;

    static questionContent = (content: string): string => `Question Content ${content}`;

    static optionContent = (index: number, content: string): string =>
        `Option Detail ${index} ${content}`;

    static optionItem = (index: number): string => `Option Item ${index}`;

    static optionItemSelect = (index: number, isSelected: boolean): string =>
        `Option Item Selected ${index} ${isSelected}`;

    static addMoreItem = (canAdMore: boolean): string => `Add More Item ${canAdMore}`;

    static deleteOptionButton = (index: number, enable: boolean): string =>
        `Delete Option Button ${index} ${enable}`;

    static pollingOptionVoteIndicator = (value: number, correct: boolean): string =>
        `Polling Option Vote Indicator ${value} ${correct}`;

    static pollingOptionVoteText = (index: number, value: number): string =>
        `Polling Option Vote Text ${index} ${value}`;

    static pollingTotalVotes = (totalVotes: number): string => `Polling Total Votes ${totalVotes}`;

    static listPollingOptionItem = (options: number): string =>
        `List Polling Option Item ${options}`;

    static totalSubmittedStudents = (totalSubmit: number): string =>
        `Total Submitted Students ${totalSubmit}`;

    static pollingStatsTab = (selected: boolean): string => `Polling Stats Tab ${selected}`;

    static pollingDetailTab = (selected: boolean): string => `Polling Detail Tab ${selected}`;

    static pollingStatsPage = `Polling Stats Page`;

    static pollingDetailPage = `Polling Detail Page`;

    static pollingQuestion = `Polling Question`;

    static closePollingButton = `Close Polling Button`;

    static numberOfAnswer = (answers: number, students: number): string =>
        `Number Of Answer ${answers} ${students}`;

    static statsVoteItem = (index: number, vote: number, totalVote: number): string =>
        `Stats Vote Item ${index} ${vote} ${totalVote}`;

    static studentAnswerItem = (id: string): string => `Student Answer Item ${id}`;

    static studentSubmittedTimeText = (id: string, time: string): string =>
        `Student Submitted Time Text ${id} ${time}`;

    static studentAnswerText = (id: string, answers: string): string =>
        `Student Answer Text ${id} ${answers}`;

    static studentAnswerWidget = `Student Answer Widget`;

    static shareResultButton = `Share Result Button`;

    static shareResultButtonStatus = (isShared: boolean): string =>
        `Share Result Button Status ${isShared}`;
}
