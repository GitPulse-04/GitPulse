import React, { useEffect, useState } from "react";
import styles from "./CommitKing.module.css";
import challengeImage from "../assets/challenge-visual.png";
import goldmedal from "../assets/gold.png";
import silvermedal from "../assets/silver.png";
import bronzemedal from "../assets/bronze.png";
import {
  getAllParticipants,
  joinChallenge,
  leaveChallenge,
  getUserFromJWT,
} from "../apis/Challenge.js";
import { getMonthlyCommitCount } from "../apis/github";
import RepoRankcopy from "./RepoRankcopy";

const CommitKingOnly = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [topCommitUser, setTopCommitUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // 추가

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        const user = getUserFromJWT();

        const withCommitCounts = await Promise.all(
          data.map(async (p) => {
            const count = await getMonthlyCommitCount(p.githubId);
            return { ...p, commitCount: count };
          })
        );

        setParticipants(withCommitCounts);

        if (user) {
          const isUserJoined = withCommitCounts.some(
            (p) => p.githubId === user.login
          );
          setIsJoined(isUserJoined);

          const sorted = [...withCommitCounts].sort(
            (a, b) => b.commitCount - a.commitCount
          );
          const current = sorted.find((p) => p.githubId === user.login);
          const rank = sorted.findIndex((p) => p.githubId === user.login) + 1;

          setCurrentUser(current);
          setCurrentUserRank(rank);
          setTopCommitUser(sorted[0]);
        }
      } catch (e) {
        console.error(e);
        alert("❌ 참여자 목록 불러오기 실패");
      }
    };

    load();
  }, []);

  const handleUserClick = (githubId) => {
    setSelectedUser(githubId);
  };

  const handleJoin = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후 참여 가능합니다.");
      return;
    }

    try {
      await joinChallenge({ githubId: user.login, type: "commit" });
      alert("✅ 커밋왕 참여 완료!");

      const userCommitCount = await getMonthlyCommitCount(user.login);
      const newUser = { githubId: user.login, commitCount: userCommitCount };

      const existing = await getAllParticipants();
      const othersWithCounts = await Promise.all(
        existing.map(async (p) => {
          const count = await getMonthlyCommitCount(p.githubId);
          return { ...p, commitCount: count };
        })
      );

      const alreadyExists = othersWithCounts.some(
        (p) => p.githubId === user.login
      );
      const updatedList = alreadyExists
        ? othersWithCounts
        : [...othersWithCounts, newUser];

      const sorted = updatedList.sort((a, b) => b.commitCount - a.commitCount);
      const rank = sorted.findIndex((p) => p.githubId === user.login) + 1;

      setParticipants(sorted);
      setIsJoined(true);
      setCurrentUser(newUser);
      setCurrentUserRank(rank);
      setTopCommitUser(sorted[0]);
    } catch (e) {
      alert("⚠️ 이미 참여했거나 오류가 발생했습니다.");
    }
  };

  const handleLeave = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후만 가능합니다.");
      return;
    }

    try {
      await leaveChallenge(user.login, "commit");
      alert("참여 취소 완료!");

      const data = await getAllParticipants();
      const withCommitCounts = await Promise.all(
        data.map(async (p) => {
          const count = await getMonthlyCommitCount(p.githubId);
          return { ...p, commitCount: count };
        })
      );

      const updatedList = withCommitCounts.filter(
        (p) => p.githubId !== user.login
      );

      const sorted = updatedList.sort((a, b) => b.commitCount - a.commitCount);

      setParticipants(sorted);
      setIsJoined(false);
      setCurrentUser(null);
      setCurrentUserRank(null);
      setTopCommitUser(sorted[0] ?? null);
      setSelectedUser(null); // 참여취소 시 RepoRankcopy 안보이게
    } catch (e) {}
  };

  const commitParticipants = [...participants]
    .filter((p) => p.commitCount > 0)
    .sort((a, b) => b.commitCount - a.commitCount);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.contentBox} ${!isJoined ? styles.blurred : ""}`}
      >
        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>Commit's Challenge</p>
          </div>

          <ul className={styles.repoList}>
            {commitParticipants.map((p, index) => {
              const medal =
                index === 0
                  ? goldmedal
                  : index === 1
                  ? silvermedal
                  : index === 2
                  ? bronzemedal
                  : null;

              return (
                <li
                  key={p.githubId}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 0",
                    position: "relative",
                  }}
                >
                  {/* 왼쪽: 메달 or 등수 */}
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      display: "flex",
                      alignItems: "center",
                      width: "100px",
                      justifyContent: "flex-start",
                    }}
                  >
                    {medal ? (
                      <img
                        src={medal}
                        alt={`${index + 1}위`}
                        style={{ width: "24px", verticalAlign: "middle" }}
                      />
                    ) : (
                      <span>{index + 1}위</span>
                    )}
                  </div>

                  {/* 가운데: GitHub ID */}
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      minWidth: "200px",
                      cursor: "pointer",
                      color:
                        selectedUser === p.githubId ? "#1976d2" : "inherit",
                      textDecoration:
                        selectedUser === p.githubId ? "underline" : "none",
                    }}
                    onClick={() => handleUserClick(p.githubId)}
                  >
                    {p.githubId}
                  </div>

                  {/* 오른쪽: 커밋 수 */}
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      width: "100px",
                      textAlign: "right",
                    }}
                  >
                    {p.commitCount ?? 0}회
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>

      {!isJoined && (
        <div className={styles.joinOverlay}>
          <div className={styles.joinBox}>
            <p className={styles.title}>Commit's Challenge</p>
            <img src={challengeImage} alt="챌린지 대표 이미지" />
            <button className={styles.joinButton} onClick={handleJoin}>
              참가하기
            </button>
          </div>
        </div>
      )}

      {isJoined && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className={styles.joinButton} onClick={handleLeave}>
            참여 취소
          </button>
        </div>
      )}

      {/* 아래에 RepoRankcopy 추가 */}
      {selectedUser && (
        <div style={{ marginTop: 40 }}>
          <RepoRankcopy selectedUser={selectedUser} />
        </div>
      )}
    </div>
  );
};

export default CommitKingOnly;
