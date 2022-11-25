@cms
@communication
@questionnaire-notification

Feature: collapse and expand question in questionnaire detail
    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | questionSection | numberOfAnswersEach | questionType                  |
            | Question Q1     | 3                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | Question Q2     | 3                   | QUESTION_TYPE_CHECK_BOX       |
        And "school admin" has sent the notification

    Scenario: Expand question in questionnaire notification detail
        Given school admin clicks created notification in notification table
        When "school admin" click "Down Arrow" at "Question Q1,Question Q2"
        And "school admin" sees "Up Arrow" at "Question Q1,Question Q2"
        And "school admin" sees "Question Q1,Question Q2" "expand" all answer

    Scenario: Collapse question in questionnaire notification detail
        Given school admin clicks created notification in notification table
        When "school admin" click "Down Arrow" at "Question Q1,Question Q2"
        And "school admin" click "Up Arrow" at "Question Q1,Question Q2"
        And "school admin" sees "Down Arrow" at "Question Q1,Question Q2"
        And "school admin" sees "Question Q1,Question Q2" "collapse" all answer
