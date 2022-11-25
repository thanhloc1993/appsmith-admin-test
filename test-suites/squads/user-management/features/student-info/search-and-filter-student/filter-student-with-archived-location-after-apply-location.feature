@ignore
@cms
@user @student-location
Feature: Filter student with archived location after applied location

    Background:
        Given "school admin" logins CMS
        And school admin has imported location master data

    #13282
    Scenario: All student with archived Location displays under default filter mode
        Given school admin has created a student belong to "location L1"
        And school admin archives "location L1"
        And school admin goes to student list
        When school admin selects "nothing" location on Location Setting
        Then the student list is displayed full records
        And school admin sees newly created student on CMS

    #13283 - 13284
    Scenario Outline: Refresh page after archived the children under a parent location
        Given school admin has created parent "location P1" with "<child location>"
        And school admin has created a student belong to "location P1"
        And school admin archives "location L1"
        And school admin goes to student list
        When school admin reloads page
        Then the student list is displayed full records
        And school admin sees newly created student on CMS
        Examples:
            | child location           |
            | location L1              |
            | location L1, location L2 |

    Scenario Outline: Filter location after archived the children under a parent location
        Given school admin has created parent "location P1" with "<child location>"
        And school admin has created a student belong to "location P1"
        And school admin archives "location L1"
        And school admin goes to student list
        When school admin "selects" "<option>" on Location Setting
        Then school admin "<results>" newly created student displays with "<child location>" on location field
        Examples:
            | child location           | option       | results      |
            | location L1              | all location | does not see |
            | location L1, location L2 | location P1  | sees         |
            | location L1, location L2 | all location | sees         |

    Scenario Outline: Archived location under a parent location does not see in location popup
        Given school admin has created parent "location P1" with "<child location>"
        And school admin has created a student belong to "location P1"
        And school admin archives "location L1"
        And school admin goes to student list
        When school admin opens location popup
        Then school admin "does not see" "location L1" in location popup
        Examples:
            | child location           |
            | location L1              |
            | location L1, location L2 |