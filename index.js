const axios = require("axios").default
const cheerio = require("cheerio")

function get_match_scores() {
    axios.get("https://www.espncricinfo.com/live-cricket-score")
    .then((response) => {
        let matches = []
        const $ = cheerio.load(response.data)
        const latest_match = $("span:contains('Top Events')").parent().parent().parent().next().children(0).children().toArray().forEach((match) => {
            let match_data = match.firstChild.firstChild.firstChild.nextSibling.lastChild.childNodes;
            let match_info = {
                "time": match_data[0].firstChild.firstChild.firstChild.firstChild.nodeValue,
                "match_name": cheerio.load(match_data[1]).text(),
                "teams_and_scores": [],
            }
            team_data = cheerio.load(match_data[1])("div.ci-team-score").children().toArray();
            if (team_data.length <= 2) {
                team_data.forEach((team_info) => {
                    match_info.teams_and_scores.push(cheerio.load(team_info).text());
                });
            }
            else {
                team_1 = `${cheerio.load(team_data[0]).text()} ${cheerio.load(team_data[1]).text()}`;
                team_2 = `${cheerio.load(team_data[2]).text()} ${cheerio.load(team_data[3]).text()}`;
                match_info.teams_and_scores.push(team_1);
                match_info.teams_and_scores.push(team_2);
            }
            match_info.result = cheerio.load(match_data[1]).text()
            matches.push(match_info)
        });
        console.log(matches)
        return matches;
    });
}

module.exports = get_match_scores;