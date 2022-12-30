@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Pop back or kill app when doing exam LO
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content with 5 question exam lo" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0588,syl-0592
    Scenario Outline: Reopen exam lo after quitting without doing any question
        Given student opens exam lo at nth time
        When student stops doing exam lo by "<action>"
        And student reopens exam lo
        Then student doesn't see the attempt history screen
        And student is at 1st question of exam lo
        And student sees status of full quiz set is unanswered
        And student sees exam LO displayed in Todo screen-"active" tab
        And teacher sees student's progress of the exam LO is empty
        Examples:
            | action   |
            | pop back |
            | kill app |

    #TCID:syl-0589
    Scenario Outline: Reopen exam lo after quitting with some questions have been done
        Given student opens exam lo at nth time
        And student has done some questions of exam lo
        When student stops doing exam lo by "<action>"
        And student reopens exam lo
        Then student doesn't see the attempt history screen
        And student is at 1st question of exam lo
        And student sees status of full quiz set is unanswered
        And student sees exam LO displayed in Todo screen-"active" tab
        And teacher sees student's progress of the exam LO is empty
        Examples:
            | action   |
            | pop back |
            | kill app |

    #TCID:syl-0590
    Scenario: Reopen exam lo after quitting by kill app with some questions have been done in take again mode
        Given student has submitted exam lo nth times
        And student reopens exam lo from Course Screen and go to Take Again mode
        And student has done some questions of exam lo
        When student stops doing exam lo by "kill app"
        And student reopens exam lo
        Then student sees the Attempt history screen with nothing changed
        And student goes to take again mode again
        And student is at 1st question of exam lo
        And student sees status of full quiz set is unanswered
        And student sees exam LO displayed in Todo screen-"completed" tab
        And teacher sees student's progress of the exam LO with nothing changed

    #TCID:syl-0591
    Scenario: Reopen exam lo after quitting by pop back with some questions have been done in take again mode
        Given student has submitted exam lo nth times
        And student reopens exam lo from Course Screen and go to Take Again mode
        And student has done some questions of exam lo
        When student stops doing exam lo by "pop back"
        And student reopens exam lo
        Then student is at 1st question of exam lo
        And student sees status of full quiz set is unanswered
        And student sees exam LO displayed in Todo screen-"completed" tab
        And teacher sees student's progress of the exam LO with nothing changed