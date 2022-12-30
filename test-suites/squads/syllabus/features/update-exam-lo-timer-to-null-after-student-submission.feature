@cms @learner
@syllabus @exam-lo-common @exam-lo-timer
@staging

Feature: Update exam lo timer to null after student submitting the exam lo

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "1 exam lo with random time limit" book
        And school admin has created a matched studyplan for student
        And student submits the exam lo with a valid random timer

    Scenario: Update exam lo timer to null after student submitting the exam lo
        Given school admin edits the timer to "null" after student submitting the exam lo
        When student practices this exam lo again
        Then student can no longer see the timer in this exam lo in instruction screen
        And student can no longer see the timer in this exam lo exam lo screen
