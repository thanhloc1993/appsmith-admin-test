@cms @learner
@syllabus @exam-lo-common @exam-lo-timer
@staging

Feature: Reset the timer when student leaves then goes back to the exam lo

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "1 exam lo with random time limit" book
        And school admin has created a matched studyplan for student

    Scenario: Student leaves the exam lo before finishing and goes back to this exam lo again
        Given student practices exam lo
        And student sees exam lo's time limit with matched setting
        And student sees time counting down at exam lo
        When students leaves the exam lo
        And students practices this exam lo again
        Then students sees the timer is reset
