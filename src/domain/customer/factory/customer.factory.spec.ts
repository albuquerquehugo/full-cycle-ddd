import Address from '../value-object/address';
import CustomerFactory from './customer.factory';

describe('Customer factory unit tests', () => {
	it('should create a customer', () => {
		const customer = CustomerFactory.create('John');

		expect(customer.id).toBeDefined();
		expect(customer.name).toBe('John');
		expect(customer.address).toBeUndefined();
	});

	it('should create a customer with an address', () => {
        const address = new Address('Street 1', 123, '12345-678', 'São Paulo');
		const customer = CustomerFactory.createWithAddress('John', address);
		
		expect(customer.id).toBeDefined();
		expect(customer.name).toBe('John');
		expect(customer.address).toBe(address);
	});
});
