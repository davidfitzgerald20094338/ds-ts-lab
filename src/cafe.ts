import { MenuItem, ComboDeal, OrderLine, Course } from "./menuTypes";

// ---------------------------------------------------------------
// 1. THE MENU
// ---------------------------------------------------------------

const soup: MenuItem = {
  id: 1,
  name: "Roast Tomato Soup",
  course: "starter",
  price: 5.5,
  nutrition: {
    calories: 180,
    allergens: ["celery"],
  },
};

const risotto: MenuItem = {
  id: 2,
  name: "Mushroom Risotto",
  course: "main",
  price: 14.0,
  nutrition: {
    calories: 620,
    allergens: ["milk"],
  },
};

const brownie: MenuItem = {
  id: 3,
  name: "Chocolate Brownie",
  course: "dessert", // BUG: not a valid Course value
  price: 6.0,
  nutrition: {
    calories: 450,
    allergens: ["milk", "eggs", "gluten"],
  },
};

const menu: MenuItem[] = [soup, risotto, brownie];

const lunchCombo: ComboDeal = {
  id: 101,
  name: "Soup & Sweet",
  items: [soup, brownie],
  price: 10.0,
};

const currentOrder: OrderLine[] = [risotto, lunchCombo, soup];

// ---------------------------------------------------------------
// 2. FUNCTIONS
// ---------------------------------------------------------------

function describe(item: MenuItem) {
  return `${item.name} (${item.course}) - EUR ${item.price.toFixed(2)}`;
}

function lineTotal(line: OrderLine) {
  if ("items" in line) {
    return line.price; // Combos are sold at their bundle price.
  }
  return line.price;
}

function orderTotal(lines: OrderLine[]) {
  return lines.reduce((total, line) => total + lineTotal(line), 0);
}

function filterMenu(items: MenuItem[], predicate: (item: MenuItem) => boolean) {
  return items.filter(predicate);
}

function cheapest(items: MenuItem[], max?: number) {
  const sorted = items.sort((a, b) => a.price - b.price);
  if (max === undefined) {
    return sorted;
  }
  return sorted.slice(0, max);
}

function firstMatch<T>(data: T[], criteria: (d: T) => boolean): T | undefined {
  return data.find(criteria);
}

function updateItem(item: MenuItem, changes: Partial<MenuItem>) {
  return { ...item, ...changes };
}

function kitchenTicket(item: MenuItem): Readonly<Pick<MenuItem, "name" | "course">> {
  return {
    name: item.name,
    course: item.course,
  };
}

function allergyCard(item: MenuItem): Omit<MenuItem, "nutrition"> & { warning: string } {
  return {
    id: item.id,
    name: item.name,
    course: item.course,
    price: item.price,
    warning: `Contains: ${item.nutrition.allergens.join(", ")}`,
  };
}

// ---------------------------------------------------------------
// 3. TESTS
// ---------------------------------------------------------------

console.log(describe(risotto));
console.log(orderTotal(currentOrder));
console.log(filterMenu(menu, (i) => i.nutrition.calories < 500));
console.log(cheapest(menu, 2));
console.log(cheapest(menu));
console.log(firstMatch(menu, (i) => i.course === "dessert"));
console.log(updateItem(soup, { price: 6.0, discountPercent: 10 }));
console.log(kitchenTicket(brownie));
console.log(allergyCard(brownie));

// kitchenTicket(brownie).name = "Something else";
// The line above won't compile: kitchenTicket returns a Readonly<> type,
// so its properties cannot be reassigned.

// console.log(describe(lunchCombo));
// BUG: describe() only accepts a MenuItem, but lunchCombo is a ComboDeal.

console.log(updateItem(soup, { price: 7.00 })); // BUG: price should be a number, not a string

console.log(firstMatch(menu, (i) => i.nutrition.calories < 300)); // BUG: should be i.nutrition.calories