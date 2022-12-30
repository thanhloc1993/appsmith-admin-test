@cms @teacher @teacher2 @learner
@virtual-classroom
@virtual-classroom-pin-user-material-and-share-screen

Feature: Teacher can pin or unpin student when sharing material
    Background:
        Given "school admin" logins CMS
        And "teacher T1, teacher T2" login Teacher App
        And "student" with course and enrolled status has logged Learner App
        And school admin has created a lesson of lesson management with attached "pdf, video" on CMS
        And "teacher T1, teacher T2" have applied center location in location settings on Teacher App
        And "teacher T1, teacher T2" have joined lesson of lesson management on Teacher App
        And "student" has joined lesson on Learner App

    Scenario Outline: Teacher can pin student after other teacher shares <material> material
        Given "teacher T1" has shared lesson's "<material>" on Teacher App
        When "teacher T2" "Pin for me" "student" on Teacher App
        Then "teacher T1" sees lesson's "<material>" on Teacher App
        And "teacher T1" sees "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees "student" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T2" does not see "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1, teacher T2" see "active" share material icon on Teacher App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario Outline: Teacher can pin student before other teacher shares <material> material
        When "teacher T1" "Pin for me" "student" on Teacher App
        And "teacher T2" shares lesson's "<material>" on Teacher App
        Then "teacher T1" sees "student" stream with "camera" "inactive" in the main screen on Teacher App
        And "teacher T1" does not see "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees lesson's "<material>" on Teacher App
        And "teacher T2" sees "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1, teacher T2" see "active" share material icon on Teacher App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |

    Scenario Outline: Teacher can see current sharing <material> after unpin student
        Given "teacher T1" has shared lesson's "<material>" on Teacher App
        And "teacher T2" has "Pin for me" "student" on Teacher App
        When "teacher T2" "Unpin" "student" on Teacher App
        Then "teacher T1" sees lesson's "<material>" on Teacher App
        And "teacher T1" does not see "student" stream with "camera" in the main screen on Teacher App
        And "teacher T1" sees "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher T2" sees lesson's "<material>" on Teacher App
        And "teacher T2" sees "student" with camera "inactive" in the gallery view on Teacher App
        And "teacher T1, teacher T2" see "active" share material icon on Teacher App
        And "student" sees "<material>" on Learner App
        Examples:
            | material |
            | pdf      |
            | video    |