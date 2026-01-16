package com.ecommerce.order.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QOrder is a Querydsl query type for Order
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QOrder extends EntityPathBase<Order> {

    private static final long serialVersionUID = -145521697L;

    public static final QOrder order = new QOrder("order1");

    public final com.ecommerce.shared.domain.QAggregateRoot _super = new com.ecommerce.shared.domain.QAggregateRoot(this);

    public final DateTimePath<java.time.LocalDateTime> cancelledAt = createDateTime("cancelledAt", java.time.LocalDateTime.class);

    public final StringPath cancelReason = createString("cancelReason");

    public final DateTimePath<java.time.LocalDateTime> completedAt = createDateTime("completedAt", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<Long> customerId = createNumber("customerId", Long.class);

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final ListPath<OrderItem, QOrderItem> items = this.<OrderItem, QOrderItem>createList("items", OrderItem.class, QOrderItem.class, PathInits.DIRECT2);

    public final StringPath orderNumber = createString("orderNumber");

    public final EnumPath<OrderStatus> orderStatus = createEnum("orderStatus", OrderStatus.class);

    public final NumberPath<Long> paymentId = createNumber("paymentId", Long.class);

    public final StringPath recipientName = createString("recipientName");

    public final StringPath recipientPhone = createString("recipientPhone");

    public final StringPath shippingAddress = createString("shippingAddress");

    public final StringPath shippingAddressDetail = createString("shippingAddressDetail");

    public final StringPath shippingMemo = createString("shippingMemo");

    public final StringPath shippingPostalCode = createString("shippingPostalCode");

    public final NumberPath<java.math.BigDecimal> totalAmount = createNumber("totalAmount", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QOrder(String variable) {
        super(Order.class, forVariable(variable));
    }

    public QOrder(Path<? extends Order> path) {
        super(path.getType(), path.getMetadata());
    }

    public QOrder(PathMetadata metadata) {
        super(Order.class, metadata);
    }

}

