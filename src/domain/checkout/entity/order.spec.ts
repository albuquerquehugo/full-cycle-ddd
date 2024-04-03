import Order from './order';
import OrderItem from './order_item';

describe('Order unit tests', () => {
	it('should throw error when id is empty', () => {
		expect(() => {
			let order = new Order('', '123', []);
		}).toThrow('Id is required');
	});

	it('should throw error when customerId is empty', () => {
		expect(() => {
			let order = new Order('123', '', []);
		}).toThrow('CustomerId is required');
	});

	it('should throw error when items list is empty', () => {
		expect(() => {
			let order = new Order('123', '123', []);
		}).toThrow('Items are required');
	});

	it('should calculate total', () => {
		const item1 = new OrderItem('i1', 'p1', 'Item 1', 100, 2);
		const order1 = new Order('o1', 'c1', [item1]);
		let total = order1.total();
		expect(total).toBe(200);

		const item2 = new OrderItem('i2', 'p2', 'Item 2', 200, 2);
		const order2 = new Order('o2', 'c1', [item1, item2]);
		total = order2.total();
		expect(total).toBe(600);
	});

	it('should thrown error when item id is empty', () => {
		expect(() => {
			const item = new OrderItem('', 'p1', 'Item 1', 100, 1);
		}).toThrow('Id is required');
	});

	it('should throw error when item name is empty', () => {
		expect(() => {
			const item = new OrderItem('i1', 'p1', '', 100, 1);
		}).toThrow('Name is required');
	});

	it('should throw error when item price is less or equal to zero', () => {
		expect(() => {
			const item = new OrderItem('i1', 'p1', 'Item 1', -1, 1);
		}).toThrow('Price must be greater than zero');

		expect(() => {
			const item = new OrderItem('i1', 'p1', 'Item 1', 0, 1);
		}).toThrow('Price must be greater than zero');
	});

	it('should throw error when item productId is empty', () => {
		expect(() => {
			const item = new OrderItem('i1', '', 'Item 1', 100, 1);
		}).toThrow('ProductId is required');
	});

	it('should throw error when item quantity is less or equal to zero', () => {
		expect(() => {
			const item = new OrderItem('i2', 'p1', 'Item 2', 100, -1);
		}).toThrow('Quantity must be greater than zero');

		expect(() => {
			const item = new OrderItem('i1', 'p1', 'Item 1', 100, 0);
		}).toThrow('Quantity must be greater than zero');
	});
});
