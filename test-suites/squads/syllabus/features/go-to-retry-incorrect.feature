@cms @teacher @learner
@syllabus @retry-mode

Feature: Go to Retry Incorrect Mode

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0318
    Scenario: Go to Retry Incorrect Mode from a original quiz set
        Given school admin creates 10 questions in Quiz LO
        And student has completed Quiz LO with "1 of [1,2,3,4,5,6,7,8,9,10]" incorrect response
        And student is on retry attempt screen of the lo
        When student selects to retry incorrect
        Then student sees incorrect quiz set with "1 of [1,2,3,4,5,6,7,8,9,10]" questions

    #TCID:syl-0320
    Scenario: Go to Retry Incorrect Mode from a Retry Incorrect quiz set
        Given school admin creates 10 questions in Quiz LO
        And student has completed Quiz LO with "1 of [5,6,7,8,9,10]" incorrect response
        And student has completed the incorrect quiz set with "1 of [1,2,3,4,5]" incorrect response
        And student is on retry attempt screen of the lo
        When student selects to retry incorrect
        Then student sees incorrect quiz set with "1 of [1,2,3,4,5]" questions