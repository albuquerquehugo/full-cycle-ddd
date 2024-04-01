import { Sequelize } from 'sequelize-typescript';
import Address from '../../domain/entity/address';
import Customer from '../../domain/entity/customer';
import CustomerModel from '../db/sequelize/model/customer.model';
import CustomerRepository from './customer.repository';
import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/order_item';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import OrderRepository from './order.repository';
import Product from '../../domain/entity/product';
import ProductModel from '../db/sequelize/model/product.model';
import ProductRepository from './product.repository';

describe('Order repository tests', () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		});

		sequelize.addModels([
			CustomerModel,
			OrderModel,
			OrderItemModel,
			ProductModel,
		]);
		await sequelize.sync();
	});

	afterEach(async () => {
		await sequelize.close();
	});

	it('should create a new order', async () => {
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository();
		customerRepository.create(customer);

		const product = new Product('p1', 'Product 1', 10);
		const productRepository = new ProductRepository();
		productRepository.create(product);

		const orderItem = new OrderItem(
			'oi1',
			product.id,
			product.name,
			product.price,
			2
		);
		const order = new Order('o1', customer.id, [orderItem]);
		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: order.id,
			customer_id: order.customerId,
			items: [
				{
					id: orderItem.id,
					product_id: orderItem.productId,
					order_id: order.id,
					name: orderItem.name,
					price: orderItem.price,
					quantity: orderItem.quantity,
				},
			],
			total: order.total(),
		});
	});

	it('should update an order by adding an item', async () => {
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository();
		customerRepository.create(customer);

		const product1 = new Product('p1', 'Product 1', 10);
		const product2 = new Product('p2', 'Product 2', 20);
		const productRepository = new ProductRepository();
		productRepository.create(product1);
		productRepository.create(product2);

		const orderItem1 = new OrderItem(
			'oi1',
			product1.id,
			product1.name,
			product1.price,
			1
		);
		const order = new Order('o1', customer.id, [orderItem1]);
		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		const orderItem2 = new OrderItem(
			'oi2',
			product2.id,
			product2.name,
			product2.price,
			1
		);
		order.addItem(orderItem2);
		await orderRepository.update(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: order.id,
			customer_id: order.customerId,
			items: [
				{
					id: orderItem1.id,
					product_id: orderItem1.productId,
					order_id: order.id,
					name: orderItem1.name,
					price: orderItem1.price,
					quantity: orderItem1.quantity,
				},
				{
					id: orderItem2.id,
					product_id: orderItem2.productId,
					order_id: order.id,
					name: orderItem2.name,
					price: orderItem2.price,
					quantity: orderItem2.quantity,
				},
			],
			total: order.total(),
		});
	});

	it('should update an order by updating an item', async () => {
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository();
		customerRepository.create(customer);

		const product1 = new Product('p1', 'Product 1', 10);
		const product2 = new Product('p2', 'Product 2', 20);
		const productRepository = new ProductRepository();
		productRepository.create(product1);
		productRepository.create(product2);

		const orderItem = new OrderItem(
			'oi1',
			product1.id,
			product1.name,
			product1.price,
			1
		);
		const order = new Order('o1', customer.id, [orderItem]);
		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		const newOrderItem = new OrderItem(
			'oi1',
			product2.id,
			product2.name,
			product2.price,
			1
		);
		order.updateItem(newOrderItem);
		await orderRepository.update(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: order.id,
			customer_id: order.customerId,
			items: [
				{
					id: newOrderItem.id,
					product_id: newOrderItem.productId,
					order_id: order.id,
					name: newOrderItem.name,
					price: newOrderItem.price,
					quantity: newOrderItem.quantity,
				}
			],
			total: order.total(),
		});
	});

	it('should update an order by removing an item', async () => {
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository();
		customerRepository.create(customer);

		const product1 = new Product('p1', 'Product 1', 10);
		const product2 = new Product('p2', 'Product 2', 20);
		const productRepository = new ProductRepository();
		productRepository.create(product1);
		productRepository.create(product2);

		const orderItem1 = new OrderItem(
			'oi1',
			product1.id,
			product1.name,
			product1.price,
			1
		);
		const orderItem2 = new OrderItem(
			'oi2',
			product2.id,
			product2.name,
			product2.price,
			1
		);

		const order = new Order('o1', customer.id, [orderItem1, orderItem2]);
		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		order.removeItem(orderItem1.id);
		await orderRepository.update(order);

		const orderModel = await OrderModel.findOne({
			where: { id: order.id },
			include: ['items'],
		});

		expect(orderModel.toJSON()).toStrictEqual({
			id: order.id,
			customer_id: order.customerId,
			items: [
				{
					id: orderItem2.id,
					product_id: orderItem2.productId,
					order_id: order.id,
					name: orderItem2.name,
					price: orderItem2.price,
					quantity: orderItem2.quantity,
				},
			],
			total: order.total(),
		});
	});

	it('should find an order', async () => {
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository();
		customerRepository.create(customer);

		const product1 = new Product('p1', 'Product 1', 10);
		const product2 = new Product('p2', 'Product 2', 20);
		const productRepository = new ProductRepository();
		productRepository.create(product1);
		productRepository.create(product2);

		const orderItem1 = new OrderItem(
			'oi1',
			product1.id,
			product1.name,
			product1.price,
			1
		);
		const orderItem2 = new OrderItem(
			'oi2',
			product2.id,
			product2.name,
			product2.price,
			2
		);
		const order = new Order('o1', customer.id, [orderItem1, orderItem2]);

		const orderRepository = new OrderRepository();
		await orderRepository.create(order);

		const orderResult = await orderRepository.find(order.id);

		expect(orderResult).toStrictEqual(order);
	});

	it('should find all orders', async () => {
		let customer = new Customer('c1', 'Customer 1');
		const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
		customer.changeAddress(address);
		const customerRepository = new CustomerRepository();
		customerRepository.create(customer);

		const product1 = new Product('p1', 'Product 1', 10);
		const product2 = new Product('p2', 'Product 2', 20);
		const product3 = new Product('p3', 'Product 3', 30);
		const product4 = new Product('p4', 'Product 4', 40);
		const productRepository = new ProductRepository();
		productRepository.create(product1);
		productRepository.create(product2);
		productRepository.create(product3);
		productRepository.create(product4);

		const orderItem1 = new OrderItem(
			'oi1',
			product1.id,
			product1.name,
			product1.price,
			1
		);
		const orderItem2 = new OrderItem(
			'oi2',
			product2.id,
			product2.name,
			product2.price,
			1
		);
		const orderItem3 = new OrderItem(
			'oi3',
			product3.id,
			product3.name,
			product3.price,
			1
		);
		const orderItem4 = new OrderItem(
			'oi4',
			product4.id,
			product4.name,
			product4.price,
			1
		);
		const order1 = new Order('o1', customer.id, [orderItem1, orderItem2]);
		const order2 = new Order('o2', customer.id, [orderItem3, orderItem4]);
		const orderRepository = new OrderRepository();
		await orderRepository.create(order1);
		await orderRepository.create(order2);

		const orderResult = await orderRepository.findAll();

		expect(orderResult).toStrictEqual([order1, order2]);
	});
});
