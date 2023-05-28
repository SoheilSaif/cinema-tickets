import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */  

  // Get maximum number of ticket per purchase
  #getMaxTicketPerPurchase(){
    return 20;
  }
  
  // Get ticket price list
  #getTicketsPriceList(){
    return [
    {ticketType:"INFANT", price: 0},
    {ticketType:"CHILD", price: 10},
    {ticketType:"ADULT", price: 20},
  ]
 }


  // Validate account Id 
  #isAccountIdValid(accountId) {
    return typeof accountId === 'number' && accountId > 0;
  }

  constructor(paymentService, seatReservationService){
    this.paymentService = paymentService;
    this.seatReservationService = seatReservationService;    
  } 

  /**
 * Purchase ticket for customer
 * @param {number} accountId The customer account Id.
 * @param {TicketTypeRequest} ...ticketTypeRequests The ticket purchase requests.
 */
  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException

    if (!this.#isAccountIdValid(accountId)){
      throw new InvalidPurchaseException("Invalid ticket purchase request. Account Id should be a number greater than zero.");
    }

     // Check if ticket purchase request items count is in the valid range
     let totalTickets = ticketTypeRequests.reduce((sum, request)=> sum + request.getNoOfTickets(), 0);  
     if(totalTickets === 0 || totalTickets > this.#getMaxTicketPerPurchase()){
       throw new InvalidPurchaseException( `Invalid ticket purchase request. Please ensure that you are purchasing between 1 and ${this.#getMaxTicketPerPurchase()} tickets.`);
     }
    
     
    // Check if at least one Adult ticket request should be present.
    const existsAdultTicketRequest = ticketTypeRequests.some((request)=> request.getTicketType() === 'ADULT');
    if(!existsAdultTicketRequest){
      throw new InvalidPurchaseException( `Invalid ticket purchase request. At least one Adult ticket request should be present.`);
    }   

    // Calculate total order amount and total seat number
    let totalOrderAmount = 0;
    let totalSeats = 0;  

    ticketTypeRequests.forEach(request => {        
      // Calculate total order amount
      var item = this.#getTicketsPriceList().find(item=>item.ticketType === request.getTicketType());
      totalOrderAmount +=  item.price * request.getNoOfTickets();

      // Do not include infants in seat reservation
      if (request.getTicketType() !== 'INFANT') {
        totalSeats += request.getNoOfTickets();      
      }
    });

    this.seatReservationService.reserveSeats(accountId, totalSeats); 
    this.paymentService.makePayment(accountId, totalOrderAmount);
  }
}
