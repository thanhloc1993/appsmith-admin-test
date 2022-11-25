@cms
@communication
@questionnaire-notification

Feature: View more and view less question in questionnaire detail
    Background:
        Given "school admin" logins CMS
        And "school admin" has created a student with grade, course and parent info
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose dialog and input required fields
        And "school admin" creates Questions and Answers of Questionnaire section
            | questionSection | numberOfAnswersEach | questionType                  |
            | Question Q1     | 2                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | Question Q2     | 2                   | QUESTION_TYPE_CHECK_BOX       |
            | Question Q3     | 0                   | QUESTION_TYPE_FREE_TEXT       |
        And "school admin" has sent the notification

    Scenario: View more in questionnaire with multiple question type
        Given school admin clicks created notification in notification table
        When "school admin" click "View more" in questionnaire detail section
        Then "school admin" sees "Question Q1,Question Q2" "expand" all answer
        And "school admin" sees "Up Arrow" at "Question Q1,Question Q2"

    Scenario: View less in questionnaire with multiple question type
        Given school admin clicks created notification in notification table
        And "school admin" click "View more" in questionnaire detail section
        When "school admin" click "View less" in questionnaire detail section
        Then "school admin" sees "Question Q1,Question Q2" "collapse" all answer
        And "school admin" sees "Down Arrow" at "Question Q1,Question Q2"
