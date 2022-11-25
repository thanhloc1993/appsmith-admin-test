@cms @learner @teacher
@cms2 @learner2 @teacher2
@staging
@syllabus @syllabus-multi-tenant

Feature: Create book in multi tenant

    Background:
        Given "school admin Tenant S1" has logged in with tenant on CMS
        And "school admin Tenant S2" has logged in with tenant on CMS
        And "school admin Tenant S1" has created a student "student Tenant S1"
        And "school admin Tenant S2" has created a student "student Tenant S2"

    #TCID:None
    #content of book is content-learnings, questions, materials
    Scenario: School admins check created books in multi tenant
        Given "school admin Tenant S1" creates a course "course Tenant S1" for "student Tenant S1"
        And "school admin Tenant S2" creates a course "course Tenant S2" for "student Tenant S2"
        When "school admin Tenant S1" creates a book "book Tenant S1"
        And "school admin Tenant S1" creates a matched studyplan "studyplan Tenant S1" by "book Tenant S1" for "course Tenant S1"
        And "school admin Tenant S2" creates a book "book Tenant S2"
        And "school admin Tenant S2" creates a matched studyplan "studyplan Tenant S2" by "book Tenant S2" for "course Tenant S2"
        Then "school admin Tenant S1" can see the book "book Tenant S1" and its content
        And "school admin Tenant S2" can see the book "book Tenant S2" and its content
        And "school admin Tenant S1" can not see the book "book Tenant S2" and its content
        And "school admin Tenant S2" can not see the book "book Tenant S1" and its content
        And "school admin Tenant S1" opens the book "book Tenant S2" and its content by URL and see error 404
        And "school admin Tenant S2" opens the book "book Tenant S1" and its content by URL and see error 404

    #TCID:None
    Scenario: Teachers check created books in multi tenant
        Given "school admin Tenant S1" creates a course "course Tenant S1" for "student Tenant S1"
        And "school admin Tenant S2" creates a course "course Tenant S2" for "student Tenant S2"
        And "school admin Tenant S1" creates a teacher "teacher Tenant S1"
        And "teacher Tenant S1" has logged in with tenant on Teacher Web
        And "school admin Tenant S2" creates a teacher "teacher Tenant S2"
        And "teacher Tenant S2" has logged in with tenant on Teacher Web
        When "school admin Tenant S1" creates a book "book Tenant S1"
        And "school admin Tenant S1" creates a matched studyplan "studyplan Tenant S1" by "book Tenant S1" for "course Tenant S1"
        And "school admin Tenant S2" creates a book "book Tenant S2"
        And "school admin Tenant S2" creates a matched studyplan "studyplan Tenant S2" by "book Tenant S2" for "course Tenant S2"
        Then "teacher Tenant S1" sees the book "book Tenant S1" topics in course "course Tenant S1" studyplan
        And "teacher Tenant S2" sees the book "book Tenant S2" topics in course "course Tenant S2" studyplan
        And "teacher Tenant S1" opens the course "course Tenant S2" studyplan and its contents by URL and see error 404
        And "teacher Tenant S2" opens the course "course Tenant S1" studyplan and its contents by URL and see error 404

    #TCID:None
    Scenario: Students check created books in multi tenant
        Given "school admin Tenant S1" creates a course "course Tenant S1" for "student Tenant S1"
        And "school admin Tenant S2" creates a course "course Tenant S2" for "student Tenant S2"
        And "student Tenant S1" has logged in with tenant on Learner Web
        And "student Tenant S2" has logged in with tenant on Learner Web
        When "school admin Tenant S1" creates a book "book Tenant S1"
        And "school admin Tenant S1" creates a matched studyplan "studyplan Tenant S1" by "book Tenant S1" for "course Tenant S1"
        And "school admin Tenant S2" creates a book "book Tenant S2"
        And "school admin Tenant S2" creates a matched studyplan "studyplan Tenant S2" by "book Tenant S2" for "course Tenant S2"
        Then "student Tenant S1" opens the course "course Tenant S1" and sees the book "book Tenant S1" contents
        And "student Tenant S2" opens the course "course Tenant S2" and sees the book "book Tenant S2" contents
        And "student Tenant S1" sees the book "book Tenant S1" LOs by open by URL
        And "student Tenant S2" sees the book "book Tenant S2" LOs by open by URL
        And "student Tenant S1" opens the course "course Tenant S2", the book "book Tenant S2" contents by URL and see error 404
        And "student Tenant S2" opens the course "course Tenant S1", the book "book Tenant S1" contents by URL and see error 404