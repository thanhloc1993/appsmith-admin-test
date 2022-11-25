@cms
@user @student-location @ignore
Feature: Filter student after applied location

    Background:
        Given "school admin" logins CMS
        And student list has many records

    Scenario Outline: Filter student list by "Never logged in" tag after applied location
        Given school admin has created a student course with location
        And newly created student "<loginStatus>" on Learner App
        And school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        And school admin changes the rows per page into "5"
        And school admin goes to next page
        When school admin filters never logged in student
        Then school admin is on the first page of student list with "5" rows per page
        And school admin sees the student list is displayed correctly "with" filtered locations
        And school admin sees the student list is displayed correctly "with" "never logged in"
        And school admin "<results>" Never logged in tag on Back Office
        Examples:
            | loginStatus    | results      |
            | does not login | sees         |
            | logins         | does not see |

    Scenario Outline: Filter student without location by single option after applied location
        Given school admin creates a new student without location info
        And school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        And school admin changes the rows per page into "5"
        And school admin goes next page
        When school admin filters student by "<option>"
        Then school admin is on the first page of student list with "5" rows per page
        And school admin sees the student list is displayed correctly "with" filtered locations
        And school admin sees the student list is displayed correctly "with" "<option>"
        And school admin "does not see" newly created student in the student list
        Examples:
            | option          |
            | grade           |
            | course          |
            | never logged in |

    Scenario Outline: Clear the search filter/search after applied location
        Given school admin has created a student course with location
        And school admin "selects" "any" location on Location Setting
        When school admin filters student by "<option>"
        And school admin searches for keywords
        And school admin "<actions>"
        Then school admin sees the student list is displayed correctly "with" filtered locations
        And school admin sees the student list is displayed correctly "with" "keyword"
        And school admin "sees" newly created student in the student list
        Examples:
            | option                                | actions        |
            | 1 of [grade, course, never logged In] | clears keyword |
            | 1 of [grade, course, never logged In] | clears filter  |

    Scenario Outline: Search student by filter after applied location
        Given school admin has created a student course with location
        And school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        And school admin changes the rows per page into "5"
        And school admin goes next page
        When school admin filters student by "<option>"
        And school admin searches for keywords
        Then school admin is on the first page of student list with "5" rows per page
        And school admin sees the student list is displayed correctly "with" filtered locations
        And school admin sees the student list is displayed correctly "with" "<option>"
        And school admin "sees" newly created student in the student list
        Examples:
            | option          |
            | grade           |
            | course          |
            | never logged in |

    Scenario Outline: Filter student list by multiple option after applied location
        Given school admin has created a student course with location
        And newly created student "<loginStatus>" on Learner App
        And school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        When school admin filters student by "<option>"
        Then school admin sees the student list is displayed correctly "with" filtered locations
        And school admin sees the student list is displayed correctly "with" "<option>"
        And school admin "sees" "<option>" chip on Back Office
        And school admin "<results>" newly created student in the student list
        Examples:
            | loginStatus    | option                           | results      |
            | does not login | grade & course & never logged in | sees         |
            | logins         | grade & course & never logged in | does not see |