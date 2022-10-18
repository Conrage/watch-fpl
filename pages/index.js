import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";

export default function Home() {
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
    },
    CSA: {
      hub_id: "81752520-7bad-42a7-a70d-d43fd66011de",
      queue_id: "6340418ad7689d5091584220",
    },
    NA: {
      hub_id: "748cf78c-be73-4eb9-b131-21552f2f8b75",
      queue_id: "5ec3276bf69bec00070a854b",
    },
    CNA: {
      hub_id: "b6895a52-a70c-41d6-b096-7d05377720c4",
      queue_id: "5aa05432f4ae3d0007e9e0c8",
    },
    EU: {
      hub_id: "74caad23-077b-4ef3-8b1d-c6a2254dfa75",
      queue_id: "5a200f64aa4cb20006161700",
    },
    CEU: {
      hub_id: "fd5780d5-dd2f-4479-906c-57b8e41ae9d7",
      queue_id: "5a200f62aa4cb200061616fe",
    },
  };
  const [streamers, setStreamers] = useState([]);
  const [queue, setQueue] = useState([]);
  const [matches, setMatches] = useState([]);
  const [entity, setEntity] = useState(
    translateId[getFromStorage("hub_selected")] || translateId.SA
  );

  const handleSelectHub = (hub) => {
    setToStorage("hub_selected", hub);
    setEntity(translateId[hub]);
  };

  const getQueues = () => {
    axios.get(`/api/queue/${entity.queue_id}`).then((res) => {
      setQueue(res.data.payload);
    });
  };

  const getStreamers = () => {
    axios.get(`/api/streamers/${entity.hub_id}`).then((res) => {
      setStreamers(res.data.results);
    });
  };

  const getMatches = () => {
    axios.get(`/api/matches/${entity.hub_id}`).then((res) => {
      setMatches(res.data.payload);
    });
  };

  const verifyStream = (player) => {
    const playerStreaming = streamers.filter((stream) => {
      return stream.profile.id == player.id;
    });

    return playerStreaming[0];
  };

  const getMap = (maps, pick) => {
    const map = maps?.filter((map) => {
      return map.class_name == pick;
    })[0];

    return map;
  };

  const verifyResult = (score1, score2) => {
    if (score1 == score2) {
      return "stat-value text-gray-400 font-semibold text-4xl";
    } else if (score1 > score2) {
      return "stat-value text-green-500 font-semibold text-4xl";
    }

    return "stat-value text-red-500 font-semibold text-4xl";
  };

  useEffect(() => {
    getMatches();
    getStreamers();
    getQueues();
  }, [entity.hub_id, entity.queue_id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>FPL Live Matches</title>
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
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="badge badge-accent font-bold font-play bg-orange-600 border-orange-600">
            {matches.length} LIVE MATCH{matches.length != 1 ? "ES" : ""}
          </div>
          <div className="dropdown dropdown-hover dropdown-center">
            <label
              tabIndex="0"
              className="badge font-bold font-play badge-primary mb-2"
            >
              {queue.length} PLAYERS ON QUEUE
            </label>
            <ul
              tabIndex="0"
              className="dropdown-content menu text-center p-2 shadow bg-base-100 rounded-box w-full"
            >
              {queue.map((player) => {
                return (
                  <li key={player.nickname}>
                    <a
                      href={`https://www.faceit.com/pt/players/${player.nickname}`}
                      target="_blank"
                      className="p-2 font-red-hat font-semibold text-gray-300"
                    >
                      {player.nickname}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="w-full gap-8 items-center flex flex-col">
          {matches.map((match) => {
            return (
              <div
                key={match.id}
                className="card rounded-lg max-w-4xl w-full bg-card"
              >
                <div className="card-bg flex absolute w-full h-full">
                  <figure>
                    <img
                      src={match.teams.faction1.avatar}
                      alt={match.teams.faction1.name}
                    />
                  </figure>
                  <figure>
                    <img
                      src={match.teams.faction2.avatar}
                      alt={match.teams.faction2.name}
                    />
                  </figure>
                </div>
                <div className="p-4 px-8 pb-8 card-body">
                  <div className="relative">
                    <div className="flex justify-center mb-4 w-full gap-8">
                      <h2 className="w-1/2 mr-auto flex items-center font-red-hat text-2xl gap-2 text-white font-medium">
                        {match.teams.faction1.name}
                      </h2>
                      <div className="score flex gap-2 pt-1 pb-2 px-4 rounded-lg font-semibold text-3xl align-middle">
                        <div
                          className={verifyResult(
                            match.summaryResults?.factions.faction1.score,
                            match.summaryResults?.factions.faction2.score
                          )}
                        >
                          {match.summaryResults?.factions.faction1.score < 10
                            ? `0${match.summaryResults?.factions.faction1.score}`
                            : match.summaryResults?.factions.faction1.score}
                        </div>
                        :
                        <div
                          className={verifyResult(
                            match.summaryResults?.factions.faction2.score,
                            match.summaryResults?.factions.faction1.score
                          )}
                        >
                          {match.summaryResults?.factions.faction2.score < 10
                            ? `0${match.summaryResults?.factions.faction2.score}`
                            : match.summaryResults?.factions.faction2.score}
                        </div>
                      </div>
                      <h2 className="w-1/2 ml-auto justify-end flex text-2xl font-red-hat items-center gap-2 text-white font-medium">
                        {match.teams.faction2.name}
                      </h2>
                    </div>
                    <div className="w-full h-fit flex justify-center">
                      <div className="map-card h-fit p-1 rounded-lg flex items-center justify-center w-52 image-full">
                        <figure>
                          <img
                            src={
                              getMap(
                                match.voting?.map.entities,
                                match.voting?.map.pick
                              )?.image_lg
                            }
                            className="rounded-lg"
                            alt={match.voting?.map.pick}
                          />
                        </figure>
                        <div className="map-card-body h-8 flex items-center justify-center">
                          <h2 className="text-gray-200 font-play text-base mx-auto">{match.voting?.map.pick}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4">
                      {match.teams.faction1.roster.map((player) => {
                        return (
                          <div
                            key={player.id}
                            className="flex h-10 gap-2 items-center"
                          >
                            <div className="avatar">
                              <div
                                className={
                                  verifyStream(player)
                                    ? "w-8 h-fit rounded-full border-purple-500 border-2"
                                    : "w-8 border-2 border-white h-fit rounded-full"
                                }
                              >
                                <img src={player.avatar} />
                              </div>
                            </div>
                            <div className="flex flex-col font-play text-gray-400 font-medium text-base">
                              {player.nickname}
                              {verifyStream(player) ? (
                                <a
                                  className="flex items-center"
                                  target="blank"
                                  href={verifyStream(player).stream.channel_url}
                                >
                                  <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                    {verifyStream(player).stream.channel_name}
                                    <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                      <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                        person
                                      </span>
                                      {verifyStream(player).stream.viewers}
                                    </div>
                                  </span>
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex flex-col gap-4 items-end">
                      {match.teams.faction2.roster.map((player) => {
                        return (
                          <div
                            key={player.id}
                            className="flex p-1 h-10 gap-2 items-center"
                          >
                            <div className="flex flex-col font-play items-end font-medium text-gray-400 text-base">
                              {player.nickname}
                              {verifyStream(player) ? (
                                <a
                                  className="flex items-center"
                                  target="blank"
                                  href={verifyStream(player).stream.channel_url}
                                >
                                  <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                    <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                      {verifyStream(player).stream.viewers}
                                      <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                        person
                                      </span>
                                    </div>
                                    {verifyStream(player).stream.channel_name}
                                  </span>
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="avatar">
                              <div
                                className={
                                  verifyStream(player)
                                    ? "w-8 h-fit rounded-full border-purple-500 border-2"
                                    : "w-8 border-2 border-white h-fit rounded-full"
                                }
                              >
                                <img src={player.avatar} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
