const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require("express");
const prisma = require("./../prisma/prismaClientExport");

//stripe webhook for handeling payment success or failure
router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
        // Verify the event is from Stripe
        try {
            const stripeEvent = stripe.webhooks.constructEvent(
                req.body,
                req.headers["stripe-signature"],
                process.env.STRIPE_WEBHOOK_SECRET
            );
            const data = stripeEvent.data.object;
            // Handle successful payment events
            if (stripeEvent.type === "payment_intent.succeeded") {
                stripe.customers
                    .retrieve(data.customer)
                    .then(async (customer) => {
                        const userId = customer.metadata.userId;
                        const courseIds = JSON.parse(
                            customer.metadata.courseIds
                        );
                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                courses: {
                                    connect: courseIds.map((id) => ({
                                        id: id,
                                    })),
                                },
                            },
                        });
                    });

                // Respond to the webhook with a 200 status to acknowledge receipt
                res.status(200).end();
            }
        } catch (error) {
            console.error("Error handling webhook:", error.message);
            res.status(400).send("Webhook Error");
        }
    }
);

//stripe hitting endpoint from fronted
router
    .route("/create-checkout-session")
    .post(express.json(), async (req, res) => {
        const { products, userId, courseIds } = req.body;

        //customer object created for webhook event , it is used for db update
        const customer = await stripe.customers.create({
            metadata: {
                userId: userId,
                courseIds: JSON.stringify(courseIds),
            },
        });

        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.title,
                    metadata: {
                        id: userId,
                        courseIds: JSON.stringify(courseIds),
                    },
                },
                unit_amount: product.price * 100,
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer: customer.id,
            success_url: "http://localhost:3000/checkout-cart/success",
            cancel_url: "http://localhost:3000/checkout-cart/failed",
        });

        res.json({ id: session.id });
    });

module.exports = router;
