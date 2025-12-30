import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@ecommerce/navbar",
  app: () => System.import("@ecommerce/navbar"),
  activeWhen: () => true // Always active
});


registerApplication({
  name: "@ecommerce/products",
  app: () => System.import("@ecommerce/products"),
  activeWhen: (location) => {
    return location.pathname === "/" || location.pathname === "/products";
  }
});


registerApplication({
  name: "@ecommerce/cart",
  app: () => System.import("@ecommerce/cart"),
  activeWhen: (location) => {
    return location.pathname === "/cart";
  }
});


registerApplication({
  name: "@ecommerce/product-details",
  app: () => System.import("@ecommerce/product-details"),
  activeWhen: (location) => {
    return location.pathname.startsWith("/product/");
  }
});

registerApplication({
  name: "@ecommerce/supplier",
  app: () => System.import("@ecommerce/supplier"),
  activeWhen: (location) =>
    location.pathname === "/supplier" ||
    location.pathname.startsWith("/supplier/"),
});



registerApplication({
  name: "@ecommerce/admin",
  app: () => System.import("@ecommerce/admin"),
  activeWhen: (location) => {
    return location.pathname === "/admin" || location.pathname.startsWith("/admin/");
  }
});


start({
  urlRerouteOnly: true,
});