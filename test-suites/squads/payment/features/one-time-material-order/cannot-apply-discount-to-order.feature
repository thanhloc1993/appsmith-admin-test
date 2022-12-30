@cms
@payment
@one-time-material-order
@ignore

Feature: Cannot apply discount to order

    Background:
        Given "school admin" logins CMS
        And school admin has created a student with student info

    Scenario Outline: Cannot apply <typeOfDiscount> to order
        Given "school admin" has created one-time material with price
        And "school admin" has added the same location and grade with student for "one-time material"
        And "school admin" has created "<typeOfDiscount>" with "<date>" and "<archivedValue>"
        When "school admin" creates order for created student
        And "school admin" selects "one-time material" for order
        And "school admin" selects "<typeOfDiscount>" for "one-time material"
        Then "school admin" sees "<typeOfDiscount>" does not available
        Examples:
            | typeOfDiscount    | date                                            | archivedValue |
            | expired discount  | available from and until < current date         | is false      |
            | future discount   | available from and until > current date         | is false      |
            | archived discount | available from < current date < available until | is true       |
            