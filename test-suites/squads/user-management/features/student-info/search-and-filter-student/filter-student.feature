@cms
@user @student-search-filter @ignore
Feature: Filter student

    Background:
        Given "school admin" logins CMS
        And student list has many records

    Scenario Outline: Filter student by multiple <option>
        When school admin filters student by multiple "<option>"
        Then the student list is displayed student which matches at least 1 "<option>"
        Examples:
            | option |
            | grade  |
            | course |
    # Check the message after apply
    Scenario: Still see full student list when apply no filter
        When school admin applies no filter
        Then the student list is displayed full records

    Scenario: No result page is displayed when nothing matches with filter option
        When school admin filters student by option which does not match any student
        Then no result page is displayed

    Scenario Outline: Go to first page of result after filtering student
        Given school admin is not on the first page of student list
        And school admin changes the rows per page into "5"
        When school admin filters student by "<option>"
        Then school admin is on the first page of student list with "5" rows per page
        And the student list is displayed student which matches "<option>"
        Examples:
            | option           |
            | grade            |
            | course           |
            | grade and course |

    Scenario: Filters student by multiple course and multiple grade
        When school admin filters student by multiple course and multiple grade
        Then the student list is displayed student which matches at least 1 course and 1 grade

    #13276 Cancel add/edit/deselect location filter
    Scenario Outline: Cancel editing Location filter
        Given school admin "selects" "any" location on Location Setting
        And school admin goes to student list
        When school admin "changes to another" location on Location Setting
        And school admin cancels the editing process by using "<option>"
        Then school admin sees Location Setting popup closed
        And school admin sees the student list is displayed correctly "with" filtered location
        Examples:
            | option        |
            | X button      |
            | Cancel button |
            | ESC key       |

    Scenario Outline: Cancel adding Location filter
        Given school admin "selects" "any" location on Location Setting
        And school admin goes to student list
        When school admin "adds another" location on Location Setting
        And school admin cancels the editing process by using "<option>"
        Then school admin sees Location Setting popup closed
        And school admin sees the student list is displayed correctly "with" filtered location
        Examples:
            | option        |
            | X button      |
            | Cancel button |
            | ESC key       |

    Scenario Outline: Cancel deselects Location filter
        Given school admin "selects" "any" location on Location Setting
        And school admin goes to student list
        When school admin "deselects all" location on Location Setting
        And school admin cancels the editing process by using "<option>"
        Then school admin sees Location Setting popup closed
        And school admin sees the student list is displayed correctly "with" filtered location
        Examples:
            | option        |
            | X button      |
            | Cancel button |
            | ESC key       |

    #13057-1
    Scenario Outline: Admin filters student list by Grade/Course after applied location
        Given school admin goes to student list
        And school admin "selects" "any" location on Location Setting
        And school admin changes the rows per page into "5"
        And school admin goes to next page
        When school admin filters student by "<option>"
        Then school admin is on the first page of student list with "5" rows per page
        And the student list is displayed student which matches "<option>" and filtered locations
        And school admin "sees" "<option>" tag on CMS
        Examples:
            | option |
            | grade  |
            | course |

    #13057-2
    Scenario:  Admin does not filter student list after applied location
        Given school admin "selects" "any" location on Location Setting
        And school admin goes to student list
        When school admin applies no filter
        Then school admin sees message "Invalid search query - returning all items"
        And school admin sees the student list is displayed correctly "with" filtered location