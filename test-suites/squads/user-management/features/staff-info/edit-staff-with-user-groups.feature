@cms @user @staff-info

Feature: Edit staff with user groups

    Background:
        Given "school admin" logins CMS
        And school admin selects all locations on location setting
        And school admin has created "5" user groups with granted permission
        And school admin has created a new staff with "2" user groups

    Scenario Outline: Able to remove <number> user groups
        When school admin removes <number> user group by using X button on "<option>"
        Then school admin "<observe>" remaining user group displays on Staff Details
        And school admin "<observe>" remaining user group displays on Staff Management
        Examples:
            | number | observe      | option           |
            | 1      | sees         | chip             |
            | 2      | does not see | user group field |

    Scenario Outline: Able to add <number> user groups
        When school admin adds <number> user groups
        Then school admin sees newly added user groups displays along with existing ones on Staff Details
        And school admin sees newly added user groups displays along with existing ones on Staff Management
        Examples:
            | number |
            | 1      |
            | 3      |
