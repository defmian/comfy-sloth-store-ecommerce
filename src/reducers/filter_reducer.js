import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from "../actions";

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((product) => product.price);
      maxPrice = Math.max(...maxPrice);

      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
      };
    case SET_GRIDVIEW:
      return {
        ...state,
        grid_view: true,
      };
    case SET_LISTVIEW:
      return {
        ...state,
        grid_view: false,
      };
    case UPDATE_SORT:
      return {
        ...state,
        sort: action.payload,
      };
    case SORT_PRODUCTS:
      const { sort, filtered_products } = state;
      let tempProducts = [...filtered_products];
      if (sort === "price-lowest") {
        tempProducts = tempProducts.sort((a, b) => a.price - b.price);
      }
      if (sort === "price-highest") {
        tempProducts = tempProducts.sort((a, b) => b.price - a.price);
      }
      if (sort === "name-a") {
        tempProducts = tempProducts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      }
      if (sort === "name-z") {
        tempProducts = tempProducts.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      }
      return {
        ...state,
        filtered_products: tempProducts,
      };
    case UPDATE_FILTERS:
      const { name, value } = action.payload;
      return { ...state, filters: { ...state.filters, [name]: value } };
    case FILTER_PRODUCTS:
      const { all_products } = state;
      const { text, company, colors, price, shipping, category, max_price } =
        state.filters;
      let arrayOfProducts = [...all_products];
      //filtering
      if (text) {
        arrayOfProducts = arrayOfProducts.filter((product) =>
          product.name.toLowerCase().startsWith(text)
        );
      }
      if (company !== "all") {
        arrayOfProducts = arrayOfProducts.filter(
          (product) => product.company.toLowerCase() === company
        );
      }
      if (category !== "all") {
        arrayOfProducts = arrayOfProducts.filter(
          (product) => product.category.toLowerCase() === category
        );
      }
      if (colors !== "all") {
        console.log(colors);
        arrayOfProducts = arrayOfProducts.filter((product) =>
          product.colors.includes(colors)
        );
      }
      if (price !== max_price) {
        arrayOfProducts = arrayOfProducts.filter(
          (product) => product.price <= price
        );
      }
      if (shipping) {
        arrayOfProducts = arrayOfProducts.filter((product) => product.shipping);
      }

      return { ...state, filtered_products: arrayOfProducts };
    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: "",
          company: "all",
          category: "all",
          colors: "all",
          price: state.filters.max_price,
          shipping: false,
        },
      };
    default:
      console.log("default");
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
