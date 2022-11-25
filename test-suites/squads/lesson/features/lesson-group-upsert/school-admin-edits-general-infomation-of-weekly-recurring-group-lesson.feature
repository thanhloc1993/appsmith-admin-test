@cms
@lesson
@lesson-group-upsert
@ignore

Feature: School Admin edits general information of weekly recurring group lesson
    Background:
        Given "school admin" logins CMS

    Scenario Outline: School Admin edits Attendance Info and Material of a <status> recurring lesson with "This and the following lessons"
        Given "school admin" has created a "<status>" "Weekly Recurring" "group" lesson in the "future" with attached "<material>"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "future"
        And "school admin" has opened editing lesson page
        When "school admin" updates "<status>", "<notice>", "<reason>", and "<note>" of student
        And "school admin" removes file "<material>"
        And "school admin" saves the changes with "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees Attendance is "<status>", "<notice>", "<reason>", and "<note>" of student are updated
        And school admin "does not see" "<material>" in material list under course lesson
        And "school admin" sees all "<status>" "future" lessons in chain no change
        Examples:
            | status    | material | status      | notice     | reason             | note             |
            | Draft     | pdf      | Attend      |            |                    |                  |
            | Draft     | video    | Absent      | On the day | Physical condition | medical exam     |
            | Published | pdf      | Late        | In Advance | Other              | personal errands |
            | Published | video    | Leave Early | No contact | Other              | traffic          |

    Scenario Outline: School Admin edits Attendance Info and Material of a <status> recurring lesson with "Only this Lesson"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "past"
        And "school admin" has applied location in location settings is the same as location in the lesson
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "past"
        And "school admin" has opened editing lesson page
        When "school admin" updates "<status>", "<notice>", "<reason>", and "<note>" of student
        And "school admin" adds file "<material>" to the lesson of lesson management on CMS
        And "school admin" saves the changes with "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees Attendance is "<status>", "<notice>", "<reason>", and "<note>" of student are updated
        And "school admin" sees all "<status>" "past" lessons in chain no change
        Examples:
            | status    | material | status      | notice     | reason             | note             |
            | Draft     | pdf      | Attend      |            |                    |                  |
            | Draft     | video    | Absent      | On the day | Physical condition | medical exam     |
            | Published | pdf      | Late        | In Advance | Other              | personal errands |
            | Published | video    | Leave Early | No contact | Other              | traffic          |

    Scenario Outline: School Admin edits general information of a <status> recurring lesson with the "This and the following lessons"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "future"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "future"
        And "school admin" has opened editing lesson page
        When "school admin" edits "<field>"
        And "school admin" saves the changes with "This and the following lessons" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated "<field>" for this "<status>" group lesson
        And "school admin" sees updated "<field>" for other "<status>" group lessons in chain
        And "school admin" other "<status>" group lessons before the edited lesson no change in "<field>"
        Examples:
            | status    | field           |
            | Draft     | teaching medium |
            | Published | course          |
            | Published | class           |

    Scenario Outline: School Admin edits general information of a <status> recurring lesson with the "Only this Lesson"
        Given "school admin" has created a "<status>" "Weekly Recurring" group lesson with filled all information in the "future"
        And "school admin" has applied "all child locations of parent" location
        And "school admin" has gone to detailed lesson page of the lesson which is in the middle of the chain in the "future"
        And "school admin" has opened editing lesson page
        When "school admin" edits "<field>"
        And "school admin" saves the changes with "Only this Lesson" saving option
        Then "school admin" is redirected to detailed lesson info page
        And "school admin" sees updated "<field>" for this "<status>" lesson
        And "school admin" other "<status>" group lessons before the edited lesson no change in "<field>"
        And "school admin" other "<status>" group lessons after the edited lesson no change in "<field>"
        Examples:
            | status    | field           |
            | Published | teaching medium |
            | Draft     | course          |
            | Draft     | class           |
