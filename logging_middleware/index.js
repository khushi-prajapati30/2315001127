const axios = require("axios");

/**
 * Global logging pipeline targeting the remote evaluation endpoint.
 * Ensures lowercase constraints on metadata parameters.
 */
async function Log(stack, level, packageField, message) {
  const payload = {
    stack: String(stack).toLowerCase(),
    level: String(level).toLowerCase(),
    package: String(packageField).toLowerCase(),
    message: message,
  };

  try {
    await axios.post("http://4.224.186.213/evaluation-service/logs", payload, {
      headers: {
        Authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJraHVzaGkucHJhamFwYXRpX2NzMjNAZ2xhLmFjLmluIiwiZXhwIjoxNzgxMDczNzU3LCJpYXQiOjE3ODEwNzI4NTcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1MTkyMDU3ZC1iMWNkLTQzZGEtOTI1YS1hNWZhZWViMTY5ZmMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJraHVzaGkgcHJhamFwYXRpIiwic3ViIjoiMGEzZTA2ZmMtNWZiMy00ZmRmLTg2ZmMtYmM5MmU2OWU5NTZmIn0sImVtYWlsIjoia2h1c2hpLnByYWphcGF0aV9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJraHVzaGkgcHJhamFwYXRpIiwicm9sbE5vIjoiMjMxNTAwMTEyNyIsImFjY2Vzc0NvZGUiOiJSUHNnWXQiLCJjbGllbnRJRCI6IjBhM2UwNmZjLTVmYjMtNGZkZi04NmZjLWJjOTJlNjllOTU2ZiIsImNsaWVudFNlY3JldCI6InpNZ0RXelp2Q3dydU1iRnoifQ.LVU4SPqLc3kZN6lppXikvLPkxJws6qwuZLCrgTZLZ7c",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(
      "Remote logging pipeline encountered an error:",
      error.message,
    );
  }
}

module.exports = Log;
