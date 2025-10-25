import "dotenv/config";
import app from "./app/App";


const {PORT} = process.env;

app.listen(PORT, () => {
    console.log(`AppDelivery está funcionando em http://localhost:${PORT}`);
});
