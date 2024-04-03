import Address from '../../entity/address';
import Customer from '../../entity/customer';
import EventDispatcher from '../@shared/event-dispatcher';
import CustomerAddressChangedEvent from './customer-address-changed.event';
import CustomerCreatedEvent from './customer-created.event';
import SendConsoleLogHandler from './handler/send-console-log.handler';
import SendConsoleLog1Handler from './handler/send-console-log1.handler';
import SendConsoleLog2Handler from './handler/send-console-log2.handler';

describe('Customer event tests', () => {
	it('should send console logs when customer is created', () => {
		const eventDispatcher = new EventDispatcher();
		const firstLogEventHandler = new SendConsoleLog1Handler();
		const secondLogEventHandler = new SendConsoleLog2Handler();
		eventDispatcher.register('CustomerCreatedEvent', firstLogEventHandler);
		eventDispatcher.register('CustomerCreatedEvent', secondLogEventHandler);

		const spyFirstLogEventHandler = jest.spyOn(
			firstLogEventHandler,
			'handle'
		);
		const spySecondLogEventHandler = jest.spyOn(
			secondLogEventHandler,
			'handle'
		);

        const customerCreatedEvent = new CustomerCreatedEvent({});
		eventDispatcher.notify(customerCreatedEvent);

		expect(
			eventDispatcher.eventHandlers['CustomerCreatedEvent'].length
		).toBe(2);
		expect(
			eventDispatcher.eventHandlers['CustomerCreatedEvent'][0]
		).toMatchObject(firstLogEventHandler);
		expect(
			eventDispatcher.eventHandlers['CustomerCreatedEvent'][1]
		).toMatchObject(secondLogEventHandler);
		expect(spyFirstLogEventHandler).toHaveBeenCalled();
		expect(spySecondLogEventHandler).toHaveBeenCalled();
	});

	it('should send a console log when customer address is changed', () => {
		const eventDispatcher = new EventDispatcher();
		const addressChangedEventHandler = new SendConsoleLogHandler();
		eventDispatcher.register(
			'CustomerAddressChangedEvent',
			addressChangedEventHandler
		);

		const addressChangedSpyEventHandler = jest.spyOn(
			addressChangedEventHandler,
			'handle'
		);

		const customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 123, '12345-678', 'São Paulo');
		customer.changeAddress(address);

		const customerAddressChangedEvent = new CustomerAddressChangedEvent({
			customerId: customer.id,
			customerName: customer.name,
			customerAddress: customer.address,
		});
		eventDispatcher.notify(customerAddressChangedEvent);

		expect(
			eventDispatcher.eventHandlers['CustomerAddressChangedEvent'].length
		).toBe(1);
		expect(
			eventDispatcher.eventHandlers['CustomerAddressChangedEvent'][0]
		).toMatchObject(addressChangedEventHandler);
		expect(addressChangedSpyEventHandler).toHaveBeenCalled();
	});
});
