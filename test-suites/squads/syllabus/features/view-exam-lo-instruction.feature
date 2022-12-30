@cms @learner
@syllabus @exam-lo @exam-lo-common
@staging

Feature: View exam lo instruction
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "has chapter and topic only" book
        And school admin is at book detail page

    Scenario Outline: Student views exact instruction of exam lo in learner app
        Given school admin creates an exam LO in book with "<field>"
        And school admin sees message of creating successfully
        And school admin creates random number of questions in current Exam LO
        And school admin has created a matched studyplan for student
        And school admin has updated exam lo with available time
        When student opens the exam lo instruction screen from "<fromScreen>"
        Then student sees the exact instruction and question number accordingly

        Examples:
            | field              | fromScreen    |
            | name               | Course screen |
            | name               | Todo screen   |
            | name & instruction | Course screen |
            | name & instruction | Todo screen   |

    Scenario Outline: Student views the new instruction of exam lo has updated in learner app
        Given school admin creates an exam LO in book with "name & instruction"
        And school admin sees message of creating successfully
        And school admin creates random number of questions in current Exam LO
        And school admin has created a matched studyplan for student
        And school admin has updated exam lo with available time
        When school admin updates exam lo with new instruction
        And student opens the exam lo instruction screen from "<fromScreen>"
        Then student sees the exact instruction and question number accordingly

        Examples:
            | fromScreen    |
            | Course screen |
            | Todo screen   |
