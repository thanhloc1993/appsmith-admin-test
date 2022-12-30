@cms @teacher @learner
@syllabus @question @question-common
@ignore

Feature: Create question

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student

    #TCID:syl-0058
    Scenario Outline: Student and teacher can see new <type> question when admin creates new <type> question in a LO
        Given school admin is at a LO detail page
        When school admin creates a new "<type>" question
        Then school admin sees the new "<type>" question on CMS
        And student sees the new "<type>" question on Learner App
        And teacher sees the new "<type>" question on Teacher App
        Examples:
            | type              |
            | fill in the blank |

    Scenario Outline: Student and teacher can see new <type> question when admin creates new <type> question in a flashcard
        Given school admin is at a flashcard detail page
        When school admin creates a new "<type>" question
        Then school admin sees the new "<type>" question on CMS
        And "student" sees the new "<type>" question on Learner App
        And "teacher" sees the new "<type>" question on Teacher App
        Examples:
            | type                |
            | term and definition |
            | pair of words       |