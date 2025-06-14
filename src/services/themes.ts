import { Problem } from './problems';

export type Theme = {
  id: string;
  name: string;
  description: string;
  examples: Problem[];
};

export const themes: Theme[] = [
  {
    id: 'array-methods-basic',
    name: 'Array Methods - Push/Pop',
    description: 'Master the fundamental array methods for adding and removing elements: .push(), .pop(), .shift(), and .unshift()',
    examples: [
      {
        title: "Add Items to a Shopping Cart",
        description: "Use the push method to add new items to a shopping cart array. Add 'milk' and 'bread' to the cart.",
        setup: "const cart = ['eggs', 'cheese'];\n// Your code here\nconsole.log(cart);",
        expectedOutput: "['eggs', 'cheese', 'milk', 'bread']",
        difficulty: "easy",
        solution: "cart.push('milk', 'bread');",
        testCases: [
          {
            input: "cart.push('milk', 'bread')",
            expected: "['eggs', 'cheese', 'milk', 'bread']"
          }
        ]
      },
      {
        title: "Queue Management System",
        description: "Create a function that manages a queue using shift and push. The function should remove the first person and add a new person to the queue.",
        setup: "const queue = ['Alice', 'Bob', 'Charlie'];\nfunction processQueue(newPerson) {\n  // Your code here\n}\nprocessQueue('David');\nconsole.log(queue);",
        expectedOutput: "['Bob', 'Charlie', 'David']",
        difficulty: "medium",
        solution: "function processQueue(newPerson) {\n  queue.shift();\n  queue.push(newPerson);\n}",
        testCases: [
          {
            input: "processQueue('David')",
            expected: "['Bob', 'Charlie', 'David']"
          }
        ]
      }
    ]
  },
  {
    id: 'array-methods-iteration',
    name: 'Array Methods - Iteration',
    description: 'Learn to transform and filter arrays using .map(), .filter(), and .forEach()',
    examples: [
      {
        title: "Double the Numbers",
        description: "Use map to create a new array with all numbers doubled.",
        setup: "const numbers = [1, 2, 3, 4];\n// Your code here\nconsole.log(numbers);",
        expectedOutput: "[2, 4, 6, 8]",
        difficulty: "easy",
        solution: "numbers = numbers.map(num => num * 2);",
        testCases: [
          {
            input: "numbers.map(num => num * 2)",
            expected: "[2, 4, 6, 8]"
          }
        ]
      },
      {
        title: "Filter Active Users",
        description: "Create a function that filters an array of users to only include active users with a score above 50.",
        setup: "const users = [\n  { name: 'Alice', active: true, score: 75 },\n  { name: 'Bob', active: false, score: 45 },\n  { name: 'Charlie', active: true, score: 60 }\n];\nfunction getActiveHighScorers() {\n  // Your code here\n}\nconsole.log(getActiveHighScorers());",
        expectedOutput: "[{ name: 'Alice', active: true, score: 75 }, { name: 'Charlie', active: true, score: 60 }]",
        difficulty: "medium",
        solution: "function getActiveHighScorers() {\n  return users.filter(user => user.active && user.score > 50);\n}",
        testCases: [
          {
            input: "getActiveHighScorers()",
            expected: "[{ name: 'Alice', active: true, score: 75 }, { name: 'Charlie', active: true, score: 60 }]"
          }
        ]
      }
    ]
  },
  {
    id: 'object-destructuring',
    name: 'Object Destructuring',
    description: 'Master object destructuring for clean and efficient data extraction',
    examples: [
      {
        title: "Extract User Properties",
        description: "Use object destructuring to extract name and age from the user object.",
        setup: "const user = { name: 'Alice', age: 25, email: 'alice@example.com' };\n// Your code here\nconsole.log({ name, age });",
        expectedOutput: "{ name: 'Alice', age: 25 }",
        difficulty: "easy",
        solution: "const { name, age } = user;",
        testCases: [
          {
            input: "const { name, age } = user;",
            expected: "{ name: 'Alice', age: 25 }"
          }
        ]
      },
      {
        title: "Nested Object Destructuring",
        description: "Create a function that uses nested destructuring to extract city and country from a user's address.",
        setup: "const user = {\n  name: 'Alice',\n  address: {\n    city: 'New York',\n    country: 'USA',\n    zip: '10001'\n  }\n};\nfunction getLocation() {\n  // Your code here\n}\nconsole.log(getLocation());",
        expectedOutput: "{ city: 'New York', country: 'USA' }",
        difficulty: "medium",
        solution: "function getLocation() {\n  const { address: { city, country } } = user;\n  return { city, country };\n}",
        testCases: [
          {
            input: "getLocation()",
            expected: "{ city: 'New York', country: 'USA' }"
          }
        ]
      }
    ]
  },
  {
    id: 'array-destructuring',
    name: 'Array Destructuring & Rest/Spread',
    description: 'Learn array destructuring and the power of rest/spread operators',
    examples: [
      {
        title: "Extract First and Last",
        description: "Use array destructuring to get the first and last elements of an array.",
        setup: "const colors = ['red', 'green', 'blue', 'yellow'];\n// Your code here\nconsole.log({ first, last });",
        expectedOutput: "{ first: 'red', last: 'yellow' }",
        difficulty: "easy",
        solution: "const [first, , , last] = colors;",
        testCases: [
          {
            input: "const [first, , , last] = colors;",
            expected: "{ first: 'red', last: 'yellow' }"
          }
        ]
      },
      {
        title: "Use Rest Operator",
        description: "Use the rest operator to collect remaining elements into a new array.",
        setup: "const numbers = [1, 2, 3, 4, 5];\n// Your code here\nconsole.log({ first, rest });",
        expectedOutput: "{ first: 1, rest: [2, 3, 4, 5] }",
        difficulty: "easy",
        solution: "const [first, ...rest] = numbers;",
        testCases: [
          {
            input: "const [first, ...rest] = numbers;",
            expected: "{ first: 1, rest: [2, 3, 4, 5] }"
          }
        ]
      },
      {
        title: "Swap Array Elements",
        description: "Use array destructuring to swap the first two elements of an array.",
        setup: "const arr = ['apple', 'banana'];\n// Your code here\nconsole.log(arr);",
        expectedOutput: "['banana', 'apple']",
        difficulty: "easy",
        solution: "[arr[0], arr[1]] = [arr[1], arr[0]];",
        testCases: [
          {
            input: "[arr[0], arr[1]] = [arr[1], arr[0]];",
            expected: "['banana', 'apple']"
          }
        ]
      },
      {
        title: "Extract Nested Arrays",
        description: "Use nested array destructuring to extract values from a nested array structure.",
        setup: "const matrix = [['a', 'b'], ['c', 'd']];\n// Your code here\nconsole.log({ topLeft, bottomRight });",
        expectedOutput: "{ topLeft: 'a', bottomRight: 'd' }",
        difficulty: "medium",
        solution: "const [[topLeft], [, bottomRight]] = matrix;",
        testCases: [
          {
            input: "const [[topLeft], [, bottomRight]] = matrix;",
            expected: "{ topLeft: 'a', bottomRight: 'd' }"
          }
        ]
      },
      {
        title: "Combine Arrays with Spread",
        description: "Create a function that combines two arrays and adds a new element in the middle using spread operator.",
        setup: "const frontend = ['HTML', 'CSS'];\nconst backend = ['Node', 'Express'];\nfunction combineStacks(newTech) {\n  // Your code here\n}\nconsole.log(combineStacks('React'));",
        expectedOutput: "['HTML', 'CSS', 'React', 'Node', 'Express']",
        difficulty: "medium",
        solution: "function combineStacks(newTech) {\n  return [...frontend, newTech, ...backend];\n}",
        testCases: [
          {
            input: "combineStacks('React')",
            expected: "['HTML', 'CSS', 'React', 'Node', 'Express']"
          }
        ]
      },
      {
        title: "Clone and Modify Array",
        description: "Create a function that clones an array and adds a new element at a specific position using spread operator.",
        setup: "const original = ['a', 'b', 'c'];\nfunction insertAt(array, element, position) {\n  // Your code here\n}\nconsole.log(insertAt(original, 'x', 1));",
        expectedOutput: "['a', 'x', 'b', 'c']",
        difficulty: "medium",
        solution: "function insertAt(array, element, position) {\n  return [...array.slice(0, position), element, ...array.slice(position)];\n}",
        testCases: [
          {
            input: "insertAt(original, 'x', 1)",
            expected: "['a', 'x', 'b', 'c']"
          }
        ]
      },
      {
        title: "Merge Objects with Spread",
        description: "Create a function that merges two objects and overrides specific properties.",
        setup: "const defaults = { theme: 'dark', fontSize: 14 };\nconst userPrefs = { fontSize: 16, language: 'en' };\nfunction mergeSettings(defaults, userPrefs) {\n  // Your code here\n}\nconsole.log(mergeSettings(defaults, userPrefs));",
        expectedOutput: "{ theme: 'dark', fontSize: 16, language: 'en' }",
        difficulty: "medium",
        solution: "function mergeSettings(defaults, userPrefs) {\n  return { ...defaults, ...userPrefs };\n}",
        testCases: [
          {
            input: "mergeSettings(defaults, userPrefs)",
            expected: "{ theme: 'dark', fontSize: 16, language: 'en' }"
          }
        ]
      },
      {
        title: "Extract with Default Values",
        description: "Use array destructuring with default values to handle missing elements.",
        setup: "const user = ['John'];\n// Your code here\nconsole.log({ name, role, department });",
        expectedOutput: "{ name: 'John', role: 'user', department: 'general' }",
        difficulty: "medium",
        solution: "const [name, role = 'user', department = 'general'] = user;",
        testCases: [
          {
            input: "const [name, role = 'user', department = 'general'] = user;",
            expected: "{ name: 'John', role: 'user', department: 'general' }"
          }
        ]
      },
      {
        title: "Complex Array Transformation",
        description: "Create a function that uses array destructuring and spread to transform an array of objects.",
        setup: "const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];\nfunction transformUsers(users) {\n  // Your code here\n}\nconsole.log(transformUsers(users));",
        expectedOutput: "[{ id: 1, name: 'Alice', type: 'user' }, { id: 2, name: 'Bob', type: 'user' }]",
        difficulty: "hard",
        solution: "function transformUsers(users) {\n  return users.map(({ id, name }) => ({ id, name, type: 'user' }));\n}",
        testCases: [
          {
            input: "transformUsers(users)",
            expected: "[{ id: 1, name: 'Alice', type: 'user' }, { id: 2, name: 'Bob', type: 'user' }]"
          }
        ]
      },
      {
        title: "Advanced Array Manipulation",
        description: "Create a function that uses array destructuring and spread to implement a queue with a maximum size.",
        setup: "const queue = ['a', 'b', 'c'];\nconst maxSize = 4;\nfunction addToQueue(queue, item, maxSize) {\n  // Your code here\n}\nconsole.log(addToQueue(queue, 'd', maxSize));\nconsole.log(addToQueue(queue, 'e', maxSize));",
        expectedOutput: "['a', 'b', 'c', 'd']\n['b', 'c', 'd', 'e']",
        difficulty: "hard",
        solution: "function addToQueue(queue, item, maxSize) {\n  const newQueue = [...queue, item];\n  return newQueue.length > maxSize ? newQueue.slice(-maxSize) : newQueue;\n}",
        testCases: [
          {
            input: "addToQueue(queue, 'd', maxSize); addToQueue(queue, 'e', maxSize)",
            expected: "['a', 'b', 'c', 'd']\n['b', 'c', 'd', 'e']"
          }
        ]
      }
    ]
  }
]; 