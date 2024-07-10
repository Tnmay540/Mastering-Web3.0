// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract TicketSale2 {
    uint16 public numTickets;
    uint256 public basePrice;
    address public owner;
    struct Offer {
        address offerer;
        uint256 price;
        uint16 id;
    }
    struct Offer_disp {
        uint256 price;
        uint16 id;
    }
    struct Ticket {
        address buyer;
        bool is_bought;
        uint16 ticketId;

    }
    uint256 public minPrice;
    uint16 public minTicketId;
    
    
    mapping(uint16 => Offer) public offers;
    mapping(address => Ticket) persons;
    uint16 num_of_sold = 0;
    uint16 num_offers = 0;
    
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
        Ticket memory cur_tic0 = persons[msg.sender];
        require(
            cur_tic0.is_bought == true,
            "You do not own any ticket!"
        );
        require(
            offers[cur_tic0.ticketId].id != ticketId,
            "There is already an offer running!"
        );
        require(
           cur_tic0.ticketId == ticketId,
        "Wrong ticket Id!"
        );

        require(
                price >=(80*basePrice)/100,
                "Offer too Low!"
        );
        require(
                price<=(120*basePrice)/100,
                "Offer too High!"
        );
        
        offers[cur_tic0.ticketId] = Offer(msg.sender, price, ticketId);
        if (minPrice == 0 || price < minPrice) {
        minPrice = price;
        minTicketId = ticketId;
        num_offers+=1;
    }

    }
    function acceptOffer(uint16 ticketId) public payable {
        total_rec+= msg.value;
        require(
            num_offers != 0,
            "No offers available!"
        );
        require(
            offers[ticketId].id == ticketId,
            "The ticket is not under offer!"
        );
        require(
            persons[msg.sender].ticketId == 0,
           "You already have a ticket!"
        );
        require(
            total_rec == offers[ticketId].price,
            "Pay the valid price offered!"
        );
        persons[msg.sender].ticketId = offers[ticketId].id;
        persons[msg.sender].is_bought = true;
        persons[msg.sender].buyer = msg.sender;
        persons[offers[ticketId].offerer].ticketId = 0;
        persons[offers[ticketId].offerer].is_bought = false;
        persons[offers[ticketId].offerer].buyer = address(0);
        total_rec -= msg.value;
        offers[ticketId].id = 0;
        offers[ticketId].price = 0;
        if (ticketId == minTicketId) {
        minPrice = 0;
        minTicketId = 0;
        num_offers -=1;
    }

    }
    function getAllOffers() public view returns (Offer_disp[] memory) {
    Offer_disp[] memory allOffers = new Offer_disp[](numTickets);
    uint16 counter = 0;
    for (uint16 i = 1; i <= numTickets; i++) {
        if (offers[i].id != 0) {
            allOffers[counter] = Offer_disp(offers[i].price, offers[i].id);
            counter++;
        }
    }
        return allOffers;
    }

function getMinOffer() public view returns (Offer memory) {
    require(minPrice > 0 && minTicketId > 0, "No offer with minimum price");
    return offers[minTicketId];
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