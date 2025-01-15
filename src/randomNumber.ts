export async function generate() {
  try {
    const MIN_NUMBER = 0;
    const MAX_NUMBER = 10000;
    const randomNumber = Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;

    return {
      statusCode: 200,
      body: JSON.stringify({ randomNumber }),
    };
  } catch (error) {
    console.error("Error generating random number:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
}
