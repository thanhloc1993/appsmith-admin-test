@cms
@communication
@questionnaire-notification

Feature: Remove question section in questionnaire

    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS

    Scenario: Back to default when delete 1 last question
        When "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | numberOfQuestions | numberOfAnswersEach | questionType            |
            | 1                 | 0                   | QUESTION_TYPE_FREE_TEXT |
        Then "school admin" delete question
        And "school admin" sees questionnaire notification back to default notification

    @ignore
    Scenario: Delete question when have multiple question
        When "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | questionSection | numberOfAnswersEach | questionType                  |
            | Question Q1     | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | Question Q2     | 2                   | QUESTION_TYPE_CHECK_BOX       |
            | Question Q3     | 0                   | QUESTION_TYPE_FREE_TEXT       |
        Then "school admin" delete question "Question Q1" and "Question Q2"
        And "school admin" sees "Question Q1" and "Question Q2" remove
        And "school admin" sees name of "Question Q3" change to "Question Q1"
