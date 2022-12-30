@cms @teacher @learner
@syllabus @book @book-common

Feature: Delete topic V2

    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" logins Learner App
        And school admin has created a "content without quiz" book
        And school admin has created a matched studyplan for student

    #TCID:syl-0080
    #TODO
    @ignore
    Scenario: Student still sees topic's content in Todos page but doesn't see it in studyplan when admin deletes that topic
        Given school admin is at book detail page
        When school admin deletes a topic
        Then school admin does not see that topic on CMS
        And school admin goes to the "course" study plan in the course detail
        And school admin does not see that topic on master study plan CMS
        And school admin does not see that topic on individual study plan CMS
        And teacher does not see deleted topic on Teacher App
        And student does not see topic in Course detail screen on Learner App
        And student does not see any LOs items which belong to that topic in Todos screen on Learner App
