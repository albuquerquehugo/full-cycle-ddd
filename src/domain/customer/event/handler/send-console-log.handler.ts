import EventHandlerInterface from '../../../@shared/event/event-handler.interface';
import CustomerAddressChangedEvent from '../customer-address-changed.event';

export default class SendConsoleLogHandler
	implements EventHandlerInterface<CustomerAddressChangedEvent>
{
	handle(event: CustomerAddressChangedEvent): void {
		const clientId = event.eventData.customerId;
		const clientName = event.eventData.customerName;
		const clientAddress = event.eventData.customerAddress;
		console.log(
			`Endereço do cliente: ${clientId}, ${clientName} alterado para: ${clientAddress.toString()}`
		);
	}
}
