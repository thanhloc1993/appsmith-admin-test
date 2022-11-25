@cms
@cms-syllabus-integration
@syllabus @assignment

Feature: [Integration] Delete assignment integration test

    Background:
        Given "school admin" logins CMS
        And school admin has created a "simple content with an assignment" book
        And school admin is at book detail page

    #TCID:syl-0036
    Scenario Outline: Can delete the assignment in the <place>
        Given school admin selects an assignment type "assignment" in "<place>" to delete
        When school admin "confirms" the deleting assignment process
        Then school admin sees message "You have deleted assignment successfully"
        And school admin does not see the deleted assignment in book

        Examples:
            | place  |
            | book   |
            | detail |

    #TCID:syl-0862
    Scenario Outline: Can't delete the assignment in the <place>
        Given school admin selects an assignment type "assignment" in "<place>" to delete
        When school admin "cancels" the deleting assignment process
        Then school admin still sees the assignment in "<place>"

        Examples:
            | place  |
            | book   |
            | detail |
