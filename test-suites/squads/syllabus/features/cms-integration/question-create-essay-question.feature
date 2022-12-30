@cms @teacher @learner
@syllabus
@question @question-common @question-v2
@ignore

Feature: Create and work with essay question in exam

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "exam lo with manual grading is on" book
        And school admin goes to book detail page
        And school admin goes to create question v2 page

    Scenario Outline: School admin can create a question with the ordering question type in Exam LO
        Given school admin creates an essay question with "<limitValue>" "<limitConfigs>"
        And school admin sees message "You have created a new question successfully"
        And school admin will sees the newly created essay question
        And school admin sees essay question details created with "<limitValue>" "<limitConfigs>"
        When student go to the "exam LO"
        And student finish the "exam LO"
        And teacher go to the student submission with "exam LO"
        And teacher sees the result of the submission
        And teacher returns feedbacks for the submission
        Then student sees teacher's text feedbacks

        Examples:
            | limitConfigs    | limitValue |
            | no limit        | 0          |
            | character limit | 10         |
            | word limit      | 20         |
