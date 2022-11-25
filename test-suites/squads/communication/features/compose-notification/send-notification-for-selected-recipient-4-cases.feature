@cms @learner @parent
@communication
@compose-notification
@ignore

Feature: Send notification for selected recipients (4 basic cases)
    Background:
        Given "school admin" logins CMS
        And "school admin" has created student S1 with grade and parent P1, parent P2 info
        And "school admin" has created student S2 with grade and parent P3 info
        And "school admin" has created 2 courses "Course C1" and "Course C2"
        And "school admin" has added "Course C1" for student S1
        And "school admin" has added "Course C2" for student S2
        And "school admin" is at Notification page

    Scenario: Send notification to student and parent in all course, all grade and empty user email
        Given school admin has created notification
        When school admin sends a notification to student and parent in all course, all grade and empty user email
        Then "student S1", "parent P1" sees a sent notification
        And "student S2", "parent P2" sees a sent notification
        And "parent P3" sees a sent notification

    Scenario: Send notification to student and parent in course C1, student S1's grade and student S2's email
        Given school admin has created notification
        When school admin sends a notification to student and parent in "course C1", "student S1's grade" and "student S2's email"
        Then "student S1", "parent P1" sees a sent notification
        And "student S2", "parent P2" sees a sent notification
        And "parent P3" sees a sent notification

    Scenario: Send notification to student in course C1 & C2, student's S1, S2 grades and empty user email
        Given school admin has created notification
        When school admin sends a notification to student in "course C1 & C2", "student's S1, S2 grades" and empty user email
        Then matching recipients receive the notification

    Scenario: Send notification to parent in course C1 & C2, student's S1, S2 grades and empty student S2's email
        Given school admin has created notification
        When school admin sends a notification to parent in "course C1 & C2", "student's S1, S2 grades" and "student S2's email"
        Then "parent P1", "parent P2" sees a sent notification
        And "parent P3" sees a sent notification