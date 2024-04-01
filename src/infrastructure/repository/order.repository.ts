import Order from '../../domain/entity/order';
import OrderItem from '../../domain/entity/order_item';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';

export default class OrderRepository implements OrderRepositoryInterface {
	async create(entity: Order): Promise<void> {
		await OrderModel.create(
			{
				id: entity.id,
				customer_id: entity.customerId,
				items: entity.items.map((item) => ({
					id: item.id,
					product_id: item.productId,
					name: item.name,
					price: item.price,
					quantity: item.quantity,
				})),
				total: entity.total(),
			},
			{
				include: [{ model: OrderItemModel }],
			}
		);
	}

	async update(entity: Order): Promise<void> {
		await OrderModel.sequelize.transaction(async (t) => {
			// First you need to clear the items array to then add the new ones
			await OrderItemModel.destroy({
				where: { order_id: entity.id },
				transaction: t,
			});

			const orderItems = entity.items.map((item) => ({
				id: item.id,
				order_id: entity.id,
				product_id: item.productId,
				name: item.name,
				price: item.price,
				quantity: item.quantity,
			}));

			await OrderItemModel.bulkCreate(orderItems, {
				transaction: t,
			});

			await OrderModel.update(
				{
					total: entity.total(),
				},
				{
					where: { id: entity.id },
					transaction: t,
				}
			);
		});
	}

	async find(id: string): Promise<Order> {
		let orderModel;
		try {
			orderModel = await OrderModel.findOne({
				where: { id: id },
				rejectOnEmpty: true,
				include: ['items'],
			});
		} catch (error) {
			throw new Error('Order not found');
		}
		const order = new Order(
			id,
			orderModel.customer_id,
			orderModel.items.map(
				(item) =>
					new OrderItem(
						item.id,
						item.product_id,
						item.name,
						item.price,
						item.quantity
					)
			)
		);
		return order;
	}

	async findAll(): Promise<Order[]> {
		const orderModels = await OrderModel.findAll({
			include: [{ model: OrderItemModel }],
		});

		return orderModels.map(
			(orderModel) =>
				new Order(
					orderModel.id,
					orderModel.customer_id,
					orderModel.items.map(
						(item) =>
							new OrderItem(
								item.id,
								item.product_id,
								item.name,
								item.price,
								item.quantity
							)
					)
				)
		);
	}
}
