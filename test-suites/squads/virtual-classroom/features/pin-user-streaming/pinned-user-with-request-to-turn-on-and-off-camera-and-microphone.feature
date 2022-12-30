@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user-streaming

Feature: Pinned user with request to turn on and off camera and microphone
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has "Pin for me" "student" on Teacher App

    Scenario Outline: Teacher pins student and other teacher requests pinned student <function> and student accepts the request
        When "teacher T1" requests to turn on "student"'s "<function>" on Teacher App
        And "student" accepts teacher's request on Learner App
        Then "teacher T1" sees "student" stream with "<function>" "active" in the main screen on Teacher App
        And "teacher T2" sees "active" "student"'s "<function>" icon in student list on Teacher App
        And "student" sees "active" "<function>" icon on Learner App
        Examples:
            | function |
            | speaker  |
            | camera   |

    Scenario Outline: Teacher pins student and other teacher requests pinned student <function> and student declines the request
        When "teacher T1" requests to turn on "student"'s "<function>" on Teacher App
        And "student" declines teacher's request on Learner App
        Then "teacher T1" sees "student" stream with "<function>" "inactive" in the main screen on Teacher App
        And "teacher T2" sees "inactive" "student"'s "<function>" icon in student list on Teacher App
        And "student" sees "inactive" "<function>" icon on Learner App
        Examples:
            | function |
            | speaker  |
            | camera   |