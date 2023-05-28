# Cinema Tickets Booking

Cinema Tickets Booking is a sample Javascript project for booking cinema tickets.

## Features

* Validate booking request :
    * All accounts with an id greater than zero are valid
    * Only a maximum of 20 tickets that can be purchased at a time
    * Child and Infant tickets cannot be purchased without purchasing an Adult ticket
    * Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap
* Calculate total booking fee & required seats
* Send seat reservation request to Reservation Service
* Send payment request to Payment Service


## Run Tests

```console
$ # Install require packages
$ npm i
$ # Run Jest tests
$ npm run test