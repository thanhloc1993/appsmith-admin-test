@cms @teacher @learner
@syllabus @question @question-common
@ignore

Feature: Do and redo LO's quiz on SP V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a content book
        And school admin has created a matched studyplan for student
        And school admin is at a LO detail page

    Scenario Outline: Student's learning progress is updated for student and teacher every time student does a <type> question in a LO
        Given school admin creates a new "<type>" question
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

    Scenario Outline: Student's learning progress is updated for student and teacher every time student redoes a <type> question in a LO
        Given school admin creates a new "<type>" question
        And student does the question
        When student redoes the question
        Then learning progress of student is updated on Learner App
        And learning progress of student is updated on Teacher App
        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |
