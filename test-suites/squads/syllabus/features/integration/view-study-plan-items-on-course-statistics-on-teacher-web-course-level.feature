@cms @teacher @learner
@syllabus @course-statistics
@Syllabus_StudyPlan_CourseStatistic

Feature: Teacher views study plan items on course statistics on teacher web - course level
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App

    #TCID:None
    Scenario: Teacher views study plan items on course statistics on teacher web
        Given school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for student
        When teacher is at course statistics screen
        Then teacher sees course statistics study plan items
