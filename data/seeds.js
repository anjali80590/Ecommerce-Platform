const { faker } = require("@faker-js/faker");

const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));

const categories = [
  "Mobile",
  "Laptop",
  "Headphone",
  "Charger",
  "Cover",
  "Tablet",
];
const colors = ["Red", "Blue", "Black", "White", "Green"];

const products = Array.from({ length: 1000 }, () => ({
  title: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 1000, max: 150000 }),
  mrp: faker.number.int({ min: 1000, max: 160000 }),
  rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
  stock: faker.number.int({ min: 0, max: 500 }),
  unitsSold: faker.number.int({ min: 0, max: 5000 }),
  returnRate: faker.number.float({ min: 0, max: 0.1 }),
  tags: [categories[Math.floor(Math.random() * categories.length)]],
  metadata: {
    ram: `${[4, 6, 8, 12, 16][Math.floor(Math.random() * 5)]}GB`,
    storage: `${[64, 128, 256, 512][Math.floor(Math.random() * 4)]}GB`,
    screensize: `${[5.5, 6.1, 6.5, 6.7][Math.floor(Math.random() * 4)]} inch`,
    color: colors[Math.floor(Math.random() * colors.length)],
    model: faker.vehicle.model(),
    brightness: `${faker.number.int({ min: 200, max: 1000 })} nits`,
  },
}));


Product.insertMany(products)
  .then((res) => {
    console.log("Inserted", res.length, "products");
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));
