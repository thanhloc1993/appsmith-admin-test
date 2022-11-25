@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user

Feature: Teacher is unpinned when teacher creates or preview Stats of polling in the main bar on Teacher App
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson management with start date&time is more than 10 minutes from now
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: <teacher> is unpinned when teacher opens set up polling page after pinning <teacher>
        When "teacher T1" "Pin for me" "teacher T1" on Teacher App
        And "teacher T1" opens polling on Teacher App
        Then "teacher T1" sees set up polling page with 4 default options on Teacher App
        And "teacher T1" sees "<teacher>" with camera "inactive" in the gallery view on Teacher App
        Examples:
            | teacher    |
            | teacher T1 |
            | teacher T2 |

    Scenario Outline: <teacher> is unpinned when teacher opens polling Stats page after pinning <teacher>
        Given "teacher T1" has opened polling on Teacher App
        And "teacher T1" has set correct answer is "A" option
        And "teacher T1" has started polling on Teacher App
        When "teacher T1" "Pin for me" "teacher T1" on Teacher App
        And "teacher T1" shows again polling on Teacher App
        Then "teacher T1" sees Stats page on Teacher App
        And "teacher T1" sees "<teacher>" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1" sees "active" polling icon on Teacher App
        And "student" sees answer bar with 4 options on Learner App
        Examples:
            | teacher    |
            | teacher T1 |
            | teacher T2 |