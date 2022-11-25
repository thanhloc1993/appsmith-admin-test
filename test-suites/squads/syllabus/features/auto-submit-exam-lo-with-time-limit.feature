@cms @learner
@syllabus @exam-lo-common @exam-lo-timer

@staging
Feature: Auto submit Exam LO with time limit

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "1 exam lo with 1 minute time limit" book
        And school admin has created a matched studyplan for student

    # submitted-content = answered question + time
    Scenario: Exam lo auto submit when reaching time limit
        Given student practices exam lo
        And student does some questions at exam lo
        When student stays at the exam until the time limit is over
        Then student sees exam lo is auto-submitted
        And student sees submitted-content of exam lo

    Scenario: Exam lo auto submit when reaching time limit while open leaving dialog
        Given student practices exam lo
        And student does some questions at exam lo
        When student taps on "Back Button"
        And student stays at the exam until the time limit is over
        Then student sees exam lo is auto-submitted
        And student sees submitted-content of exam lo