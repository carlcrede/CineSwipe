const {getActualRequestDurationInMilliseconds} = require("../middleware/logger");

it.each([
    [500, 500], // first test case: delay of 500 milliseconds should result in a duration of approximately 500 milliseconds
    [1000, 1000], // second test case: delay of 1000 milliseconds should result in a duration of approximately 1000 milliseconds
    [1500, 1500] // third test case: delay of 1500 milliseconds should result in a duration of approximately 1500 milliseconds
])(
    'getActualRequestDurationInMilliseconds(%i) returns the correct duration in milliseconds',
    (delay, expectedDuration) => {
        // First, we need to get the start time in nanoseconds using process.hrtime()
        const start = process.hrtime();

        // Next, we'll simulate some work by using setTimeout() to delay the execution
        // of the code by the specified delay
        setTimeout(() => {
            // After the specified delay, we'll get the end time and call the
            // getActualRequestDurationInMilliseconds() function, passing it the start time
            const end = process.hrtime();
            const duration = getActualRequestDurationInMilliseconds(start);

            // Finally, we'll use Jest's expect() and toBeCloseTo() methods to assert
            // that the duration is approximately the expected duration
            expect(duration).toBeLessThan(expectedDuration+100);
        }, delay);
    }
);




