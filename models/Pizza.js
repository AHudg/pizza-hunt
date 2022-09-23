const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

// create the schema for the data here
const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    size: {
      type: String,
      required: true,
      // enum = enumerated and refers to a set of data that can be iterated over
      enum: ["Personal", "Small", "Medium", "Large", "Extra Large"],
      default: "Large",
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

PizzaSchema.virtual("commentCount").get(function () {
  // reduce to tally up the total of every comment
  // accepts two parameters: accumulator, currentValue
  // as reduce walks through the array, it passes the accumulating total and
  // current value of comment into th fx; w/ the return of the fx revising the total
  // for the next iteration through the array
  return this.comments.reduce(
    (total, comment) => total + comment.replies.length + 1,
    0
  );
});

// create the Pizza model using the PizzaSchema
const Pizza = model("Pizza", PizzaSchema);

//export the Pizza model
module.exports = Pizza;
