@cms
@cms-syllabus-integration
@syllabus @studyplan

Feature: [Integration] Edit and save study plan items in course study plan - Success

    Background:
        Given "school admin" logins CMS
        And school admin has created a new course without any location
        And school admin has created a content book
        And school admin has created a matched study plan with active and archived items

    #TCID:syl-0379
    Scenario Outline: User enters valid dates and saves
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin enters "<values>" into the fields with "<year>"
        And school admin saves the editing study plan content process
        Then school admin sees message "You have updated study plan content successfully"
        And school admin sees the values of the study plan items changed correctly
        And school admin sees the individual study plan items updated respectively

        Examples:
            | values        | year         |
            | date          | current year |
            | date and time | current year |
            | date          | another year |
            | date and time | another year |

    #TCID:syl-0379
    Scenario Outline: User only enters Start date and Due date is automatically filled
        Given school admin is at the "master" study plan details page
        When school admin edits the study plan content
        And school admin enters value into Start field with "<year>"
        And school admin saves the editing study plan content process
        Then school admin sees message "You have updated study plan content successfully"
        And school admin sees the Due date of the study plan items automatically filled with seven days from Start date
        And school admin sees the individual study plan items updated respectively

        Examples:
            | year         |
            | current year |
            | another year |
