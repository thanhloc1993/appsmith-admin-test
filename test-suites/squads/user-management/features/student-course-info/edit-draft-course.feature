@cms
@user @student-course
Feature: Edit Draft Course

    Background:
        Given "school admin" logins CMS

    Scenario Outline:  Select and delete draft courses
        Given school admin has created a student "student" with "0 parents", "<number> visible courses"
        And school admin adds "3" draft courses to popup
        And school admin can't delete any draft course
        When school admin "selects" "<amount>" "draft" course
        And school admin "deselects" "<amount>" "draft" course
        And school admin "re-selects" "<amount>" "draft" course
        And school admin deletes the selected course from popup
        Then school admin sees "<amount>" draft course deleted and "<number>" previous added course on popup
        Examples:
            | number | amount   |
            | 1      | one      |
            | 0      | one      |
            | 1      | multiple |
            | 0      | multiple |
            | 1      | all      |
            | 0      | all      |

    Scenario Outline: Can't delete previous added courses
        Given school admin has created a student "student" with "0 parents", "3 visible courses"
        And school admin adds "0" draft courses to popup
        When school admin "selects" "<amount>" "previous added" course
        Then school admin can't select previous added course
        Examples:
            | amount   |
            | one      |
            | multiple |
            | all      |
