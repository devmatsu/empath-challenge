type LambdaResponse = {
  statusCode: number;
  body: string;
};

function generateRandomNumber(): number {
  const MIN_NUMBER = 0;
  const MAX_NUMBER = 10000;
  return Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
}

export async function generate(): Promise<LambdaResponse> {
  try {
    const randomNumber: number = generateRandomNumber();

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
