const axios = require("axios");

// Business priority weights
const INBOX_WEIGHT_RULES = {
  placement: 3,
  result: 2,
  event: 1,
};

/**
 * Normalizes type fields, assigns priorities, and resolves ties chronologically.
 */
function compilePriorityInbox(notificationCollection, displayLimit = 10) {
  if (!Array.isArray(notificationCollection)) return [];

  return notificationCollection
    .map((record) => {
      const normalizedType = String(
        record.Type || record.type || "",
      ).toLowerCase();
      return {
        id: record.ID || record.id,
        type: record.Type || record.type,
        message: record.Message || record.message,
        timestamp: record.Timestamp || record.timestamp,
        computedWeight: INBOX_WEIGHT_RULES[normalizedType] || 0,
        unixTimeMs: new Date(record.Timestamp || record.timestamp).getTime(),
      };
    })
    .sort((itemA, itemB) => {
      // Primary sort by weight
      if (itemB.computedWeight !== itemA.computedWeight) {
        return itemB.computedWeight - itemA.computedWeight;
      }
      // Tie-breaker: sort chronologically (newest first)
      return itemB.unixTimeMs - itemA.unixTimeMs;
    })
    .slice(0, displayLimit)
    .map(({ id, type, message, timestamp }) => ({
      id,
      type,
      message,
      timestamp,
    }));
}

async function executeEvaluationRunner() {
  const USER_ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJraHVzaGkucHJhamFwYXRpX2NzMjNAZ2xhLmFjLmluIiwiZXhwIjoxNzgxMDczNzU3LCJpYXQiOjE3ODEwNzI4NTcsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1MTkyMDU3ZC1iMWNkLTQzZGEtOTI1YS1hNWZhZWViMTY5ZmMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJraHVzaGkgcHJhamFwYXRpIiwic3ViIjoiMGEzZTA2ZmMtNWZiMy00ZmRmLTg2ZmMtYmM5MmU2OWU5NTZmIn0sImVtYWlsIjoia2h1c2hpLnByYWphcGF0aV9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJraHVzaGkgcHJhamFwYXRpIiwicm9sbE5vIjoiMjMxNTAwMTEyNyIsImFjY2Vzc0NvZGUiOiJSUHNnWXQiLCJjbGllbnRJRCI6IjBhM2UwNmZjLTVmYjMtNGZkZi04NmZjLWJjOTJlNjllOTU2ZiIsImNsaWVudFNlY3JldCI6InpNZ0RXelp2Q3dydU1iRnoifQ.LVU4SPqLc3kZN6lppXikvLPkxJws6qwuZLCrgTZLZ7c";
  const INBOX_DISPLAY_LIMIT = 10;

  try {
    console.log("Ingesting notification streams from remote testing server...");
    const endpointResponse = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${USER_ACCESS_TOKEN}`,
          Accept: "application/json",
        },
      },
    );

    const rawDataset =
      endpointResponse.data.notifications || endpointResponse.data;
    console.log(
      `Ingested ${rawDataset.length} notifications. Running ranking calculations...`,
    );

    const refinedPriorityInbox = compilePriorityInbox(
      rawDataset,
      INBOX_DISPLAY_LIMIT,
    );

    console.log(`\n=== TOP ${INBOX_DISPLAY_LIMIT} HIGHEST PRIORITY ALERTS ===`);
    console.table(refinedPriorityInbox);
  } catch (error) {
    console.error("Processing run terminated abnormally.");
    if (error.response) {
      console.error(`HTTP Error Code: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

executeEvaluationRunner();
