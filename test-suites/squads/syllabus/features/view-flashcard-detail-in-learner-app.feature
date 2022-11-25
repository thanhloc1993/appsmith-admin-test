@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: View Flashcard detail

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0260
    Scenario: View Flashcard detail in topic
        Given student goes to Topic Detail screen
        When student selects a flashcard
        Then student sees Flashcard Detail screen