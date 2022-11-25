@cms @teacher @learner
@syllabus @studyplan @studyplan-tracking

Feature: Teacher view student study plan on teacher dashboard
    Background:
        Given "school admin" logins CMS      
        And "student" logins Learner App
        And school admin has created a "simple content have 1 quiz" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan with "active" study plan items

    #TCID:syl-0348
    @blocker
    Scenario: Teacher view student study plan of new student on teacher dashboard
        When school admin adds student to course
        And "teacher" logins Teacher App
        Then teacher sees the study plan items on Teacher App
        And student sees the study plan items at "active" in Todos screen on Learner App
        And student sees the study plan items in course on Learner app