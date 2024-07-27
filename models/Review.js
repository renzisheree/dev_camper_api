const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title for the review"],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, "Please add some text for the review"],
    },
    rating: {
        type: Number,
        min : 1,
        max:10,
        required: [true, "Please add a rating"],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
});
//prevent user summiting more than 1 review per bootcamp
reviewSchema.index({bootcampId: 1 , user : 1} , {unique: true});

//averageRating
reviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: new mongoose.Types.ObjectId(bootcampId) },
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: { $avg: "$rating" },
            },
        },
    ]);
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
            averageRating:obj[0].averageRating
        });
    } catch (error) {
        console.log(error);
    }
};


reviewSchema.post("save", function () {
    this.constructor.getAverageRating(this.bootcamp);
});
reviewSchema.pre("remove", function () {
    this.constructor.getAverageRating(this.bootcamp);
});




module.exports = mongoose.model('Review', reviewSchema);