@cms @teacher @learner
@syllabus @studyplan @studyplan-tracking

Feature: Teacher view student study plan on teacher dashboard
    Background:
        Given "school admin" logins CMS
        And "student" logins Learner App
        And "teacher" logins Teacher App
        And school admin has created a "has 1 assignment" book
        And school admin has created a new course without any location
        And school admin has created a matched studyplan with "active" study plan items

    #TCID:syl-0348
    Scenario: Teacher view student study plan of new student on teacher dashboard
        When school admin adds student to course
        Then teacher sees the study plan items on Teacher App
        And student sees the study plan items at "active" in Todos screen on Learner App
        And student sees the study plan items in course on Learner app
