import problemsData from '@/data/problems.json';

export interface Problem {
  title: string;
  description: string;
  setup: string;
  expectedOutput: string;
  difficulty: 'easy' | 'medium' | 'hard';
  solution: string;
  testCases: {
    input: string;
    expected: string;
  }[];
}

export interface ProblemsByMethod {
  [method: string]: {
    [difficulty: string]: Problem[];
  };
}

export interface ProblemsDatabase {
  arrayMethods: {
    [method: string]: {
      [difficulty: string]: Problem[];
    };
  };
}

export function getProblemsByMethod(method: string, difficulty: 'easy' | 'medium' | 'hard'): Problem[] {
  const problems = problemsData as ProblemsDatabase;
  
  // Map theme IDs to their corresponding methods
  const methodMap: { [key: string]: string } = {
    'array-methods-basic': 'push', // For now, default to push problems
    'array-methods-iteration': 'map',
    'object-destructuring': 'destructuring',
    'array-destructuring': 'destructuring'
  };

  const actualMethod = methodMap[method] || method;
  return problems.arrayMethods[actualMethod]?.[difficulty] || [];
}

export function getAllProblemsByMethod(method: string): { [difficulty: string]: Problem[] } {
  const problems = problemsData as ProblemsDatabase;
  return problems.arrayMethods[method] || {};
}

export function getAvailableMethods(): string[] {
  const problems = problemsData as ProblemsDatabase;
  return Object.keys(problems.arrayMethods);
}

// Pre-defined problems for .push() method
export const pushProblems: Problem[] = [
  {
    title: "Add an Item to an Array",
    description: "Use the push method to add 'orange' to the array.",
    setup: "const arr = ['apple', 'banana'];\n// Your code here\nconsole.log(arr);",
    expectedOutput: "['apple', 'banana', 'orange']",
    difficulty: "easy",
    solution: "arr.push('orange');",
    testCases: [
      {
        input: "arr.push('orange')",
        expected: "['apple', 'banana', 'orange']"
      }
    ]
  },
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
    title: "Build a Todo List",
    description: "Create a function that adds new tasks to a todo list using push. The function should handle multiple tasks at once.",
    setup: "const todoList = ['Learn JavaScript'];\nfunction addTasks(tasks) {\n  // Your code here\n}\naddTasks(['Practice arrays', 'Build projects']);\nconsole.log(todoList);",
    expectedOutput: "['Learn JavaScript', 'Practice arrays', 'Build projects']",
    difficulty: "medium",
    solution: "function addTasks(tasks) {\n  tasks.forEach(task => todoList.push(task));\n}",
    testCases: [
      {
        input: "addTasks(['Practice arrays', 'Build projects'])",
        expected: "['Learn JavaScript', 'Practice arrays', 'Build projects']"
      }
    ]
  },
  {
    title: "Dynamic Array Building",
    description: "Create a function that builds an array of user objects using push. Each user should have a name and age property.",
    setup: "const users = [];\nfunction addUser(name, age) {\n  // Your code here\n}\naddUser('Alice', 25);\naddUser('Bob', 30);\nconsole.log(users);",
    expectedOutput: "[{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]",
    difficulty: "hard",
    solution: "function addUser(name, age) {\n  users.push({ name, age });\n}",
    testCases: [
      {
        input: "addUser('Alice', 25); addUser('Bob', 30)",
        expected: "[{ name: 'Alice', age: 25 }, { name: 'Bob', age: 30 }]"
      }
    ]
  }
]; 