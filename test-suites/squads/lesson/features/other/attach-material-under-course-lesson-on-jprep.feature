@cms-jprep
@teacher
@lesson
@jprep

Feature: School Admin can attach material under course lesson on Jprep
    Background:
        Given system has synced teacher and student from partner
        And system has synced course with online lesson from partner
        And system has synced course with student from partner
        And school admin has logged in CMS Jprep
        And teacher has logged Teacher App Jprep
        And "school admin" has gone to detail course page

    Scenario Outline: School Admin can attach both <material> under course lesson on Jprep
        When school admin attaches "<material>" under course lesson
        Then school admin "can see" "<material>" in material list under course lesson
        And school admin can preview "<material>" material on CMS
        And "teacher" goes to the live lesson on Teacher App Jprep
        And "teacher" "can see" "<material>" material of the lesson page on Teacher App Jprep
        And "teacher" can preview "<material>" material of the lesson page on Teacher App Jprep
        Examples:
            | material   |
            | pdf        |
            | video      |
            | pdf, video |
        @blocker
        Examples:
            | material   |
            | pdf, video |

    Scenario Outline: School Admin can edit <newMaterial> by adding under course lesson on Jprep
        Given school admin has attached "pdf 1, video 1" under course lesson
        When school admin edits lesson course by adding "<newMaterial>"
        Then school admin "can see" "<newMaterial>" in material list under course lesson
        And "teacher" goes to the live lesson on Teacher App Jprep
        And "teacher" "can see" "<newMaterial>" material of the lesson page on Teacher App Jprep
        Examples:
            | newMaterial    |
            | pdf 2          |
            | video 2        |
            | pdf 2, video 2 |

    Scenario Outline: School Admin can edit <material> by removing under course lesson on Jprep
        Given school admin has attached "pdf, video" under course lesson
        When school admin edits lesson course by removing "<material>"
        Then school admin "does not see" "<material>" in material list under course lesson
        And "teacher" goes to the live lesson on Teacher App Jprep
        And "teacher" "does not see" "<material>" material of the lesson page on Teacher App Jprep
        Examples:
            | material   |
            | pdf        |
            | video      |
            | pdf, video |
