@cms
@user @student-school-history

Feature: Add School History Student

    Background:
        Given "school admin" logins CMS
        And the master has data of "School Level & School & School Course" correctly
        And school admin is adding student with all required fields in General Info

    Scenario Outline: Add School History "<conditions>"
        When school admin adds School History "<conditions>"
        And school admin clicks save a student "<results>" with "<messages>" on the "<positions>"
        Then school admin "<expectedResult>" school history of the student displayed
        Examples:
            | conditions              | expectedResult | results        | messages                                 | positions    |
            | without required fields | does not see   | unsuccessfully | Required fields cannot be blank!         | student form |
            | without optional fields | sees           | successfully   | You have added the student successfully! | snackbar     |