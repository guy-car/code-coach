import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, you should proxy these requests through your backend
});

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

export async function generateArrayMethodProblem(method: string): Promise<Problem> {
  const prompt = `Generate a JavaScript coding problem that teaches the array ${method} method. 
  The problem should be clear and focused on practical usage.
  
  IMPORTANT: Follow these EXACT format requirements:
  1. Use 'const' declarations, never 'let'
  2. Include "// Your code here" comment where user code should go
  3. For simple problems, use this exact format:
     {
       "setup": "const arr = ['apple', 'banana'];\n// Your code here\nconsole.log(arr);",
       "expectedOutput": "['apple', 'banana', 'orange']"
     }
  4. For function problems, use this exact format:
     {
       "setup": "const arr = ['apple', 'banana'];\nfunction addFruit(fruit) {\n  // Your code here\n}\naddFruit('orange');\nconsole.log(arr);",
       "expectedOutput": "['apple', 'banana', 'orange']"
     }

  Return the response in the following JSON format:
  {
    "title": "Problem title",
    "description": "Clear problem description",
    "setup": "Initial code setup with array and any necessary variables",
    "expectedOutput": "What the final array should look like",
    "difficulty": "easy",
    "solution": "The correct code solution",
    "testCases": [
      {
        "input": "Sample input",
        "expected": "Expected output"
      }
    ]
  }`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from OpenAI');
    
    return JSON.parse(response) as Problem;
  } catch (error) {
    console.error('Error generating problem:', error);
    throw error;
  }
}

export async function generateArrayMethodProblems(method: string, count: number = 3): Promise<Problem[]> {
  const prompt = `Generate ${count} JavaScript coding problems that teach the array ${method} method, with increasing difficulty levels.
  Each problem should be practical and focused on real-world usage scenarios.
  The problems should progress from basic usage to more complex applications.

  IMPORTANT: Follow these EXACT format requirements:
  1. Use 'const' declarations, never 'let'
  2. Include "// Your code here" comment where user code should go
  3. For simple problems, use this exact format:
     {
       "setup": "const arr = ['apple', 'banana'];\n// Your code here\nconsole.log(arr);",
       "expectedOutput": "['apple', 'banana', 'orange']"
     }
  4. For function problems, use this exact format:
     {
       "setup": "const arr = ['apple', 'banana'];\nfunction addFruit(fruit) {\n  // Your code here\n}\naddFruit('orange');\nconsole.log(arr);",
       "expectedOutput": "['apple', 'banana', 'orange']"
     }

  Return the response in the following JSON format:
  {
    "problems": [
      {
        "title": "Problem title",
        "description": "Clear problem description",
        "setup": "Initial code setup with array and any necessary variables",
        "expectedOutput": "What the final array should look like",
        "difficulty": "easy|medium|hard",
        "solution": "The correct code solution",
        "testCases": [
          {
            "input": "Sample input",
            "expected": "Expected output"
          }
        ]
      }
    ]
  }

  Guidelines for each difficulty level:
  - Easy: Basic usage of the method with simple data types
  - Medium: Using the method within a function or with more complex data structures
  - Hard: Combining the method with other array methods or complex object manipulation`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    const response = completion.choices[0].message.content;
    if (!response) throw new Error('No response from OpenAI');
    
    const result = JSON.parse(response);
    return result.problems as Problem[];
  } catch (error) {
    console.error('Error generating problems:', error);
    throw error;
  }
}

// Pre-defined problems for .push() method
export const pushProblems: Problem[] = [
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