const axios = require("axios").default;
const cheerio = require("cheerio");

function get_match_scores() {
  axios
    // .get("https://www.espncricinfo.com/live-cricket-score")
    .get("https://www.espncricinfo.com/live-cricket-match-results")
    .then((response) => {
      let matches = [];
      const $ = cheerio.load(response.data);
    //   $("span:contains('Shpageeza Cricket League')")
        // $("span:contains('Top Events')")
        $("span:contains('India tour of West Indies')")
        .parent()
        .parent()
        .parent()
        .next()
        .children(0)
        .children()
        .toArray()
        .forEach((match) => {
          let match_data =
            match.firstChild.firstChild.firstChild.nextSibling.lastChild
              .childNodes;

            let title = match_data[0].firstChild.firstChild.firstChild.firstChild
              .nodeValue
            let time = "";
            let matchStatus = ""; // UPCOMING, ABANDONED, COMPLETED, INPROGRESS, STUMPS
            if (title == "RESULT") {
                matchStatus = "COMPLETED";
                time = "";
            }
            else if (title == "ABANDONED") {
                matchStatus = "ABANDONED"
                time = "";
            } else if (title == "Live") {
                matchStatus = "INPROGRESS";
                time = "";
            } else {
                matchStatus = "UPCOMING";
                time = match_data[0].firstChild.firstChild.firstChild.firstChild
                  .nodeValue;
            }
        
          let match_info = {
            start_time: time,
            match_name: cheerio.load(match_data[1]).text(),
            teams: [],
            scores: [],
            matchStatus: matchStatus,
            winner: "",
          };

        let team_parent = cheerio
            .load(match_data[1])("div.ci-team-score");
        let team_data = team_parent.children().toArray();

          if (team_data.length <= 2) {
            team_data.forEach((team_info) => {
              match_info.teams.push(cheerio.load(team_info).text());
              // no scores
            });
          } else {
            team_1 = cheerio.load(team_data[0])
            score_1 = cheerio.load(team_data[1]).text()

            team_2 = cheerio.load(team_data[2])
            try {
                score_2 = cheerio.load(team_data[3]).text();
            } catch (e) {
                score_2 = "";
            }

            if (matchStatus == "COMPLETED") {
                console.log(team_parent.attr("class"));
                if (team_parent.attr("class").toString().includes("ds-opacity-50")) {  // FIRST TEAM
                    match_info.winner = team_2.text();
                } else {
                    match_info.winner = team_1.text();
                }
            }
            match_info.teams.push(team_1.text());
            match_info.teams.push(team_2.text());
            match_info.scores.push(score_1);
            match_info.scores.push(score_2);

          }
          match_info.result = cheerio.load(match_data[1]).text();
          matches.push(match_info);
        });
      console.log(matches);
      return matches;
    });
}

// module.exports = get_match_scores;

get_match_scores();