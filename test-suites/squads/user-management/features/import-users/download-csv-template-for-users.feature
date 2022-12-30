@cms @user
Feature: Download a CSV file

    Background:
        Given "school admin" logins CMS
        And school admin is on Student Management page

    Scenario Outline: Able to download csv template
        When school admin proceeds to import "<user>"
        And school admin downloads template file
        Then school admin sees the csv template file is downloaded automatically

        Examples:
            | user    |
            | Parents |
