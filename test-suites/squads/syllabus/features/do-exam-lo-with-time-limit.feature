@cms @learner
@syllabus @exam-lo-common @exam-lo-timer

@staging
Feature: Do Exam LO with time limit

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "1 exam lo with random time limit" book
        And school admin has created a matched studyplan for student

    Scenario: Student practices exam lo with time limit
        When student practices exam lo
        Then student sees exam lo's time limit with matched setting
        And student sees time counting down at exam lo

    Scenario: Student can submit exam lo with time limit
        Given student practices exam lo
        And student does some questions at exam lo
        When student taps on "Submit Button"
        Then student sees submit-confirmation popup with content
        And student can submit exam lo with time limit
