@cms @learner @learner2 @learner3
@communication
@questionnaire-notification

Feature: Result table display with questionnaire notification

    Background:
        Given "school admin" logins CMS
        And "student S1" logins Learner App
        And "student S2" logins Learner App
        And "student S3" logins Learner App
        And "school admin" is at "Notification" page on CMS
        And "school admin" open compose dialog
        And "school admin" input required fields with individual recipient "student S1, student S2, student S3"
        And "school admin" creates Questions and Answers of Questionnaire section
            | questionSection | numberOfAnswersEach | questionType                  |
            | Question Q1     | 4                   | QUESTION_TYPE_MULTIPLE_CHOICE |
            | Question Q2     | 4                   | QUESTION_TYPE_CHECK_BOX       |
            | Question Q3     | 0                   | QUESTION_TYPE_FREE_TEXT       |
        And "school admin" click Allow Resubmission
        And "school admin" has sent the notification

    Scenario: Result table display result when recipient answer and submit question
        Given school admin clicks created notification in notification table
        And "student S1" has accessed to notification detail
        And "student S1" filled out all questions and submitted the questionnaire
            | questionSection | answer       |
            | Question Q1     | A            |
            | Question Q2     | B, A, D      |
            | Question Q3     | Text example |
        And "student S2" has accessed to notification detail
        And "student S2" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | C              |
            | Question Q2     | C, B           |
            | Question Q3     | Text example 1 |
        And "school admin" open questionnaire result table
        And "school admin" sees result table display
            | Responder Name | Question 1 | Question 2 | Question 3     |
            | student S1     | A          | A, B, D    | Text example   |
            | student S2     | C          | B, C       | Text example 1 |

    Scenario: Result table update data when learner update answer and resubmit
        Given school admin clicks created notification in notification table
        And "student S1" has accessed to notification detail
        And "student S1" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | A              |
            | Question Q2     | A, B           |
            | Question Q3     | Text example 1 |
        And "student S2" has accessed to notification detail
        And "student S2" filled out all questions and submitted the questionnaire
            | questionSection | answer    |
            | Question Q1     | C         |
            | Question Q2     | C, B      |
            | Question Q3     | Example 2 |
        And "student S3" has accessed to notification detail
        And "student S3" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | B              |
            | Question Q2     | C              |
            | Question Q3     | Text example 3 |
        When "student S1" resubmit question with new data
            | questionSection | answer                |
            | Question Q1     | B                     |
            | Question Q2     | B, C, D               |
            | Question Q3     | Text example 1 update |
        And "student S2" resubmit question with new data
            | questionSection | answer      |
            | Question Q1     | A           |
            | Question Q2     | C, A        |
            | Question Q3     | Ex 2 update |
        And "school admin" open questionnaire result table
        And "school admin" sees result table display
            | Responder Name | Question 1 | Question 2 | Question 3        |
            | student S1     | B          | B, C, D    | Text example 1... |
            | student S2     | A          | A, C       | Ex 2 update       |
            | student S3     | B          | C          | Text example 3    |

    Scenario: Search student/parent name in result table
        Given school admin clicks created notification in notification table
        And "student S1" has accessed to notification detail
        And "student S1" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | A              |
            | Question Q2     | A, B           |
            | Question Q3     | Text example 1 |
        And "student S2" has accessed to notification detail
        And "student S2" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | C              |
            | Question Q2     | C, B           |
            | Question Q3     | Text example 2 |
        And "student S3" has accessed to notification detail
        And "student S3" filled out all questions and submitted the questionnaire
            | questionSection | answer         |
            | Question Q1     | B              |
            | Question Q2     | C              |
            | Question Q3     | Text example 3 |
        When "school admin" open questionnaire result table
        Then "school admin" search name "student S2" of Questionnaire Result dialog
        And "school admin" see correct record in Questionnaire Result table
            | Responder Name | Question 1 | Question 2 | Question 3     |
            | student S2     | C          | B, C       | Text example 2 |
