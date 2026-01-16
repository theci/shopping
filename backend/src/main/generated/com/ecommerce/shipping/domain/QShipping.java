package com.ecommerce.shipping.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QShipping is a Querydsl query type for Shipping
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QShipping extends EntityPathBase<Shipping> {

    private static final long serialVersionUID = -1732608269L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QShipping shipping = new QShipping("shipping");

    public final com.ecommerce.shared.domain.QAggregateRoot _super = new com.ecommerce.shared.domain.QAggregateRoot(this);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DateTimePath<java.time.LocalDateTime> deliveredAt = createDateTime("deliveredAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> estimatedDeliveryDate = createDateTime("estimatedDeliveryDate", java.time.LocalDateTime.class);

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final NumberPath<Long> orderId = createNumber("orderId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> pickedUpAt = createDateTime("pickedUpAt", java.time.LocalDateTime.class);

    public final QShippingAddress shippingAddress;

    public final StringPath shippingCompany = createString("shippingCompany");

    public final StringPath shippingMemo = createString("shippingMemo");

    public final EnumPath<ShippingStatus> shippingStatus = createEnum("shippingStatus", ShippingStatus.class);

    public final DateTimePath<java.time.LocalDateTime> startedAt = createDateTime("startedAt", java.time.LocalDateTime.class);

    public final StringPath trackingNumber = createString("trackingNumber");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QShipping(String variable) {
        this(Shipping.class, forVariable(variable), INITS);
    }

    public QShipping(Path<? extends Shipping> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QShipping(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QShipping(PathMetadata metadata, PathInits inits) {
        this(Shipping.class, metadata, inits);
    }

    public QShipping(Class<? extends Shipping> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.shippingAddress = inits.isInitialized("shippingAddress") ? new QShippingAddress(forProperty("shippingAddress")) : null;
    }

}

