@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-share-material

Feature: Teacher can share again sharing material
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can reshare sharing <material>
        Given "teacher T1" has shared lesson's "<material>" on Teacher App
        When "teacher T1" shares again lesson's "<material>" on Teacher App
        Then "teacher T1" still sees current lesson's "<material>" normally on Teacher App
        And "teacher T2" still sees current lesson's "<material>" normally on Teacher App
        And "student" still sees current "<material>" normally on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario Outline: Other teacher can reshare sharing <material>
        Given "teacher T1" has shared lesson's "<material>" on Teacher App
        When "teacher T2" shares again lesson's "<material>" on Teacher App
        Then "teacher T1" still sees current lesson's "<material>" normally on Teacher App
        And "teacher T2" still sees current lesson's "<material>" normally on Teacher App
        And "student" still sees current "<material>" normally on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |
