@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Edit and save study plan items in course study plan - Failure

    Background:
        Given "school admin" logins CMS
        And school admin has created a new course without any location
        And school admin has created a content book
        And school admin has created a matched study plan with active and archived items

    #TCID:syl-0963,syl-0396
    Scenario Outline: User opens the course study plan details and "<action>" Display hidden items
        Given school admin is at the "master" study plan details page
        When school admin "<action>" Display hidden items
        And school admin edits the study plan content
        Then school admin sees the "<status>" study plan items with empty dates

        Examples:
            | action    | status              |
            | selects   | active and archived |
            | deselects | active              |

    #TCID:syl-0379
    Scenario: User enters dates that are out of range and saves
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin enters Start and Due dates that are out of Available From and Available Until range
        And school admin saves the editing study plan content process
        Then school admin sees the error messages of Start and Due fields

    #TCID:syl-0996
    Scenario Outline: User enters invalid dates and saves
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin enters "<field>" date that is later than "<otherField>"
        And school admin saves the editing study plan content process
        Then school admin sees the error messages of "<field>" and "<otherField>"

        Examples:
            | field          | otherField      |
            | Available From | Available Until |
            | Start Date     | Due Date        |

    #TCID:syl-0996
    Scenario Outline: User enters invalid values and saves
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin enters "<valueType>" into the date fields
        And school admin saves the editing study plan content process
        Then school admin sees the error messages of each field

        Examples:
            | valueType          |
            | text               |
            | incorrect format   |
            | special characters |
