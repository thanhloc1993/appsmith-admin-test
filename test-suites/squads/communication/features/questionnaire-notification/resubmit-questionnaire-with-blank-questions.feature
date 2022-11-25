@cms @learner
@communication
@questionnaire-notification

Feature: Resubmit questionnaire with blank questions

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "school admin" has created questionnaire notification with "resubmit allowed"
            | questionType | required | numberOfQuestions |
            | CheckBox     | true     | 2                 |
            | Short answer | true     | 1                 |
        And "school admin" sent the notification to "student"
        And "student" has accessed to notification detail
        And "student" has submitted questionnaire with valid data

    Scenario: Learner resubmit question with the blank question which required
        Given "student" clicked on resubmit button
        When "student" remove answers of the questions
        And "student" submits the questionnaire
        Then "student" sees the errors of each question
