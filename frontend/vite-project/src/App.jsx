import React, { useEffect, useState } from "react";
import "./App.css"; // スタイル適用

const API_URL = "http://localhost:3000/api/latest-matches"; // データ取得API

const App = () => {
  const [upcomingMatches, setUpcomingMatches] = useState([]); // これから始まる試合
  const [pastMatches, setPastMatches] = useState([]); // 過去の試合

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data || !data.upcomingMatches || !data.pastMatches) {
          throw new Error("データの形式が正しくありません");
        }

        setUpcomingMatches(data.upcomingMatches);
        setPastMatches(data.pastMatches);
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchMatches();
  }, []);

  const convertToJST = (utcDate) => {
    const date = new Date(utcDate);
    const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return jstDate.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
  };

  return (
    <div className="all">
          <div className="container">
      <h1 className="title">試合情報</h1>

      {/* これから始まる試合 */}
      <h2>これから始まる試合</h2>
      <div className="match-list">
        {upcomingMatches.map((match, index) => (
          <div key={index} className="match-container">
            <p className="date-text">{convertToJST(match.date)}</p>
            <div className="team-container">
              <div className="team">
                <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="logo" />
                <p className="team-name">{match.homeTeam.name}</p>
              </div>
              <p className="score-text">VS</p>
              <div className="team">
                <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="logo" />
                <p className="team-name">{match.awayTeam.name}</p>
              </div>
            </div>
            {/* 勝敗予想ボタン */}
            <div className="predict-buttons">
              <button>🏠 ホーム勝利</button>
              <button>⚖️ 引き分け</button>
              <button>🏃‍♂️ アウェイ勝利</button>
            </div>
          </div>
        ))}
      </div>

      {/* 過去の試合 */}
      <h2>過去の試合</h2>
      <div className="match-list">
        {pastMatches.length > 0 ? (
          pastMatches.map((match, index) => (
            <div key={index} className="match-container">
              <p className="date-text">{convertToJST(match.date)}</p>
              <div className="team-container">
                <div className="team">
                  <img src={match.homeTeam.crest} alt={match.homeTeam.name} className="logo" />
                  <p className="team-name">{match.homeTeam.name}</p>
                </div>
                <p className="score-text">{match.score.home} - {match.score.away}</p>
                <div className="team">
                  <img src={match.awayTeam.crest} alt={match.awayTeam.name} className="logo" />
                  <p className="team-name">{match.awayTeam.name}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>過去の試合はありません</p>
        )}
      </div>
    </div>
    </div>

  );
};

export default App;
