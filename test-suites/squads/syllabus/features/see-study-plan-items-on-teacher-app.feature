@cms @teacher @learner
@syllabus @studyplan @studyplan-item-view

Feature: Teacher sees student study plan on teacher dashboard

    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And school admin has created a "simple content without quiz" book
    # "matched studyplan" = studyplan exact match with the book content

    #TCID:None
    Scenario: Teacher sees student study plan on teacher dashboard
        Given school admin has created a matched studyplan for student
        And "teacher" logins Teacher App
        Then teacher sees the study plan items on Teacher App
        And student sees the study plan items at "active" in Todos screen on Learner App
        And student sees the study plan items in course on Learner app