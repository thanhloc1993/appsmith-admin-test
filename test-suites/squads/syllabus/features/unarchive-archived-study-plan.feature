@cms @teacher @learner
@syllabus @studyplan @studyplan-course

Feature: Unarchive an archived study plan
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student S1" logins Learner App
        And school admin has created a "has 1 assignment" book
        And school admin has created a new course without any location
        And school admin has added student S1 to the course
        And school admin has created 1 "active" study plan with "full" info
        And school admin goes to the "course" study plan in the course detail
        And school admin sees individual SP of student in course active
        And school admin archives 1 master study plans in master detail page

    #TCID:syl-0399
    @blocker
    Scenario: Unarchive an archived master study plan
        When school admin unarchives 1 master study plans in master detail page
        Then school admin sees the active study plans in master tab
        And school admin sees individual SP of student in course active
        And teacher sees the study plan of student on Teacher App
        And student in course do not see unavailable items of the active master study plan
