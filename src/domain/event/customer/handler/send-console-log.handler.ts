import EventHandlerInterface from "../../@shared/event-handler.interface";

export default class SendConsoleLogHandler implements EventHandlerInterface {
    handle(event: any): void {
        const clientId = event.eventData.customerId;
        const clientName = event.eventData.customerName;
        const clientAddress = event.eventData.customerAddress;
        console.log(`Endereço do cliente: ${clientId}, ${clientName} alterado para: ${clientAddress.toString()}`);
    }
}