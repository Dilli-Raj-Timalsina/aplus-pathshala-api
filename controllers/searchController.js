const catchAsync = require("./../errors/catchAsync");
const prisma = require("./../prisma/prismaClientExport");

const searchItem = catchAsync(async (req, res, next) => {
    const slug = req.params.id;

    const courses = await prisma.course.findMany({
        where: {
            AND: [
                {
                    title: {
                        contains: slug,
                        mode: "insensitive",
                    },
                },
            ],
        },
        select: {
            id: true,
            title: true,
        },
    });

    res.status(200).json({
        status: "success",
        courses,
    });
});

module.exports = {
    searchItem,
};
