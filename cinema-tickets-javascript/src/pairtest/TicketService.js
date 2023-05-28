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


  constructor(paymentService, seatReservationService){
    this.paymentService = paymentService;
    this.seatReservationService = seatReservationService;    
  } 

}
