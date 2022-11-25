@cms @teacher @learner
@syllabus @book @book-common

Feature: Delete chapter V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0080
    #TODO
    @ignore
    Scenario: Student still sees study plan items in Todos page but doesn't see it in study plan when admin deletes that chapter
        Given school admin is at book detail page
        When school admin deletes a chapter
        Then school admin does not see the chapter on CMS
        And school admin goes to the "course" study plan in the course detail
        And school admin does not see topics of chapter in master study plan detail page
        And school admin does not see topics of chapter in individual study plan detail page
        And teacher does not see topics which belong to that chapter on Teacher App
        And student does not see the deleted chapter in Course detail screen on Learner App
        And student does not see any LOs items which belong to that chapter in Todos screen on Learner App