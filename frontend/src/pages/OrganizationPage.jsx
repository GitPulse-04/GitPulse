import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import css from "./ProfilePage.module.css";
import orgs from "./OrganizationPage.module.css";
import Header from "../components/Header";
import { useOrgsInfo, useOrgsRepos } from "../apis/useOrganizationApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ReactMarkdown from "react-markdown";

const OrganizationPage = () => {
  const { name } = useParams();
  const { data, isLoading, isError } = useOrgsInfo(name);
  const members = data?.members;
  const repos = data?.repos;

  const [selected, setSelected] = useState("");
  const [commitCounts, setCommitCounts] = useState([]);
  const [topCommit, setTopCommit] = useState({});
  const {
    data: commits,
    isRepoLoading,
    isRepoError,
  } = useOrgsRepos(name, selected);

  const commit = commits?.commit;
  const pulls = Array.isArray(commits?.pulls) ? commits.pulls[0] : null;

  console.log(pulls);
  useEffect(() => {
    if (repos && repos.length > 0) {
      setSelected(repos[0].name);
    }
  }, [repos]);

  const curUserLogin = localStorage.getItem("username");

  useEffect(() => {
    if (!commit || !curUserLogin) return;

    // 현재 UTC 기준 일요일 날짜 계산
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // 시간 초기화

    // 일요일 ~ 토요일 배열
    const dateArray = [...Array(7)].map((_, i) => {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    // 초기값 0
    const commitCountByDay = dateArray.reduce((acc, dateStr) => {
      acc[dateStr] = { total: 0, mine: 0 };
      return acc;
    }, {});

    const userCommitMap = {}; // 💡 사용자별 커밋 수

    // 커밋 수 계산
    commit.forEach((commit) => {
      const dateStr = new Date(commit.commit.author.date)
        .toISOString()
        .split("T")[0];

      const authorLogin =
        commit.author?.login || commit.commit.author?.name || "anonymous";

      if (commitCountByDay[dateStr]) {
        commitCountByDay[dateStr].total += 1;

        if (authorLogin === curUserLogin) {
          commitCountByDay[dateStr].mine += 1;
        }
        userCommitMap[authorLogin] = (userCommitMap[authorLogin] || 0) + 1;
      }
    });
    console.log(commitCountByDay);
    setCommitCounts(commitCountByDay);

    const topCommitter = Object.entries(userCommitMap).reduce(
      (acc, [author, count]) => {
        return count > acc.count ? { author, count } : acc;
      },
      { author: "", count: 0 }
    );

    console.log("일주일간 가장 많이 커밋한 사람:", topCommitter);
    setTopCommit(topCommitter);

    setCommitCounts(commitCountByDay);
  }, [commit, curUserLogin]);

  if (isLoading || isRepoLoading) return <p>Loading...</p>;
  if (isError || isRepoError) return <p>에러 발생!</p>;

  const chartData = Object.entries(commitCounts).map(([date, counts]) => ({
    name: date,
    total: counts.total,
    mine: counts.mine,
  }));

  return (
    <div className={css.container}>
      <main className={css.main}>
        {/* 헤더영역  + desc 추가 예정 */}
        <Header name={name} />
        <div className={css.contentContainer}>
          {/* orgs info 영역 */}
          <section className={css.profileStats}>
            <div className={css.card}>
              <i className="bi bi-cloud-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>현재 레포지토리</p>
                <select
                  className={orgs.repoSelect}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  {repos?.map((item, index) =>
                    item?.name ? (
                      <option
                        className={orgs.cardValue}
                        key={index}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    ) : null
                  )}
                </select>
              </div>
            </div>
            <div className={css.card}>
              <i className="bi bi-person-fill-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Members</p>
                <p className={css.cardValue}>{members?.length}</p>
              </div>
            </div>

            <div className={css.card}>
              <i className="bi bi-person-heart"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Public Repos</p>
                <p className={css.cardValue}>{repos?.length}</p>
              </div>
            </div>
          </section>

          {/* 커밋 graph 영역 */}
          <section className={orgs.contributions}>
            <h4>Week</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#5f41b2"
                  name="전체 커밋 수"
                />
                <Line
                  type="monotone"
                  dataKey="mine"
                  stroke="#DADEE3"
                  name="내 커밋 수"
                />
              </LineChart>
            </ResponsiveContainer>
          </section>

          {/* 최근 PR, 최근 commit */}
          <section className={orgs.RecentlyCon}>
            <div className={orgs.RecentlyItem}>
              <h3>따끈따끈 PR 소식</h3>
              {pulls && (
                <div className={orgs.RecentPRItem}>
                  <div>{pulls.title}</div>
                  <div>{pulls.user.login}</div>
                  <div>
                    <ReactMarkdown>{pulls.body}</ReactMarkdown>
                  </div>
                  <div>{pulls.created_at}</div>
                </div>
              )}
            </div>
            <div className={orgs.RecentlyItem}>
              <h3>이번 주 MVP</h3>
              <div className={orgs.RankingItem}>
                {topCommit && (
                  <>
                    <div>{topCommit.author}</div>
                    <img src="/img/topCommit.png" />
                    <div>
                      {topCommit.author}님의 이번주 커밋 수는{" "}
                      <strong>{topCommit.count}</strong>번 입니다
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* repo & 그래프 영역 */}
          <section className={css.bottom}>
            {/* repo table */}
            <div className={css.repoTable}>
              <h4>repo</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Review</th>
                    <th>Recently Commit</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>repo-name</td>
                    <td>32</td>
                    <td>2025.05.06</td>
                    <td>2025.03.06</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrganizationPage;
