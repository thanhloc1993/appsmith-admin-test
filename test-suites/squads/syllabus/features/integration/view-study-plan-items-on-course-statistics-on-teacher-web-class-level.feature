@cms @teacher
@syllabus @course-statistics
@Syllabus_StudyPlan_CourseStatistic

Feature: Teacher views study plan items on course statistics on teacher web - class level
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App

    #TCID:None
    Scenario: Teacher views study plan items on course statistics on teacher web
        Given school admin has created a student belong to "location"
        And school admin has created a "course" belong to "location" and "class"
        And school admin wants to add a new student-course
        And school admin adds a new "available" "course" with "location"
        And school admin registers "class" for "course"
        And school admin has created a "simple content without quiz" book
        And school admin has created a matched studyplan for course
        When teacher is at course statistics screen
        Then teacher sees course statistics study plan items
