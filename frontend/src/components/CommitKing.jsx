import { useEffect, useState } from "react";
import styles from "./CommitKing.module.css";
import challengeImage from "../assets/challenge-visual.png";
import {
  getAllParticipants,
  joinChallenge,
  leaveChallenge,
  getUserFromJWT,
} from "../apis/Challenge.js";

const CommitKing = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);

  // 초기 데이터 로드: 참가자 목록 + 사용자 참여 여부
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        setParticipants(data);

        const user = getUserFromJWT();
        if (user) {
          const isUserJoined = data.some((p) => p.githubId === user.login);
          setIsJoined(isUserJoined);
        }
      } catch (e) {
        alert("❌ 참여자 목록 불러오기 실패");
      }
    };

    load();
  }, []);

  const handleJoin = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후 참여 가능합니다.");
      return;
    }

    try {
      await joinChallenge({ githubId: user.login, type: "commit" });
      alert("✅ 챌린지 참여 완료!");
      const updated = await getAllParticipants();
      setParticipants(updated);
      setIsJoined(true);
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
      await leaveChallenge(user.login);
      alert("🚫 챌린지 참여 취소 완료!");
      const updated = await getAllParticipants();
      setParticipants(updated);
      setIsJoined(false);
    } catch (e) {
      alert("❌ 참여 취소 실패");
    }
  };

  return (
    <div className={styles.container}>
      {/* 메인 컨텐츠 (블러 처리) */}
      <div
        className={`${styles.contentBox} ${!isJoined ? styles.blurred : ""}`}
      >
        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>Commit King</p>
          </div>

          <ul className={styles.repoList}>
            {participants.map((p) => (
              <li key={p.githubId}>{p.githubId}</li>
            ))}
          </ul>

          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>

      {/* 참가 전 오버레이 */}
      {!isJoined && (
        <div className={styles.joinOverlay}>
          <div className={styles.joinBox}>
            <p className={styles.title}>Commit King</p>
            <img src={challengeImage} alt="챌린지 대표 이미지" />
            <button className={styles.joinButton} onClick={handleJoin}>
              참가하기
            </button>
          </div>
        </div>
      )}

      {/* 참가 중이면 취소 버튼 보여줌 */}
      {isJoined && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className={styles.joinButton} onClick={handleLeave}>
            🚫 참여 취소
          </button>
        </div>
      )}
    </div>
  );
};

export default CommitKing;
