@cms @teacher @learner
@syllabus @question @question-common @question-v2

Feature: Do and redo LO quiz optimization on study plan v2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page
        And school admin goes to create question page in "learning objective"

    @blocker
    #TCID:syl-0104
    Scenario Outline: Teacher and Student see LO's learning progress
        Given school admin creates a new "<type>" question v2
        And school admin sees the new "<type>" question on CMS
        When student does the question
        Then learning progress of student is updated on Learner App
        And learning progress of student is updated on Teacher App

        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |
