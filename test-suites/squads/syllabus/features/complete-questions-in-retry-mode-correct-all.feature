@cms @teacher @learner
@syllabus @retry-mode

Feature: Complete question in Retry Incorrect Mode with 0 incorrect response

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0319
    Scenario: Complete question in Retry Incorrect Mode with 0 incorrect response
        Given school admin creates 3 questions in Quiz LO
        And student has completed Quiz LO with 2 incorrect response
        And student has gone to retry incorrect mode
        When student completes all question in incorrect quiz set with 0 incorrect response
        Then retry incorrect result of student is updated on Learner App
        And retry incorrect result of student is updated on Teacher App