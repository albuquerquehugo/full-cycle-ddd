import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new Customer("", "Hugo")).toThrow("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => new Customer("123", "")).toThrow("Name is required");
    });
    
    it("should change name", () => {
        // Arrange
        const customer = new Customer("123", "John");
        // Act
        customer.changeName("Jane");
        // Assert
        expect(customer.name).toBe("Jane");
    });
    
    it("should activate customer", () => {
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Rua Um", 123, "12345-678", "Recife");
        customer.changeAddress(address);
        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        const customer = new Customer("1", "Customer 1");
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    })

    it("should throw error when address is undefined on activate", () => {
        expect(() => {
            const customer = new Customer("1", "Customer 1");
            customer.activate();
        }).toThrow("Address is mandatory to activate a costumer");
    })
});