@cms
@payment
@one-time-material-order
@ignore

Feature: Cannot apply one-time material to order

    Background:
        Given "school admin" logins CMS

    Scenario Outline: Cannot apply <typeOfOneTimeMaterial> to order
        Given school admin has created a student with student info
        And "school admin" has created "<typeOfOneTimeMaterial>" with "<date>" and "<archivedValue>"
        And "school admin" has added the same location and grade with student for "one-time material"
        When "school admin" creates order for created student
        And "school admin" selects "<typeOfOneTimeMaterial>" for order
        Then school admin sees "<typeOfOneTimeMaterial>" does not available
        Examples:
            | typeOfOneTimeMaterial      | date                                            | archivedValue |
            | expired one-time material  | available from and until > current date         | is false      |
            | future one-time material   | available from and until < current date         | is false      |
            | archived one-time material | available from < current date < available until | is true       |

    Scenario Outline: Cannot apply one-time material which has different location and grade with student
        Given school admin has created a student with "location L1" and "grade G1"
        And "school admin" has created one-time material with "<location>" and "<grade>"
        When "school admin" creates order for created student
        And "school admin" selects "one-time material" for order
        Then school admin sees "one-time material" does not available
        Examples:
            | location    | grade    |
            | location L2 | grade G1 |
            | location L1 | grade G2 |

    Scenario Outline:Cannot submit the order after user updated one-time material's <value>
        Given school admin has created a student with student info
        And "school admin" has created one-time material
        And "school admin" has added the same location and grade with student for "one-time material"
        When "school admin" creates order for created student
        And "school admin" selects "one-time material" for order
        And "school admin" updates "<value>" of "one-time material"
        And "school admin" submits the order
        Then school admin sees error message "Billed at order is mis-match. Please refresh the page and try create order again!"
        Examples:
            | value    |
            | location |
            | grade    |
