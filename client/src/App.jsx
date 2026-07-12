import { useEffect } from "react";
import api from "./api/api";

function App() {

  useEffect(() => {

    api.get("/")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <h1>OfferPrep</h1>
  );
}

export default App;