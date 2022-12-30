@cms @teacher @learner
@syllabus @retry-mode

Feature: Not resume learning when student kills app

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0324
    Scenario Outline: Not resume learning when student practiced all quizzes in LO and kills app
        Given school admin creates 10 questions in Quiz LO
        And student has completed Quiz LO with "1 of [0,1,2,3,4,5,6,7,8,9,10]" incorrect response in "<learning flow>"
        And student has selected to practice again
        And student has done "1 of [1,2,3,4,5,6,7,8,9]" questions
        And student reloads web
        When student goes to Quiz LO again in "<learning flow>" from Home Screen
        And student selects to practice again
        Then student sees the original quiz set questions

        Examples:
            | learning flow |
            | todo flow     |
            | course flow   |

    #TCID:syl-0318
    Scenario Outline:  Not resume learning when student had entered Retry Incorrect mode and kills app
        Given school admin creates 10 questions in Quiz LO
        And student has completed Quiz LO with "1 of [5,6,7,8,9,10]" incorrect response in "<learning flow>"
        And student has selected to retry incorrect
        And student has done incorrect "1 of [1,2,3,4]" questions
        And student reloads web
        When student goes to Quiz LO again in "<learning flow>" from Home Screen
        And student selects to retry incorrect
        Then student sees the latest incorrect quiz set

        Examples:
            | learning flow |
            | todo flow     |
            | course flow   |
