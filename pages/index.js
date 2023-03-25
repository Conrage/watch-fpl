import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import axios from "axios";
import MatchCard from "../components/MatchCard";

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
    CS2: {
      hub_id: "e63afec5-b332-425f-943b-2f138c01c6d5",
      queue_id: "6329ce275606951a1bd271b2",
    },
    SA: {
      hub_id: "ef607668-a51a-4ea6-8b7b-dab07e0ab151",
      queue_id: "633f0132403c133d88b9832b",
    },
    CSA: {
      hub_id: "81752520-7bad-42a7-a70d-d43fd66011de",
      queue_id: "6340418ad7689d5091584220",
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
  const [ranking, setRanking] = useState({});
  const [entity, setEntity] = useState(translateId.SA);

  const handleSelectHub = (hub) => {
    setEntity(translateId[hub]);
  };

  const getRanking = () => {
    axios.get(`/api/rankings/${entity.hub_id}`).then((res) => {
      setRanking(res.data.payload);
    });
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

  const verifyStream = (id) => {
    const playerStreaming = streamers.filter((stream) => {
      return stream.profile.id == id;
    });

    return playerStreaming[0];
  };


  const updateStats = () => {
    getMatches();
    getStreamers();
    getQueues();
    getRanking();
  };

  const formatDate = (date) => {
    if (!date) return "";
    var today = new Date(date); // yyyy-mm-dd

    var month = today
      .toLocaleString("default", { month: "short" })
      .replace(".", "");
    month = month.charAt(0).toUpperCase() + month.slice(1);
    var day = today.getDate();
    return month + " " + day;
  };

  useEffect(() => {
    updateStats();
  }, [entity.hub_id, entity.queue_id]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Watch FPL</title>
      </Head>
      <main className={styles.main}>
        <img src="/logo.png" className="h-14 mt-2 mx-auto"></img>
        <h1 className="font-red-hat text-3xl font-bold text-gray-100 mr-auto mt-8">
          Choose a hub
        </h1>
        <div className="px-4 py-4 gap-4 flex w-full mt-6 overflow-x-auto">
          <img
            onClick={() => setEntity(translateId.CS2)}
            src="/FACEITCS2.png"
            className={`hub-card ${
              entity.hub_id == translateId.CS2.hub_id
                ? "!scale-105 !border-opacity-100 !border-indigo-500"
                : ""
            }`}
          ></img>
          <img
            onClick={() => setEntity(translateId.SA)}
            src="/FPLSA.png"
            className={`hub-card ${
              entity.hub_id == translateId.SA.hub_id
                ? "!scale-105 !border-opacity-100 !border-indigo-500"
                : ""
            }`}
          ></img>
          <img
            onClick={() => setEntity(translateId.CSA)}
            src="/FPLSAC.png"
            className={`hub-card ${
              entity.hub_id == translateId.CSA.hub_id
                ? "!scale-105 !border-opacity-100 !border-indigo-500"
                : ""
            }`}
          ></img>
          <img
            onClick={() => setEntity(translateId.EU)}
            src="/FPLEU.png"
            className={`hub-card ${
              entity.hub_id == translateId.EU.hub_id
                ? "!scale-105 !border-opacity-100 !border-indigo-500"
                : ""
            }`}
          ></img>
          <img
            onClick={() => setEntity(translateId.CEU)}
            src="/FPLEUC.png"
            className={`hub-card ${
              entity.hub_id == translateId.CEU.hub_id
                ? "!scale-105 !border-opacity-100 !border-indigo-500"
                : ""
            }`}
          ></img>
        </div>
        {/* <div className="select-header flex gap-2">
          <select
            onChange={(e) => handleSelectHub(e.target.value)}
            value={
              getFromStorage("hub_selected") ||
              "ef607668-a51a-4ea6-8b7b-dab07e0ab151"
            }
            className="text-4xl font-play font-bold mb-4 text-center select select-ghost w-fit"
          >
            <option className="text-base font-play font-bold" value="CS2">
              FACEIT CS2 10mans
            </option>
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
          </select>
          <label htmlFor="my-modal" className="ranking-mobile btn modal-button">
            SEE RANKING
          </label>
        </div> */}
        <div className="flex items-center gap-2 mt-6 mb-8 w-full">
          <div className="font-play flex items-center gap-1 text-lg font-medium text-gray-200">
            Currently Matches -{" "}
            <span className="font-bold text-1xl text-indigo-500">
              {matches.length}
            </span>
          </div>
          <div className="dropdown dropdown-hover dropdown-center">
            <label
              tabIndex="0"
              className="badge font-bold font-play badge-primary rounded-sm"
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
                      target="blank"
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
        <div className="content w-full flex mt-6">
          {/* <div className="ranking max-w-fit col-start-1 col-end-3">
            <div className="text-2xl font-play font-bold mb-4 w-fit">
              Ranking{" "}
              <span className="ml-4 stat-desc text-lg font-medium">{` ${formatDate(
                ranking.leaderboard?.start_date
              )} - ${formatDate(ranking.leaderboard?.end_date)}`}</span>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.rankings?.slice(0, 10).map((player) => {
                    return (
                      <tr key={player.position}>
                        <td>{player.position}</td>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="avatar">
                              <div
                                className={
                                  verifyStream(player.placement.entity_id)
                                    ? "mask mask-squircle w-8 h-8 rounded-full border-purple-500 border-2"
                                    : "mask mask-squircle w-8 h-8 rounded-full"
                                }
                              >
                                <img
                                  src={player.placement.entity_avatar}
                                  alt="Player image"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium font-play text-sm">
                                {player.placement.entity_name}
                              </div>
                              {verifyStream(player.placement.entity_id) ? (
                                <a
                                  className="flex items-center"
                                  target="blank"
                                  href={
                                    verifyStream(player.placement.entity_id)
                                      .stream.channel_url
                                  }
                                >
                                  <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                    {
                                      verifyStream(player.placement.entity_id)
                                        .stream.channel_name
                                    }
                                    <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                      <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                        person
                                      </span>
                                      {
                                        verifyStream(player.placement.entity_id)
                                          .stream.viewers
                                      }
                                    </div>
                                  </span>
                                </a>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </td>
                        <th>
                          {player.prizes[0]?.image_url ? (
                            <img
                              className="h-6 min-w-fit"
                              src={player.prizes[0]?.image_url}
                            ></img>
                          ) : (
                            <div className="font-normal">
                              <span className="text-orange-600 font-play font-bold mr-2">
                                F
                              </span>
                              {player.prizes[0]?.faceit_points}
                            </div>
                          )}
                        </th>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div> */}
          <div className="flex flex-col gap-12">
            {matches.map((match) => {
              return (
                <MatchCard match={match} streamers={streamers}></MatchCard>
              );
            })}
          </div>
        </div>
        <input type="checkbox" id="my-modal" className="modal-toggle" />
        {/* <div className="modal">
          <div className="modal-box bg-main relative">
            <label
              htmlFor="my-modal"
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>
            <div>
              <div className="text-2xl font-play font-bold mb-4 w-fit">
                Ranking{" "}
                <span className="ml-4 stat-desc text-lg font-medium">{` ${formatDate(
                  ranking.leaderboard?.start_date
                )} - ${formatDate(ranking.leaderboard?.end_date)}`}</span>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.rankings?.slice(0, 10).map((player) => {
                      return (
                        <tr key={player.position}>
                          <td>{player.position}</td>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="avatar">
                                <div
                                  className={
                                    verifyStream(player.placement.entity_id)
                                      ? "mask mask-squircle w-8 h-8 rounded-full border-purple-500 border-2"
                                      : "mask mask-squircle w-8 h-8 rounded-full"
                                  }
                                >
                                  <img
                                    src={player.placement.entity_avatar}
                                    alt="Player image"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-medium font-play text-sm">
                                  {player.placement.entity_name}
                                </div>
                                {verifyStream(player.placement.entity_id) ? (
                                  <a
                                    className="flex items-center"
                                    target="blank"
                                    href={
                                      verifyStream(player.placement.entity_id)
                                        .stream.channel_url
                                    }
                                  >
                                    <span className="flex gap-2 font-medium text-purple-500 hover:font-bold">
                                      {
                                        verifyStream(player.placement.entity_id)
                                          .stream.channel_name
                                      }
                                      <div className="mb-auto gap-1 text-red-500 font-medium flex items-center">
                                        <span className="text-red-500 text-base font-bold material-symbols-outlined">
                                          person
                                        </span>
                                        {
                                          verifyStream(
                                            player.placement.entity_id
                                          ).stream.viewers
                                        }
                                      </div>
                                    </span>
                                  </a>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </td>
                          <th>
                            {player.prizes[0]?.image_url ? (
                              <img
                                className="h-6 min-w-fit"
                                src={player.prizes[0]?.image_url}
                              ></img>
                            ) : (
                              <div className="font-normal">
                                <span className="text-orange-600 font-play font-bold mr-2">
                                  F
                                </span>
                                {player.prizes[0]?.faceit_points}
                              </div>
                            )}
                          </th>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-action">
              <label htmlFor="my-modal" className="btn">
                CLOSE
              </label>
            </div>
          </div>
        </div> */}
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
        <div className="font-base flex gap-2 h-6">
          <img className="h-6" src="/PIX.png"></img> jvococonrad@gmail.com
        </div>
      </footer>
    </div>
  );
}
