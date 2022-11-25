@cms @teacher @learner @parent
@user @student-location @ignore

Feature: Validation remove location for edit student

    Background:
        Given "school admin" logins CMS

    #14748
    Scenario Outline: Remove student location with unavailable student course
        Given school admin has created a "student S1" with "location L1" and "unavailable" "course"
        And "school admin" has been editing student
        When school admin removes "location L1" by "<action>"
        Then school admin does not see "location L1" of "student S1" on Student Management page
        Examples:
            | action                                |
            | deselected from Select Location popup |
            | click X button on location field      |

    Scenario Outline: Remove student location with no student course
        Given school admin has created a "student S1" with "location L1"
        And "school admin" has been editing student
        When school admin removes "location L1" by "<action>"
        Then school admin does not see "location L1" of "student S1" on Student Management page
        Examples:
            | action                                |
            | deselected from Select Location popup |
            | click X button on location field      |

    #14760
    Scenario: Remove student location when combine available and unavailable student course
        Given school admin has created a "student S1" with location and course
            | location    | course                |
            | location L1 | available course C1   |
            | location L2 | unavailable course C2 |
        And "school admin" has been editing student
        When school admin removes "location L1" by deselected from Select Location popup
        Then school admin does not see "location L1" of "student S1" on Student Management page
        And school admin sees "location L2" of "student S1" on Student Management page

    #14763
    Scenario Outline: Unable to remove student location with available student course
        Given school admin has created a "student S1" with "location L1" and "available" "course"
        And "school admin" has been editing student
        When school admin removes "location L1" by "<action>"
        And school admin does not see "location L1" in the chip Select Location Popup
        And school admin does not see "location L1" in location field
        Then school admin clicks "save" in edit student page
        And school admin sees the error message
        Examples:
            | action                                |
            | deselected from Select Location popup |
            | click X button on location field      |

    #14764
    Scenario Outline: Unable to remove student location when combine available and unavailable student course
        Given school admin has created a student with location and course
            | location    | course                |
            | location L1 | available course C1   |
            | location L2 | unavailable course C2 |
        And "school admin" has been editing student
        When school admin removes "location L1 & location L2" by "<action>"
        And school admin does not see "location L1 & location L2" in the chip Select Location Popup
        And school admin does not see "location L1 & location L2" in location field
        Then school admin clicks "save" in edit student page
        And school admin sees the error message
        Examples:
            | action                                |
            | deselected from Select Location popup |
            | click X button on location field      |