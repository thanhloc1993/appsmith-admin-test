@cms @teacher @learner
@staging @syllabus @question @question-common @question-v2

Feature: Edit question v2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with 1 LO learning" book
        And school admin has created a matched studyplan for student
        And school admin goes to book detail page
        And school admin goes to create question page in "learning objective"

    #TCID:syl-0074
    Scenario Outline: Edit <type> question in LO
        Given school admin creates a new "<type>" question v2
        And school admin sees the new "<type>" question on CMS
        When school admin edits the created question
        Then school admin sees message "You have updated question successfully"
        And school admin sees the edited question on CMS
        And student sees the edited question on Learner App
        And teacher sees the edited question on Teacher App
        Examples:
            | type              |
            | multiple choice   |
            | fill in the blank |
            | manual input      |
            | multiple answer   |

    #TCID:syl-0075
    Scenario Outline: Student & teacher can see question type changed in LO
        Given school admin creates a new "<type>" question v2
        And school admin sees the new "<type>" question on CMS
        When school admin change question type
        Then school admin sees message "You have updated question successfully"
        And school admin sees the edited question on CMS
        And student sees the edited question on Learner App
        And teacher sees the edited question on Teacher App
        Examples:
            | type                                                                   |
            | 1 of [multiple choice,fill in the blank,manual input, multiple answer] |
