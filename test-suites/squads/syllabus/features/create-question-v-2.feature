@cms @teacher @learner
@syllabus @question @question-common @question-v2

Feature: Create question v2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "has 1 learning objective" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page
        And school admin goes to create question page in "learning objective"

    #TCID:syl-0058
    # @blocker
    Scenario Outline: Create <type> question in learning objective
        When school admin creates a new "<type>" question v2
        Then school admin sees the new "<type>" question on CMS
        And student sees the new "<type>" question on Learner App
        And teacher sees the new "<type>" question on Teacher App

        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |
