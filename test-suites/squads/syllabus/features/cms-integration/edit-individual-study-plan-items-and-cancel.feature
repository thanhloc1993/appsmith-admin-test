@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Edit and cancel study plan items in individual study plan

    Background:
        Given "school admin" logins CMS
        And school admin has created a new course without any location
        And school admin has created a content book
        And school admin has created a matched study plan with active and archived items

    #TCID:syl-0871
    Scenario: User enters dates that are out of range and cancels
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin enters Start and Due dates that are out of Available From and Available Until range
        And school admin cancels study plan item edits
        Then school admin sees the study plan item values unchanged

    #TCID:syl-0871
    Scenario Outline: User enters invalid dates and cancels
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin enters "<field>" date that is later than "<otherField>"
        And school admin cancels study plan item edits
        Then school admin sees the "<field>" and "<otherField>" values of the study plan items unchanged

        Examples:
            | field          | otherField      |
            | Available From | Available Until |
            | Start Date     | Due Date        |

    #TCID:syl-0871
    Scenario Outline: User enters invalid values and cancels
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin enters "<valueType>" into the date fields
        And school admin cancels study plan item edits
        Then school admin sees the study plan item values unchanged

        Examples:
            | valueType          |
            | text               |
            | incorrect format   |
            | special characters |

    # The "values" will be randomly filled into Available From, Available Until, Start and Due
    # with any combination (either one, two, three or four fields) for each scenario
    #TCID:syl-0871
    Scenario Outline: User enters valid dates and cancels
        Given school admin is at the "individual" study plan details page
        When school admin edits the study plan content
        And school admin enters "<values>" into the fields with "<year>"
        And school admin cancels study plan item edits
        Then school admin sees the study plan item values unchanged

        Examples:
            | values        | year         |
            | date          | current year |
            | date and time | current year |
            | date          | another year |
            | date and time | another year |
