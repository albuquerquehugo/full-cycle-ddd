import { Sequelize } from 'sequelize-typescript';
import Address from '../../domain/entity/address';
import CustomerModel from '../db/sequelize/model/customer.model';
import Customer from '../../domain/entity/customer';
import CustomerRepository from './customer.repository';

describe('Customer repository tests', () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		});

		sequelize.addModels([CustomerModel]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it('should create a customer', async () => {
		const customerRepository = new CustomerRepository();
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
        
		await customerRepository.create(customer);
		const customerResult = await customerRepository.find('c1');

		expect(customerResult).toStrictEqual(customer);
	});

	it('should update a customer', async () => {
		const customerRepository = new CustomerRepository();
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
        
		await customerRepository.create(customer);
		let customerResult = await customerRepository.find('c1');

		expect(customer).toStrictEqual(customerResult);

		customer.changeName('Customer 2');
		await customerRepository.update(customer);
		const customerResultUpToDate = await customerRepository.find('c1');

		expect(customerResultUpToDate).toStrictEqual(customer);
	});

	it('should find a customer', async () => {
		const customerRepository = new CustomerRepository();
		const customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		customer.activate();
		customer.addRewardPoints(10);
		await customerRepository.create(customer);

		const customerResult = await customerRepository.find('c1');

		expect(customerResult).toStrictEqual(customer);
	});

	it('should throw error when customer is not found', async () => {
		const customerRepository = new CustomerRepository();
		expect(async () => {
			await customerRepository.find('c1');
		}).rejects.toThrow('Customer not found');
	});

	it('should find all customers', async () => {
		const customerRepository = new CustomerRepository();
		const customer1 = new Customer('c1', 'Customer 1');
		const address1 = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer1.changeAddress(address1);
		customer1.activate();
		customer1.addRewardPoints(10);
		await customerRepository.create(customer1);

		const customer2 = new Customer('c2', 'Customer 2');
		const address2 = new Address('Street 2', 2, 'Zipcode 2', 'City 2');
		customer2.changeAddress(address2);
		customer2.addRewardPoints(20);
		await customerRepository.create(customer2);

		const customers = await customerRepository.findAll();

		expect(customers).toHaveLength(2);
		expect(customers).toContainEqual(customer1);
		expect(customers).toContainEqual(customer2);
	});
});
