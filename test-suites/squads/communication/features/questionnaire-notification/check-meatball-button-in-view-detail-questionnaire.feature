@cms @learner @learner2
@communication
@questionnaire-notification
@ignore

Feature: Check meatball button in view detail questionnaire notification

    Background:
        Given "school admin" logins CMS
        And "school admin" has created "student S1", "student S2"
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose with individual recipient "Student 1", "Student 2"
        And "school admin" input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | questionSection | numberOfAnswersEach | questionType                  |
            | Question Q1     | 3                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | Question Q2     | 3                   | QUESTION_TYPE_CHECK_BOX       |
            | Question Q3     | 0                   | QUESTION_TYPE_SHORT_ANSWER    |
        And "school admin" has sent the notification
        And "student S1" logins Learner App
        And "student S2" logins Learner App

    Scenario: Check disable notify unread when all recipient read questionnaire notification
        Given "student S1" has accessed to notification detail
        And "student S1" fill and submit all questionnaire questions with valid data
        And "student S2" has accessed to notification detail
        And "student S2" fill and submit all questionnaire questions with valid data
        When "school admin" view detail notification
        And "school admin" sees Notify Unread button disable

    Scenario: Show notify unread, view result, download result with notification questionnaire
        When "school admin" view detail notification questionnaire
        And "school admin" click on meatball button
        Then "school admin" sees "Notify Unread", "View Result" and "Download result" option
