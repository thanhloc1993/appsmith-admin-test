@cms @learner @learner2
@communication
@questionnaire-notification

Feature: Download Result table with questionnaire

    Background:
        Given "school admin" logins CMS
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose dialog
        And "school admin" input required fields with individual recipient "student S1, student S2"
        And "school admin" creates Questions and Answers of Questionnaire section
            | questionSection | numberOfAnswersEach | questionType                  |
            | Question Q1     | 3                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | Question Q2     | 3                   | QUESTION_TYPE_CHECK_BOX       |
            | Question Q3     | 0                   | QUESTION_TYPE_FREE_TEXT       |
        And "school admin" click Allow Resubmission
        And "school admin" has sent the notification
        And school admin clicks created notification in notification table

    Scenario: Download Result after learner answer and submit question
        Given "student S1" has accessed to notification detail
        And "student S1" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | A              |
            | Question Q2     | B, A           |
            | Question Q3     | Text example 1 |
        And "student S2" has accessed to notification detail
        And "student S2" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | A              |
            | Question Q2     | C, B, A        |
            | Question Q3     | Text example 2 |
        And "school admin" download questionnaire answer result
        And "school admin" sees file display correct with data
            | Responder Name | Question 1 | Question 2 | Question 3     |
            | student S1     | A          | A, B       | Text example 1 |
            | student S2     | A          | A, B, C    | Text example 2 |

    Scenario: Download Result after learner changes answer and Resubmit
        Given "student S1" has accessed to notification detail
        And "student S1" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | A              |
            | Question Q2     | B, A           |
            | Question Q3     | Text example 1 |
        And "student S2" has accessed to notification detail
        And "student S2" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | A              |
            | Question Q2     | C, B, A        |
            | Question Q3     | Text example 2 |
        And "student S1" resubmit question with new data
            | questionSection | answer                |
            | Question Q1     | B                     |
            | Question Q2     | B                     |
            | Question Q3     | Text example 1 update |
        And "student S2" resubmit question with new data
            | questionSection | answer                |
            | Question Q1     | C                     |
            | Question Q2     | B, C                  |
            | Question Q3     | Text example 2 update |
        And "school admin" download questionnaire answer result
        And "school admin" sees file display correct with data
            | Responder Name | Question 1 | Question 2 | Question 3            |
            | student S1     | B          | B          | Text example 1 update |
            | student S2     | C          | B, C       | Text example 2 update |
