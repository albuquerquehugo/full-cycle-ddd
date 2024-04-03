import OrderItem from './order_item';

export default class Order {
	private _id: string;
	private _customerId: string;
	private _items: OrderItem[];
	private _total: number;

	constructor(id: string, customerId: string, items: OrderItem[]) {
		this._id = id;
		this._customerId = customerId;
		this._items = items;
		this._total = this.total();
		this.validate();
	}

	validate(): boolean {
		if (this._id.length === 0) {
			throw new Error('Id is required');
		}
		if (this._customerId.length === 0) {
			throw new Error('CustomerId is required');
		}
		if (this._items.length === 0) {
			throw new Error('Items are required');
		}
		return true;
	}

	get id(): string {
		return this._id;
	}
	get customerId(): string {
		return this._customerId;
	}
	get items(): OrderItem[] {
		return this._items;
	}

	addItem(item: OrderItem): void {
		this._items.push(item);
		this._total = this.total();
	}

	updateItem(item: OrderItem): void {
		const itemIndex = this._items.findIndex((i) => i.id === item.id);
		if (itemIndex >= 0) {
			this._items[itemIndex] = item;
			this._total = this.total();
		} else {
			throw new Error('Item not found');
		}
	}

	removeItem(itemId: string): void {
		const itemIndex = this._items.findIndex((i) => i.id === itemId);
		if (itemIndex >= 0) {
			this._items.splice(itemIndex, 1);
			this._total = this.total();
		} else {
			throw new Error('Item not found');
		}
	}

	total(): number {
		return this._items.reduce(
			(acc, item) => acc + item.orderItemTotal(),
			0
		);
	}
}
