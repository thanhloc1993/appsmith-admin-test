@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher pins student and other teacher turns off pined student camera or microphone
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App
        And "teacher T1" has "Pin for me" "student" on Teacher App

    Scenario Outline: Other teacher turn off student <function>
        Given "teacher T1" has requested to turn on "student"'s "<function>" on Teacher App
        And "student" has accepted teacher's request on Learner App
        When "teacher T2" turns off "student" "<function>" on Teacher App
        Then "teacher T1" sees "student" stream with "<function>" "inactive" in the main screen on Teacher App
        And "teacher T2" sees "inactive" "student"'s "<function>" icon in student list on Teacher App
        And "student" sees "inactive" "<function>" icon on Learner App
        Examples:
            | function |
            | speaker  |
            | camera   |

    Scenario: Other teacher turn off student camera and microphone
        Given "teacher T1" has requested to turn on "student"'s camera and microphone and learner accepted it
        When "teacher T2" turns off "student" camera and microphone on Teacher App
        Then "teacher T1" sees "student" stream with camera and microphone "inactive" in the main screen on Teacher App
        And "teacher T2" sees "inactive" "student" camera and microphone icon in student list on Teacher App
        And "student" sees "inactive" camera and microphone icon on Learner App