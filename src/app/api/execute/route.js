import { NextResponse } from 'next/server';
import axios from 'axios';
import { getSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Submission from '@/models/Submission';

// Piston API is a public API for executing code in various languages.
// Doc: https://piston.readthedocs.io/en/latest/api-v2/
const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export async function POST(request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { language, sourceCode, args, slug } = await request.json();

        // Map our frontend language IDs to Piston's runtime names and versions
        const runtimeMap = {
            'javascript': { language: 'javascript', version: '18.15.0' },
            'python': { language: 'python', version: '3.10.0' },
            'java': { language: 'java', version: '15.0.2' },
            'cpp': { language: 'c++', version: '10.2.0' }
        };

        const runtime = runtimeMap[language];

        if (!runtime) {
            return NextResponse.json({ error: 'Unsupported language' }, { status: 400 });
        }

        // Inject driver code (Mocking LeetCode's backend runner)
        let finalCode = sourceCode;

        // Basic runner for the "Two Sum" demo or generic structure
        if (language === 'javascript') {
            finalCode = `${sourceCode}\n\n// Driver Code (Hidden)\ntry { console.log(twoSum([2,7,11,15], 9)); } catch(e) { console.log(e.message); }`;
        } else if (language === 'python') {
            finalCode = `from typing import List\n${sourceCode}\n\n# Driver Code\ntry:\n    sol = Solution()\n    print(sol.twoSum([2,7,11,15], 9))\nexcept Exception as e:\n    print(e)`;
        } else if (language === 'java') {
            // Piston needs a class named 'Main' usually for simple execution if entry point isn't specified, 
            // but we can just append a Main class with psvm
            // We assume User wrote 'class Solution'. We'll nest it or call it.
            finalCode = `import java.util.*;\n${sourceCode}\n\npublic class Main {\n    public static void main(String[] args) {\n        try {\n            Solution s = new Solution();\n            int[] res = s.twoSum(new int[]{2,7,11,15}, 9);\n            System.out.println(Arrays.toString(res));\n        } catch (Exception e) {\n            System.out.println(e);\n        }\n    }\n}`;
        } else if (language === 'cpp') {
            finalCode = `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\n${sourceCode}\n\nint main() {\n    Solution s;\n    vector<int> nums = {2,7,11,15};\n    vector<int> res = s.twoSum(nums, 9);\n    cout << "[" << res[0] << "," << res[1] << "]" << endl;\n    return 0;\n}`;
        }

        // Prepare the payload for Piston
        const payload = {
            language: runtime.language,
            version: runtime.version,
            files: [
                {
                    content: finalCode
                }
            ],
            stdin: "",
            args: args || []
        };

        const response = await axios.post(PISTON_API_URL, payload);
        const { run } = response.data;

        // Output validation logic
        const actualOutput = run.output ? run.output.trim() : "";
        const expectedOutput = "[0, 1]";

        // Normalize for comparison (remove spaces/newlines to handle different language print styles)
        // e.g. JS: [ 0, 1 ], Python: [0, 1], C++: [0,1]
        const normalizedActual = actualOutput.replace(/\s+/g, '');
        const normalizedExpected = expectedOutput.replace(/\s+/g, '');

        let status = 'Runtime Error';
        if (run.code === 0) {
            if (normalizedActual.includes(normalizedExpected)) {
                status = 'Accepted';
            } else {
                status = 'Wrong Answer';
            }
        }

        // Only save to DB if it's actually Accepted
        if (status === 'Accepted' && slug) {
            await dbConnect();

            // Ensure we have a valid user ID. 
            // In login route, we save 'id' (string) to the session token.
            const userId = session.user.id || session.user._id;

            if (!userId) {
                console.error("Missing User ID", session);
            } else {
                await Submission.create({
                    userId: userId,
                    problemSlug: slug,
                    status: status,
                    language,
                    code: sourceCode,
                    runtime: '12ms',
                    memory: '14.2MB'
                });
            }
        }

        return NextResponse.json({
            status: status,
            output: run.output,
            expected: expectedOutput, // Return expected so frontend can show diff if needed
            runtime: '12ms',
            memory: '14.2MB',
            logs: run.output.split('\n').filter(line => line)
        });

    } catch (error) {
        console.error("Execution error:", error);
        return NextResponse.json({
            status: 'Error',
            error: error.message,
            logs: [error.message]
        }, { status: 500 });
    }
}
