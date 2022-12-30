@cms @teacher @learner
@syllabus
@question @question-common @question-v2
@ignore

Feature: Create and work with ordering question in exam

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with 1 Exam" book
        And school admin goes to book detail page
        And school admin goes to create question v2 page

    Scenario: School admin can create a question with the ordering question type in Exam LO
        Given school admin creates an ordering question
        And school admin sees message "You have created a new question successfully"
        And school admin will sees the newly created ordering question
        And school admin sees question details with correct answers order
        When student go to the "exam LO"
        And student finish the "exam LO"
        And teacher go to the student submission with "exam LO"
        Then teacher sees the result of the submission
