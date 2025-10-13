import app from "./app/App";

const port = 3000;

app.listen(port, () => {
    console.log(`AppDelivery está funcionando em http://localhost:${port}`);
});
