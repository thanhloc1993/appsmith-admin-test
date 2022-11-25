@cms
@lesson
@lesson-individual-upsert
@ignore

Feature: School Admin edits general information of weekly recurring individual lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin edits Attendance Info and Material of a <status> recurring lesson with "This and the following lessons"
        Given "school admin" has created a "<status>" weekly recurring individual lesson in the future and attached pdf and video
        And "school admin" has opened editing lesson page of the lesson in the recurring chain
        When "school admin" edits Attendance of Students
        And "school admin" removes file "<material>"
        And "school admin" saves the changes with "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated Attendance of Students and not sees "<material>" for this "<status>" lesson
        And "school admin" sees other "<status>" lessons in chain no change general information
        Examples:
            | status    | material |
            | Draft     | pdf      |
            | Published | video    |

    Scenario Outline: School Admin edits Attendance Info and Material of a <status> recurring lesson with "Only this Lesson"
        Given "school admin" has created a "<status>" weekly recurring individual lesson with lesson date in the past
        And "school admin" has opened editing lesson page of the lesson in the recurring chain
        When "school admin" edits Attendance of Students
        And "school admin" adds file "<material>" to the lesson of lesson management on CMS
        And "school admin" saves the changes with "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated Attendance of Students and "<material>" Info for this "<status>" lesson
        And "school admin" sees other weekly lessons in chain no change general information
        Examples:
            | status    | material |
            | Draft     | pdf      |
            | Published | video    |

    Scenario Outline: School Admin edits general information of a <status> recurring lesson with the "This and the following lessons" option
        Given "school admin" has created a "<status>" weekly recurring individual lesson with lesson date in the future
        And "school admin" has opened editing lesson page of the lesson in the recurring chain
        When "school admin" edits "<field>"
        And "school admin" saves the changes with "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated "<field>" for this "<status>" lesson
        And "school admin" sees updated "<field>" for other "<status>" lessons in chain
        Examples:
            | status    | field           |
            | Draft     | teaching medium |
            | Published | teaching medium |

    Scenario Outline: School Admin edits general information of a <status> recurring lesson with the "Only this Lesson" option
        Given "school admin" has created a "<status>" weekly recurring individual lesson with lesson date in the past
        And "school admin" has opened editing lesson page of the lesson in the recurring chain
        When "school admin" edits "<field>"
        And "school admin" saves the changes with "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated "<field>" for this "<status>" lesson
        And "school admin" sees other "<status>" lessons in chain no change general information
        Examples:
            | status    | field           |
            | Draft     | teaching medium |
            | Published | teaching medium |
