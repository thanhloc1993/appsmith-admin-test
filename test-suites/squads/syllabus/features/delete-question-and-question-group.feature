@cms @learner
@syllabus @question @question-common @question-v2
@ignore

Feature: delete question group and question in question group

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content with 2 LO learning, exam" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page

    Scenario Outline: Student and teacher can't see the deleted question when admin deletes question in question group
        Given school admin goes to the LO "<LOType>" detail page
        And school admin creates question and question group detail in "<LOType>"
            | groupType | questionList    |
            | group     | multiple answer |
        And student sees the new question and question group on Learner App in "<LOType>"
        And teacher sees the new question and question group on Teacher App in "<LOType>"
        When school admin deletes the question in question group
        Then school admin does not see question inside question group
        And student does not see question inside question group on Learner App with "<LOType>"
        And teacher does not see question inside question group on Teacher App with "<LOType>"
        Examples:
            | LOType             |
            | learning objective |
            | exam LO            |

    Scenario Outline: Student and teacher can't see the deleted question group when admin deletes question group
        Given school admin goes to the LO "<LOType>" detail page
        And school admin creates question and question group detail in "<LOType>"
            | groupType | questionList    |
            | group     | multiple answer |
        And student sees the new question group on Learner App in "<LOType>"
        And teacher sees the new question group on Teacher App in "<LOType>"
        When school admin deletes the question group
        Then school admin does not see question group
        And student does not see question group on Learner App with "<LOType>"
        And teacher does not see question group on Teacher App with "<LOType>"
        Examples:
            | LOType             |
            | learning objective |
            | exam LO            |
