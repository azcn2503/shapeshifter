const Shapeshifter = require("../").Shapeshifter;

const TEST_OBJECT = {
  name: "Aaron Cunnington",
  age: 29,
  likes: ["pugs", "electric vehicles", "the sun"],
  dislikes: ["traffic", "cold weather"],
  diary: {
    2017: {
      September: {
        25: [
          {
            title: "I created this test",
            description: "I created this test today"
          }
        ]
      }
    }
  }
};

test("can build a shapeshifter object", () => {
  expect(new Shapeshifter(TEST_OBJECT).output.__isShapeshifter).toBeTruthy();
});

test("builds the correct number of keys", () => {
  expect(new Shapeshifter(TEST_OBJECT).value().length).toBe(16);
});

test("throws an error on invalid expression", () => {
  expect(() => new Shapeshifter(TEST_OBJECT).access("Aaron")).toThrow();
});

test("returns two keys matching an expression", () => {
  expect(new Shapeshifter(TEST_OBJECT).access(/likes$/).length).toBe(2); // likes, dislikes
});

test("returns a key matching an expression", () => {
  expect(new Shapeshifter(TEST_OBJECT).access(/^likes$/).length).toBe(1); // likes
});
