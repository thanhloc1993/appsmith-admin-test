@cms @teacher @learner
@syllabus @flashcard @flashcard-common

Feature: View Flashcard details on Teacher App

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        # simple content: 1 chapter, 1 topic, LOs/Assignment each type is 1
        And school admin has created a "simple content have 5 card" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0305
    Scenario: View Flashcard detail in topic
        Given school admin sees flashcard list has been created on CMS
        When teacher goes to study plan management screen on Teacher App
        And teacher goes to flashcard details screen
        And teacher sees details of all cards on Teacher App