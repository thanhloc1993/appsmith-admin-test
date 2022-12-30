@cms
@lesson
@lesson-group-upsert
@ignore

Feature: School admin cannot create one time group lesson with missing require field
    Scenario Outline: School admin cannot create one time group lesson with missing require field
        When "school admin" creates one time group lesson with missing required "<field>"
        Then "school admin" sees alert message under required "<field>"
        And "school admin" is still in creating lesson page
        And "school admin" does not see newly created group lesson
        Examples:
            | field      |
            | Start Time |
            | End Time   |
            | Teacher    |
            | Location   |
            | Student    |
            | Course     |
