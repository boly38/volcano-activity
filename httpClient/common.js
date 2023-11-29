const verifyReturnCode = (client, response, code) => {
    client.test(`Request executed successfully with code=${code}`, function () {
        client.assert(response.status === code, `Response status is not ${code}`);
    });
}

export {verifyReturnCode}