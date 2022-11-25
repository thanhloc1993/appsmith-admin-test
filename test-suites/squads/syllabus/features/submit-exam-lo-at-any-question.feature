@cms @teacher @learner
@syllabus @exam-lo @exam-lo-common

Feature: Submit exam lo at any question

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content with 5 question exam lo" book
        And school admin has created a matched studyplan for student

    # nth time = 2nd time or 3rd time or 4th time
    #TCID:syl-0567
    Scenario: Student submits exam lo at any question when he hasn't done any question yet
        Given student opens exam lo at nth time
        When student selects a random question
        Then student can do that question
        And student can submit at that question

    #TCID:syl-0568
    Scenario Outline: Student submits exam lo at any question when he has done <some> questions
        Given student does <some> questions of exam lo
        When student selects a random question
        Then student can do that question
        And student can submit at that question

        Examples:
            | some |
            | 1    |
            | 3    |
            | 5    |

    #TCID:syl-0569
    Scenario Outline: Student submits exam lo at any question when he has done <some> questions and submitted from Course Screen
        Given student has submitted exam lo with doing <some> questions
        And student reopens exam lo from Course Screen and go to Take Again mode
        When student selects a random question
        Then student can do that question
        And student can submit at that question

        Examples:
            | some |
            | 0    |
            | 3    |
            | 5    |

    #TCID:syl-0570
    Scenario Outline: Student submits exam lo at any question when he has done <some> questions and submitted from Todo Screen
        Given student has submitted exam lo with doing <some> questions
        And student reopens exam lo from Todo Screen and go to Take Again mode
        When student selects a random question
        Then student can do that question
        And student can submit at that question

        Examples:
            | some |
            | 0    |
            | 3    |
            | 5    |