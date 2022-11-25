@cms @learner
@communication
@questionnaire-notification

Feature: Submit questionnaire

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "school admin" has created questionnaire notification
            | questionType    | required | numberOfQuestions |
            | CheckBox        | true     | 1                 |
            | Multiple choice | true     | 1                 |
            | Short answer    | true     | 1                 |
        And "school admin" sent the notification to "student"

    Scenario: Learner answer all questions with multiple questions
        Given "student" has accessed to notification detail
        When "student" fill all questionnaire questions with valid data
        And "student" submits the questionnaire
        And "student" accepts the questionnaire submission
        Then "student" sees the questionnaire has submitted successfully
        And "student" sees questionnaire view mode display with correct data

    Scenario: Learner not fill required question and submit questionnaire
        Given "student" has accessed to notification detail
        When "student" submits the questionnaire
        Then "student" sees the errors of each question

    Scenario: Learner back to the previous screen from edit mode
        Given "student" has accessed to notification detail
        When "student" fill all questionnaire questions with valid data
        And "student" clicks on back button
        And "student" accepts the discard changes
        Then "student" sees the previous screen
