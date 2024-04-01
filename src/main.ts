import Address from "./domain/entity/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_item";

let customer = new Customer("123", "Hugo Albuquerque");
const address = new Address("Rua Um", 2, "12345-678", "Recife");
customer.changeAddress(address);
customer.activate();

const item1 = new OrderItem("1", "p1", "Item 1", 10, 2);
const item2 = new OrderItem("2", "p2", "Item 2", 15, 2);
const order = new Order("1", "123", [item1, item2]);