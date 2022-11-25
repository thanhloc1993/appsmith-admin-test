@cms @teacher @learner
@syllabus @question @question-common

Feature: Delete question

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student

    #TCID:syl-0082
    Scenario Outline: Student and teacher can't see the deleted <type> question when admin deletes that <type> question in a LO
        Given school admin is at a LO detail page
        And school admin has created a new "<type>" question
        When school admin deletes the question
        Then school admin does not see the deleted question on CMS
        And student does not see the question on Learner App
        And teacher does not see the question on Teacher App
        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |
