@cms @learner
@communication
@questionnaire-notification

Feature: Resubmit questionnaire

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "school admin" has created questionnaire notification with "resubmit allowed"
            | questionType    | required | numberOfQuestions |
            | Multiple choice | true     | 1                 |
            | CheckBox        | true     | 1                 |
            | Short answer    | true     | 1                 |
        And "school admin" sent the notification to "student"
        And "student" has accessed to notification detail
        And "student" has submitted questionnaire with valid data

    Scenario: Learner changes answer and resubmit question
        Given "student" clicked on resubmit button
        When "student" changes answer of the questions
        And "student" submits the questionnaire
        And "student" accepts the questionnaire submission
        Then "student" sees the questionnaire has submitted successfully
        And "student" sees questionnaire view mode display with new data

    Scenario: Learner back to view mode from resubmit mode
        Given "student" clicked on resubmit button
        When "student" changes answer of the questions
        And "student" clicks on back button
        And "student" accepts the discard changes
        Then "student" sees questionnaire view mode display with old data
