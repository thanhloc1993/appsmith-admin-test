@cms @teacher @learner
@virtual-classroom
@virtual-classroom-share-material

Feature: Sharing material after reconnecting
    Background:
        Given "school admin" logins CMS
        And "student" with course and enrolled status has logged Learner App
        And "teacher" logins Teacher App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher" has applied center location in location settings on Teacher App
        And "teacher" has joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can still see <material> after reconnecting
        Given "teacher" has shared lesson's "<material>" on Teacher App
        When "teacher" disconnects on Teacher App
        And "teacher" reconnects on Teacher App
        Then "teacher" still sees lesson's "<material>" on Teacher App
        And "teacher" sees "active" share material icon on Teacher App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario Outline: Student can still see <material> after reconnecting
        Given "teacher" has shared lesson's "<material>" on Teacher App
        When "student" disconnects on Learner App
        And "student" reconnects on Learner App
        Then "student" still sees "<material>" on Learner App
        And "teacher" sees lesson's "<material>" on Teacher App
        Examples:
            | material |
            | pdf      |
            | video    |
