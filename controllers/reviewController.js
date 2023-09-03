const prisma = require("./../prisma/prismaClientExport");
const catchAsync = require("../errors/catchAsync");

const writeReview = catchAsync(async (req, res, next) => {
    const { courseId, userId, rating } = req.body;
    const doc = await prisma.review.create({
        data: {
            rating: rating,
            userId: userId,
            courseId: courseId,
        },
    });

    // prisma.course.update({
    //     where: {
    //         id: courseId,
    //     },
    //     data: {
    //         review: {
    //             connect: {
    //                 id: doc.id,
    //             },
    //         },
    //     },
    // });
    res.end("review successful");
});

const updateCart = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const courseList = req.body.courseList;
    await prisma.user.update({
        where: { id: userId },
        data: {
            cart: courseList,
        },
    });
    res.status(200).json({
        status: "success",
        message: "succesfully updated cart",
    });
});

const getCartItems = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const doc = await prisma.user.findFirst({
        where: {
            id: userId,
        },
    });
    res.status(200).json({
        status: "succes",

        cart: doc.cart,
    });
});

const getCartData = catchAsync(async (req, res, next) => {
    const doc = await prisma.course.findMany({
        where: {
            id: {
                in: req.body.cart,
            },
        },
    });
    const totalPrice = doc.reduce((total, course) => total + course.price, 0);

    res.status(200).json({
        status: "success",
        doc,
        totalPrice,
    });
});
// const writeReview = async (req, res, next) => {

//     const { bucketName } = req.body;
//     const review = {
//         rating: "5",
//         comment: "Thi is comment",
//     };

//     const doc = await Course.findOneAndUpdate(
//         {
//             bucketName: bucketName,
//         },
//         {
//             $push: {
//                 review: review,
//             },
//         }
//     );

//     res.end("review successful");
// };
module.exports = { writeReview, getCartItems, updateCart, getCartData };
