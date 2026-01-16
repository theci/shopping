package com.ecommerce.shipping.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QShippingAddress is a Querydsl query type for ShippingAddress
 */
@Generated("com.querydsl.codegen.DefaultEmbeddableSerializer")
public class QShippingAddress extends BeanPath<ShippingAddress> {

    private static final long serialVersionUID = -1884713599L;

    public static final QShippingAddress shippingAddress = new QShippingAddress("shippingAddress");

    public final StringPath address = createString("address");

    public final StringPath addressDetail = createString("addressDetail");

    public final StringPath postalCode = createString("postalCode");

    public final StringPath recipientName = createString("recipientName");

    public final StringPath recipientPhone = createString("recipientPhone");

    public QShippingAddress(String variable) {
        super(ShippingAddress.class, forVariable(variable));
    }

    public QShippingAddress(Path<? extends ShippingAddress> path) {
        super(path.getType(), path.getMetadata());
    }

    public QShippingAddress(PathMetadata metadata) {
        super(ShippingAddress.class, metadata);
    }

}

