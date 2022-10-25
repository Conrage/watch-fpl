import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import axios from "axios";

export default function Recurrence() {
  const getFromStorage = (key) => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
  };

  const setToStorage = (key, value) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  };

  const translateId = {
    SA: {
      hub_id: "ef607668-a51a-4ea6-8b7b-dab07e0ab151",
      queue_id: "633f0132403c133d88b9832b",
      leaderboard_id: "6346d436feeb182ac0852df8",
    },
    CSA: {
      hub_id: "81752520-7bad-42a7-a70d-d43fd66011de",
      queue_id: "6340418ad7689d5091584220",
      leaderboard_id: "634967c64c180a16e15ded04",
    },
    NA: {
      hub_id: "748cf78c-be73-4eb9-b131-21552f2f8b75",
      queue_id: "5ec3276bf69bec00070a854b",
      leaderboard_id: "6337441ebb87d174a4e7e8f1",
    },
    CNA: {
      hub_id: "b6895a52-a70c-41d6-b096-7d05377720c4",
      queue_id: "5aa05432f4ae3d0007e9e0c8",
      leaderboard_id: "633741aff6d76e5b1c1911e6",
    },
    EU: {
      hub_id: "74caad23-077b-4ef3-8b1d-c6a2254dfa75",
      queue_id: "5a200f64aa4cb20006161700",
      leaderboard_id: "6335bf42bb87d174a4d9bbf8",
    },
    CEU: {
      hub_id: "fd5780d5-dd2f-4479-906c-57b8e41ae9d7",
      queue_id: "5a200f62aa4cb200061616fe",
      leaderboard_id: "6335c033f6d76e5b1c0ae062",
    },
  };

  const [entity, setEntity] = useState(
    translateId[getFromStorage("hub_selected")] || translateId.SA
  );
  const [matches, setMatches] = useState([]);

  const handleSelectHub = (hub) => {
    setToStorage("hub_selected", hub);
    setEntity(translateId[hub]);
  };

  const getMatches = () => {
    axios.get(`/api/matches/history/${entity.hub_id}`).then((res) => {
      setMatches(res.data.payload);
    });
  };

  useEffect(() => {
    getMatches();
  }, [entity.hub_id, entity.queue_id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>WatchFPL Admin - Recurrence</title>
      </Head>
      <main className={styles.main}>
        <select
          onChange={(e) => handleSelectHub(e.target.value)}
          value={
            getFromStorage("hub_selected") ||
            "ef607668-a51a-4ea6-8b7b-dab07e0ab151"
          }
          className="text-4xl font-play font-bold mb-4 text-center select select-ghost w-fit"
        >
          <option className="text-base font-play font-bold" value="SA">
            FPL CSGO South America
          </option>
          <option className="text-base font-play font-bold" value="CSA">
            FPL C CSGO South America
          </option>
          <option className="text-base font-play font-bold" value="EU">
            FPL CSGO Europe
          </option>
          <option className="text-base font-play font-bold" value="CEU">
            FPL C CSGO Europe
          </option>
          <option className="text-base font-play font-bold" value="NA">
            FPL CSGO North America
          </option>
          <option className="text-base font-play font-bold" value="CNA">
            FPL C CSGO North America
          </option>
        </select>
        <div className="overflow-x-auto w-full">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Period</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          className="font-base max-w-fit"
          href="https://github.com/Conrage"
          target="blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className="ml-1 font-semibold text-blue-500">Crazynn</span>
        </a>
        <a
          target="blank"
          className="font-base p-2 max-w-fit h-fit rounded-lg bg-white"
          href="https://github.com/Conrage/watch-fpl"
        >
          <img className="h-6" src="/github.png"></img>
        </a>
      </footer>
    </div>
  );
}
