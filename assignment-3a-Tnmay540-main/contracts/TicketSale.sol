// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TicketSale {
    uint16 public numTickets;
    uint256 public basePrice;
    address public owner;
    struct Offer {
        address offerer;
        uint256 price;
        uint16 id;
    }
    struct Ticket {
        address buyer;
        bool is_bought;
        uint16 ticketId;

    }
    
    Offer public offer;
    mapping(address => Ticket) persons;
    uint16 num_of_sold = 0;
    
    constructor(uint16 _numTickets, uint256 _basePrice){
        owner = msg.sender;
        numTickets =_numTickets;
        basePrice = _basePrice;
        


    }

    function validate(address person) public view returns (bool a) {
        if (persons[person].ticketId ==0){
            return false;
        }
        else return true;
    }
        
uint public total_rec;
uint16 private j =0;
    function buyTicket() public payable {
        
        total_rec+= msg.value;
        require(
                num_of_sold < numTickets,
                "No Tickets left!"
        );
        require(
             total_rec == basePrice,
            "Pay equal to the base price!"
        );
        require(
            validate(msg.sender) == false,
            "You already have a ticket!"
        );
        
        j++;
        persons[msg.sender].ticketId = j;
        persons[msg.sender].is_bought = true;
        persons[msg.sender].buyer= msg.sender;
        total_rec -=msg.value;
        num_of_sold+=1;
        
    }

    function getTicketOf(address person) public view returns (uint16) {
        require(
            persons[person].ticketId != 0,
            "The person does not have any ticket"
        );
        return  persons[person].ticketId;
    }

    function submitOffer(uint16 ticketId, uint256 price) public  {
        require(
            persons[msg.sender].is_bought == true,
            "You do not own any ticket!"
        );
        require(
           persons[msg.sender].ticketId == ticketId,
        "Wrong ticket Id!"
        );
        require(
            offer.id == 0,
            "There is already an offer running!" 
        );
        require(
                price >=(80*basePrice)/100,
                "Offer too Low!"
        );
        require(
                price<=(120*basePrice)/100,
                "Offer too High!"
        );
        
        offer = Offer(msg.sender, price, ticketId);

    }
    function acceptOffer(uint16 ticketId) public payable {
        total_rec+= msg.value;
        require(
            offer.id != 0,
            "No offers available!"
        );
        require(
            offer.id == ticketId,
            "The ticket is not under offer!"
        );
        require(
            persons[msg.sender].ticketId == 0,
           "You already have a ticket!"
        );
        require(
            total_rec == offer.price,
            "Pay the valid price offered!"
        );
        persons[offer.offerer].ticketId = 0;
        persons[offer.offerer].is_bought = false;
        persons[offer.offerer].buyer = address(0);
        total_rec -= msg.value;
        persons[msg.sender].ticketId = offer.id;
        persons[msg.sender].is_bought = true;
        persons[msg.sender].buyer = msg.sender;
        offer.id = 0;
        offer.price = 0;

    }
    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can withdraw!");

        _;
    }
    function withdraw() public payable onlyOwner {
       address payable addres_ow =payable (msg.sender);
       addres_ow.transfer(address(this).balance);
    
    }
}