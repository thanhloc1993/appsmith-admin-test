@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-stop-and-end

Feature: Teacher can stop and end a polling
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can stop polling when teacher does not share any material
        Given "teacher" has not shared lesson's material on Teacher App
        And "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "teacher" stops polling on Teacher App
        Then "teacher" is still in Stats page on Teacher App
        And "teacher" still sees "active" polling icon on Teacher App
        And "student" still sees answer bar with 4 options on Learner App
        And "student" does not see material on Learner App

    Scenario Outline: Teacher can stop polling when teacher shares <material>
        Given "teacher" has shared lesson's "<material>" on Teacher App
        And "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        When "teacher" stops polling on Teacher App
        Then "teacher" is still in Stats page on Teacher App
        And "teacher" still sees "active" polling icon on Teacher App
        And "student" still sees answer bar with 4 options on Learner App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario: Teacher can end polling when teacher does not share any material
        Given "teacher" has not shared lesson's material on Teacher App
        And "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "teacher" has stopped polling on Teacher App
        When "teacher" ends polling on Teacher App
        Then "teacher" sees "inactive" polling icon on Teacher App
        And "teacher" still does not share material on Teacher App
        And "student" does not see answer bar on Learner App
        And "student" does not see material on Learner App

    Scenario Outline: Teacher can end polling when teacher shares <material>
        Given "teacher" has shared lesson's "<material>" on Teacher App
        And "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        And "teacher" has started polling on Teacher App
        And "teacher" has stopped polling on Teacher App
        When "teacher" ends polling on Teacher App
        Then "teacher" sees "inactive" polling icon on Teacher App
        And "teacher" still shares lesson's "<material>" on Teacher App
        And "student" does not see answer bar on Learner App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |
