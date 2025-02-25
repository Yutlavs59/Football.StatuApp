const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const port = 3000;
// const API_URL = 'http://api.football-data.org/v4/matches';
const API_KEY = 'f36c0c8d22924502a36ff619a7138ad1';

app.use(cors());

const API_URL = "https://api.football-data.org/v4/competitions/PL/matches"; // プレミアリーグ

app.get('/api/latest-matches', async (req, res) => {
    try {
        const response = await axios.get(API_URL, {
            headers: { 'X-Auth-Token': API_KEY },
        });

        const matches = response.data.matches;

        if (!matches || matches.length === 0) {
            return res.status(404).json({ message: 'No matches found' });
        }

        const now = new Date();

        // 未来の試合 (upcomingMatches)
        const upcomingMatches = matches
            .filter(match => new Date(match.utcDate) > now)
            .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
            .slice(0, 5);

        // 過去の試合 (pastMatches)
        const pastMatches = matches
            .filter(match => new Date(match.utcDate) <= now && match.status === "FINISHED")
            .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate)) // 直近5試合を取得
            .slice(0, 5);

        res.json({
            upcomingMatches: upcomingMatches.map(match => ({
                date: match.utcDate,
                homeTeam: { name: match.homeTeam.name, crest: match.homeTeam.crest },
                awayTeam: { name: match.awayTeam.name, crest: match.awayTeam.crest },
                status: match.status
            })),
            pastMatches: pastMatches.map(match => ({
                date: match.utcDate,
                homeTeam: { name: match.homeTeam.name, crest: match.homeTeam.crest },
                awayTeam: { name: match.awayTeam.name, crest: match.awayTeam.crest },
                score: {
                    home: match.score?.fullTime?.home ?? "-",
                    away: match.score?.fullTime?.away ?? "-"
                },
                status: match.status
            }))
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch match data' });
    }
});


app.listen(port, () => {
    console.log(`サーバーは http://localhost:${port} で立ち上がりました`);
});
