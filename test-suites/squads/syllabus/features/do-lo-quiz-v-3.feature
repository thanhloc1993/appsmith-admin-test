@cms @teacher @learner
@syllabus @question @question-common @question-v2

Feature: Do and redo LO quiz optimization on study plan

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created 4 random questions to do LO quiz
        And school admin has created a matched studyplan for student

    # @blocker
    #TCID:syl-0104
    Scenario: Teacher and Student see LO's learning progress
        When student does the question
        Then learning progress of student is updated on Learner App
        And learning progress of student is updated on Teacher App
