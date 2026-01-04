import axios from 'axios';

const LEETCODE_API_ENDPOINT = 'https://leetcode.com/graphql';

const GRAPHQL_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        acRate
        difficulty
        paidOnly: isPaidOnly
        title
        titleSlug
        topicTags {
          name
          slug
        }
      }
    }
  }
`;

// Expanded mock data for fallback
const MOCK_PROBLEMS = [
    {
        titleSlug: "two-sum",
        title: "Two Sum",
        difficulty: "Easy",
        acRate: 52.4,
        topicTags: [{ name: "Array" }, { name: "Hash Table" }]
    },
    {
        titleSlug: "add-two-numbers",
        title: "Add Two Numbers",
        difficulty: "Medium",
        acRate: 43.1,
        topicTags: [{ name: "Linked List" }, { name: "Math" }, { name: "Recursion" }]
    },
    {
        titleSlug: "longest-substring-without-repeating-characters",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        acRate: 35.0,
        topicTags: [{ name: "String" }, { name: "Sliding Window" }, { name: "Hash Table" }]
    },
    {
        titleSlug: "median-of-two-sorted-arrays",
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        acRate: 41.2,
        topicTags: [{ name: "Array" }, { name: "Binary Search" }, { name: "Divide and Conquer" }]
    },
    {
        titleSlug: "valid-parentheses",
        title: "Valid Parentheses",
        difficulty: "Easy",
        acRate: 40.3,
        topicTags: [{ name: "String" }, { name: "Stack" }]
    },
    {
        titleSlug: "merge-intervals",
        title: "Merge Intervals",
        difficulty: "Medium",
        acRate: 47.5,
        topicTags: [{ name: "Array" }, { name: "Sorting" }]
    },
    {
        titleSlug: "climbing-stairs",
        title: "Climbing Stairs",
        difficulty: "Easy",
        acRate: 54.0,
        topicTags: [{ name: "Math" }, { name: "Dynamic Programming" }]
    },
    {
        titleSlug: "coin-change",
        title: "Coin Change",
        difficulty: "Medium",
        acRate: 44.0,
        topicTags: [{ name: "Array" }, { name: "Dynamic Programming" }, { name: "Breadth-First Search" }]
    },
    {
        titleSlug: "course-schedule",
        title: "Course Schedule",
        difficulty: "Medium",
        acRate: 46.5,
        topicTags: [{ name: "Depth-First Search" }, { name: "Breadth-First Search" }, { name: "Graph" }, { name: "Topological Sort" }]
    },
    {
        titleSlug: "number-of-islands",
        title: "Number of Islands",
        difficulty: "Medium",
        acRate: 59.8,
        topicTags: [{ name: "Array" }, { name: "Depth-First Search" }, { name: "Breadth-First Search" }, { name: "Union Find" }, { name: "Matrix" }]
    },
    {
        titleSlug: "reverse-linked-list",
        title: "Reverse Linked List",
        difficulty: "Easy",
        acRate: 75.6,
        topicTags: [{ name: "Linked List" }, { name: "Recursion" }]
    },
    {
        titleSlug: "maximum-depth-of-binary-tree",
        title: "Maximum Depth of Binary Tree",
        difficulty: "Easy",
        acRate: 75.3,
        topicTags: [{ name: "Tree" }, { name: "Depth-First Search" }, { name: "Breadth-First Search" }, { name: "Binary Tree" }]
    }
];

export async function getProblemList(limit = 50, skip = 0) {
    // Return mock data directly for stability/demo purposes as requested
    // This ensures the list is always the same (hardcoded) and reliable.
    return MOCK_PROBLEMS;
}

export async function getProblemDetail(slug) {
    // Return mock details specifically for "Two Sum" or generic for others
    // In a real app, this would also query the GraphQL API for 'questionData'

    if (slug === 'two-sum') {
        return {
            titleSlug: "two-sum",
            title: "Two Sum",
            difficulty: "Easy",
            content: `
                <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
                <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.</p>
                <p>You can return the answer in any order.</p>
                <p>&nbsp;</p>
                <p><strong>Example 1:</strong></p>
                <pre><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>
            `,
            starterCodes: {
                javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};`,
                python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        `,
                java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}`,
                cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};`
            }
        };
    }

    // Generic fallback for other problems
    // Try to prettify the slug for the title
    const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        titleSlug: slug,
        title: title,
        difficulty: "Medium", // Default assumption
        content: `<p>Problem description for <strong>${title}</strong>.</p>
                 <p>This is a placeholder description for the mock environment.</p>
                 <p>Please implement the solution based on standard LeetCode requirements for this problem.</p>`,
        starterCodes: {
            javascript: `// Write your solution for ${slug} here\n\nfunction solution() {\n    \n}`,
            python: `# Write your solution for ${slug} here\n\ndef solution():\n    pass`,
            java: `// Write your solution for ${slug} here\n\nclass Solution {\n    public void solution() {\n        \n    }\n}`,
            cpp: `// Write your solution for ${slug} here\n\nclass Solution {\npublic:\n    void solution() {\n        \n    }\n};`
        }
    };
}
