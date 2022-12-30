@cms @learner @teacher
@syllabus @question @question-common @question-v2
@ignore

Feature: Move questions and question groups

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And school admin has created a "simple content with 2 LO learning, exam" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page

    Scenario Outline: Student and teacher can see updated order of questions inside question group
        Given school admin goes to the LO "<LOType>" detail page
        And school admin creates question and question group detail in "<LOType>"
            | groupType | questionList                                        |
            | group     | fill in the blank, multiple choice, multiple answer |
        And school admin sees new question group list created in "<LOType>"
        And student sees the new question and question group on Learner App with correct order in "<LOType>"
        And teacher sees the new question and question group on Teacher App with correct order in "<LOType>"
        When school admin moves the question inside question group in "<direction>" direction
        Then school admin sees questions inside question group are moved accordingly
        And student sees new order of question inside question group on Learner App in "<LOType>"
        And teacher sees new order of question inside question group on Teacher App in "<LOType>"

        Examples:
            | LOType             | direction       |
            | learning objective | 1 of [up, down] |
            | exam LO            | 1 of [up, down] |

    Scenario Outline: Student and teacher can see updated order of question groups
        Given school admin goes to the LO "<LOType>" detail page
        And school admin creates question and question group detail in "<LOType>"
            | groupType | questionList    |
            | group     | empty           |
            | group     | multiple answer |
        And school admin sees new question group list created in "<LOType>"
        And student sees the new question and question group on Learner App with correct order in "<LOType>"
        And teacher sees the new question and question group on Teacher App with correct order in "<LOType>"
        When school admin moves the question group in "<direction>" direction
        Then school admin sees the question groups are moved accordingly
        And student sees new order of question group on Learner App in "<LOType>"
        And teacher sees new order of question group on Teacher App in "<LOType>"

        Examples:
            | LOType             | direction       |
            | learning objective | 1 of [up, down] |
            | exam LO            | 1 of [up, down] |
