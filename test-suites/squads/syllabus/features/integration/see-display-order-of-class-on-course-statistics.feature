@cms @teacher
@syllabus @course-statistics
@Syllabus_StudyPlan_CourseStatistic_Phase3_CourseLevel

Feature: Teacher sees display order of classes on course statistics on teacher web
    Background:
        Given "school admin" logins CMS
        And school admin has created students "student S1,student S2" belong to location
        And school admin has created a "course" belong to "location" and "class C2 & class C1"
        And school admin adds the "course" for "student S1" with "location" and "class C2"
        And school admin adds the "course" for "student S2" with "location" and "class C2"

    Scenario: Teacher sees display order of classes on course statistics on teacher web
        Given school admin has created a "simple content without quiz" book "book B1"
        And school admin creates a matched studyplan "study plan SP1" by "book B1" for "course"
        And school admin has created a "simple content without quiz" book "book B2"
        And school admin creates a matched studyplan "study plan SP2" by "book B2" for "course"
        And "teacher" logins Teacher App
        When teacher is at course statistics screen of "course"
        Then teacher sees the all classes option
        And teacher sees descending order in which the classes "class C2 & class C1" are created