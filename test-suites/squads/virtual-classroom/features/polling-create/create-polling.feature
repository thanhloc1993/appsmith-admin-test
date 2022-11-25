@cms @teacher @learner
@virtual-classroom
@virtual-classroom-polling-create

Feature: Teacher can create a polling
    Background:
        Given "school admin" logins CMS
        And "teacher" logins Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario: Teacher can open polling when teacher does not share any material
        Given "teacher" has not shared lesson's material on Teacher App
        When "teacher" opens polling on Teacher App
        Then "teacher" sees set up polling page with 4 default options on Teacher App
        #teacher does not start polling yet
        And "teacher" sees "inactive" polling icon on Teacher App
        And "student" does not see material on Learner App
        And "student" does not see answer bar on Learner App

    Scenario Outline: Teacher can open polling when teacher shares <material>
        Given "teacher" has shared lesson's "<material>" on Teacher App
        When "teacher" opens polling on Teacher App
        Then "teacher" sees set up polling page with 4 default options on Teacher App
        #teacher does not start polling yet
        And "teacher" sees "inactive" polling icon on Teacher App
        And "student" sees "<material>" on Learner App
        And "student" does not see answer bar on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario: Teacher can start polling when teacher does not share any material
        Given "teacher" has not shared lesson's material on Teacher App
        And "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        #4 default options
        When "teacher" starts polling on Teacher App
        Then "teacher" is redirected to Stats page on Teacher App
        And "teacher" sees "active" polling icon on Teacher App
        And "student" sees answer bar with 4 options on Learner App
        And "student" does not see material on Learner App

    Scenario Outline: Scenario Outline: Teacher can start polling when teacher shares <material>
        Given "teacher" has shared lesson's "<material>" on Teacher App
        And "teacher" has opened polling on Teacher App
        And "teacher" has set correct answer is "A" option
        #4 default options
        When "teacher" starts polling on Teacher App
        Then "teacher" is redirected to Stats page on Teacher App
        And "teacher" sees "active" polling icon on Teacher App
        And "student" sees answer bar with 4 options on Learner App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |