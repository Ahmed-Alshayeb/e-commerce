import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import productModel from "../../../../DB/models/product.model.js";

const productType = new GraphQLObjectType({
  name: "productType",
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    slug: { type: GraphQLString },
    createdBy: { type: GraphQLID },
    category: { type: GraphQLID },
    subCategory: { type: GraphQLID },
    brand: { type: GraphQLID },
    image: { type: GraphQLString },
    price: { type: GraphQLFloat },
    discount: { type: GraphQLInt },
    subPrice: { type: GraphQLFloat },
    stock: { type: GraphQLInt },
    rateAvg: { type: GraphQLFloat },
    rateNum: { type: GraphQLInt },
  },
});

const productQuery = new GraphQLObjectType({
  name: "productQuery",
  fields: {
    getProducts: {
      type: new GraphQLList(productType),
      resolve: async (parent, args) => {
        const products = await productModel.find({});
        return products;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: productQuery,
});
