import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

describe('TicketService', () => {
  let paymentServiceMock;
  let seatReservationServiceMock;
  let ticketService;
  const accountId = 1001;

  beforeEach(() => {
    paymentServiceMock = {
      makePayment: jest.fn()
    };
    seatReservationServiceMock = {
      reserveSeats: jest.fn()
    };
    ticketService = new TicketService(paymentServiceMock, seatReservationServiceMock);
  });

  describe('purchaseTickets', () => {
    test('should throw an error for invalid ticket purchase requests', () => {
      
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('ADULT', 10))).not.toThrowError('');

      expect(() => ticketService.purchaseTickets(0, new TicketTypeRequest('ADULT', 10))).toThrowError("Invalid ticket purchase request. Account Id should be a number greater than zero.");
      expect(() => ticketService.purchaseTickets("INVALID-ID", new TicketTypeRequest('ADULT', 10))).toThrowError("Invalid ticket purchase request. Account Id should be a number greater than zero.");
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('XYZ-invalid', 10))).toThrowError("type must be ADULT, CHILD, or INFANT");
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('ADULT', '2289-invalid'))).toThrowError("noOfTickets must be an integer");
      
      expect(() => ticketService.purchaseTickets(accountId)).toThrowError('Invalid ticket purchase request. Please ensure that you are purchasing between 1 and 20 tickets.');
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('ADULT', 0))).toThrowError('Invalid ticket purchase request. Please ensure that you are purchasing between 1 and 20 tickets.');
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('ADULT', 10), new TicketTypeRequest('ADULT', 11))).toThrowError('Invalid ticket purchase request. Please ensure that you are purchasing between 1 and 20 tickets.');
    });

    test('should throw an error if Adult ticket is not included when purchasing Child or Infant tickets', () => {
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('INFANT', 1))).toThrowError('Invalid ticket purchase request. At least one Adult ticket request should be present.');
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('INFANT', 1), new TicketTypeRequest('INFANT', 1))).toThrowError('Invalid ticket purchase request. At least one Adult ticket request should be present.');
      
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('CHILD', 1))).toThrowError('Invalid ticket purchase request. At least one Adult ticket request should be present.');
      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('CHILD', 1), new TicketTypeRequest('CHILD', 1))).toThrowError('Invalid ticket purchase request. At least one Adult ticket request should be present.');

      expect(() => ticketService.purchaseTickets(accountId, new TicketTypeRequest('INFANT', 1), new TicketTypeRequest('CHILD', 1))).toThrowError('Invalid ticket purchase request. At least one Adult ticket request should be present.');
    });  

  });

 const successPurchaseCases = [
  ["2 Adult", [new TicketTypeRequest('ADULT', 2)], 40, 2 ],
  ["2 Adult", [new TicketTypeRequest('ADULT', 1), new TicketTypeRequest('ADULT', 1)], 40, 2 ],
  ["1 Adult + 1 Child",[new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 2)], 60 , 4],
  ["1 Adult + 1 Child + 1 Infant",[new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 1), new TicketTypeRequest('INFANT', 1)], 50 , 3],
  ["1 Adult + 2 Child + 1 Infant",[new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('CHILD', 1),  new TicketTypeRequest('CHILD', 1), new TicketTypeRequest('INFANT', 1)], 60 , 4],
  ["1 Adult + 1 Infant",[new TicketTypeRequest('ADULT', 2), new TicketTypeRequest('INFANT', 2)], 40 , 2]
 ]; 
 describe('purchaseTickets: should calculate the correct amount, make payment and reserve seats', () => {
  test.each(successPurchaseCases)("Case %p",(caseName, request, totalAmount, totalTicketCount) => {
    const accountId = accountId;
    paymentServiceMock.makePayment.mockReturnValueOnce();
    seatReservationServiceMock.reserveSeats.mockReturnValueOnce();

    ticketService.purchaseTickets(accountId, ...request);
    expect(paymentServiceMock.makePayment).toHaveBeenCalledWith(accountId, totalAmount);
    expect(seatReservationServiceMock.reserveSeats).toHaveBeenCalledWith(accountId, totalTicketCount);
    }
  );

 });

});

