package com.ecommerce.payment.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QPayment is a Querydsl query type for Payment
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPayment extends EntityPathBase<Payment> {

    private static final long serialVersionUID = 407013855L;

    public static final QPayment payment = new QPayment("payment");

    public final com.ecommerce.shared.domain.QAggregateRoot _super = new com.ecommerce.shared.domain.QAggregateRoot(this);

    public final NumberPath<java.math.BigDecimal> amount = createNumber("amount", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> cancelledAt = createDateTime("cancelledAt", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> completedAt = createDateTime("completedAt", java.time.LocalDateTime.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final StringPath failedReason = createString("failedReason");

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final NumberPath<Long> orderId = createNumber("orderId", Long.class);

    public final StringPath paymentKey = createString("paymentKey");

    public final EnumPath<PaymentMethod> paymentMethod = createEnum("paymentMethod", PaymentMethod.class);

    public final EnumPath<PaymentStatus> paymentStatus = createEnum("paymentStatus", PaymentStatus.class);

    public final StringPath pgProvider = createString("pgProvider");

    public final StringPath pgTransactionId = createString("pgTransactionId");

    public final NumberPath<java.math.BigDecimal> refundAmount = createNumber("refundAmount", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> refundedAt = createDateTime("refundedAt", java.time.LocalDateTime.class);

    public final StringPath refundReason = createString("refundReason");

    public final StringPath transactionId = createString("transactionId");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QPayment(String variable) {
        super(Payment.class, forVariable(variable));
    }

    public QPayment(Path<? extends Payment> path) {
        super(path.getType(), path.getMetadata());
    }

    public QPayment(PathMetadata metadata) {
        super(Payment.class, metadata);
    }

}

