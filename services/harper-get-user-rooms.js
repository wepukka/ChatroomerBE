let axios = require("axios");

function harperGetUserRooms(username) {
  const dbUrl = process.env.HARPERDB_URL;
  const dbPw = process.env.HARPERDB_PW;
  if (!dbUrl || !dbPw) return null;

  let data = JSON.stringify({
    operation: "sql",
    sql: `SELECT * FROM chat_app.users WHERE username = '${username}'`,
  });

  let config = {
    method: "post",
    url: dbUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: dbPw,
    },
    data: data,
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(response.data[0]);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

module.exports = harperGetUserRooms;
