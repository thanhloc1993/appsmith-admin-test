@cms
@payment
@student-billing
@ignore

Feature: Location, Billing No and Billing item in product list and billing history display correct for one-time material

  Background:
    Given "school admin" logins CMS
    And "school admin" has created a student with grade, course, multiple locations

  Scenario: The location, billing number and billing item display with correct data
    Given school admin has created one-time material with discount
      | location   | price | discount | tax | taxCategory            | discountAmountType          |
      | location 1 | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
      | location 2 | 100   | 10       | 10  | TAX_CATEGORY_INCLUSIVE | DISCOUNT_AMOUNT_TYPE_AMOUNT |
    When school admin creates New Order with One-time material for created student
    Then school admin sees message "You have created the order successfully!"
    And school admin goes to student billing tab
    And school admin sees data in product list display with correct data
    And school admin sees data in billing history display with correct data
