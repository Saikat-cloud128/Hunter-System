"use client";

import { useState, useEffect } from "react";

type StatKey = "STR" | "INT" | "DISC" | "ENG";

type Quest = {
  name: string;
  xp: number;
  stat: StatKey;
  completed: boolean;
};

type Notification = {
  id: number;
  message: string;
};

export default function Home() {
  const [xp, setXp] = useState(0);

  const [stats, setStats] = useState<Record<StatKey, number>>({
    STR: 5,
    INT: 5,
    DISC: 5,
    ENG: 5,
  });

  const [quests, setQuests] = useState<Quest[]>([]);

  const [newQuestName, setNewQuestName] = useState("");
  const [newQuestXp, setNewQuestXp] = useState("");
  const [selectedStat, setSelectedStat] = useState<StatKey>("STR");
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState("");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const maxXp = 100;

  const level = Math.floor(xp / maxXp) + 1;

  const power = stats.STR + stats.INT + stats.DISC + stats.ENG;

  const getRank = (p: number) =>
    p >= 800
      ? "Monarch"
      : p >= 500
      ? "S"
      : p >= 350
      ? "A"
      : p >= 200
      ? "B"
      : p >= 100
      ? "C"
      : p >= 50
      ? "D"
      : "E";

  const rank = getRank(power);

  type ThemeColors = {
    border: string;
    glow: string;
    accent: string;
    highlight: string;
    xpBar: string;
    buttonHover: string;
    notificationBorder: string;
    buttonBg: string;
  };

  const getTheme = (r: string): ThemeColors => {
    switch (r) {
      case "Monarch":
        return {
          border: "border-cyan-500",
          glow: "hover:shadow-[0_20px_80px_rgba(34,211,238,0.15)]",
          accent: "text-cyan-400",
          highlight: "text-cyan-300",
          xpBar: "bg-cyan-500",
          buttonHover: "hover:bg-cyan-900/40",
          notificationBorder: "border-cyan-700/30",
          buttonBg: "bg-cyan-700",
        };
      case "S":
        return {
          border: "border-yellow-500",
          glow: "hover:shadow-[0_20px_80px_rgba(234,179,8,0.15)]",
          accent: "text-yellow-400",
          highlight: "text-yellow-300",
          xpBar: "bg-yellow-500",
          buttonHover: "hover:bg-yellow-900/40",
          notificationBorder: "border-yellow-700/30",
          buttonBg: "bg-yellow-700",
        };
      case "A":
        return {
          border: "border-red-500",
          glow: "hover:shadow-[0_20px_80px_rgba(239,68,68,0.15)]",
          accent: "text-red-400",
          highlight: "text-red-300",
          xpBar: "bg-red-500",
          buttonHover: "hover:bg-red-900/40",
          notificationBorder: "border-red-700/30",
          buttonBg: "bg-red-700",
        };
      case "B":
        return {
          border: "border-purple-500",
          glow: "hover:shadow-[0_20px_80px_rgba(147,51,234,0.15)]",
          accent: "text-purple-400",
          highlight: "text-purple-300",
          xpBar: "bg-purple-500",
          buttonHover: "hover:bg-purple-900/40",
          notificationBorder: "border-purple-700/30",
          buttonBg: "bg-purple-700",
        };
      case "C":
        return {
          border: "border-blue-500",
          glow: "hover:shadow-[0_20px_80px_rgba(59,130,246,0.15)]",
          accent: "text-blue-400",
          highlight: "text-blue-300",
          xpBar: "bg-blue-500",
          buttonHover: "hover:bg-blue-900/40",
          notificationBorder: "border-blue-700/30",
          buttonBg: "bg-blue-700",
        };
      case "D":
        return {
          border: "border-green-500",
          glow: "hover:shadow-[0_20px_80px_rgba(34,197,94,0.15)]",
          accent: "text-green-400",
          highlight: "text-green-300",
          xpBar: "bg-green-500",
          buttonHover: "hover:bg-green-900/40",
          notificationBorder: "border-green-700/30",
          buttonBg: "bg-green-700",
        };
      default: // E Rank
        return {
          border: "border-zinc-500",
          glow: "hover:shadow-[0_20px_80px_rgba(113,113,122,0.15)]",
          accent: "text-zinc-400",
          highlight: "text-zinc-300",
          xpBar: "bg-zinc-500",
          buttonHover: "hover:bg-zinc-700/40",
          notificationBorder: "border-zinc-700/30",
          buttonBg: "bg-zinc-600",
        };
    }
  };

  const theme = getTheme(rank);

  const titleMap: Record<StatKey, string> = {
    STR: "The Strength Awakened",
    INT: "The Analyst",
    DISC: "The Disciplined One",
    ENG: "The Engineer Hunter",
  };

  const title = (() => {
    const entries = Object.entries(stats) as [StatKey, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const [topStat, topValue] = entries[0];

    if (topValue >= 15) {
      return titleMap[topStat];
    }

    return "Unawakened Hunter";
  })();

  const progress = ((xp % maxXp) / maxXp) * 100;

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedXp = localStorage.getItem("xp");
    const savedStats = localStorage.getItem("stats");
    const savedStreak = localStorage.getItem("streak");
    const savedLastCompletedDate = localStorage.getItem("lastCompletedDate");
    const savedLastResetDate = localStorage.getItem("lastResetDate");

    let initialQuests: Quest[] = [];
    let initialStreak = savedStreak ? Number(savedStreak) : 0;
    let initialLastCompleted = savedLastCompletedDate || "";

    // Daily Reset: Clear all quests at the start of a new day
    if (savedLastResetDate && savedLastResetDate !== today) {
      // New day detected - remove all quests completely
      initialQuests = [];
      localStorage.setItem("lastResetDate", today);
      // Preserve XP, Stats, Power, Rank, Hunter Title, Streak, Notifications
    } else if (!savedLastResetDate) {
      // First time setup
      localStorage.setItem("lastResetDate", today);
    } else {
      // Same day - restore existing quests from localStorage
      const savedQuests = localStorage.getItem("quests");
      if (savedQuests) {
        initialQuests = JSON.parse(savedQuests);
      }
    }

    // Streak logic: Reset if no quest completed yesterday
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (savedLastCompletedDate && savedLastCompletedDate !== today && savedLastCompletedDate !== yesterday) {
      initialStreak = 0;
    }

    setQuests(initialQuests);

    if (savedXp) {
      setXp(Number(savedXp));
    }

    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }

    setStreak(initialStreak);
    setLastCompletedDate(initialLastCompleted);
  }, []);

  useEffect(() => {
    localStorage.setItem("quests", JSON.stringify(quests));
    localStorage.setItem("xp", xp.toString());
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("streak", streak.toString());
    localStorage.setItem("lastCompletedDate", lastCompletedDate);
  }, [quests, xp, stats, streak, lastCompletedDate]);

  function pushNotification(message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setNotifications((s) => [...s, { id, message }]);
  }

  function removeNotification(id: number) {
    setNotifications((s) => s.filter((n) => n.id !== id));
  }

  function NotificationItem({ id, message, themeData }: { id: number; message: string; themeData: ThemeColors }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      setVisible(true);
      const hideTimer = setTimeout(() => setVisible(false), 3800);
      const removeTimer = setTimeout(() => removeNotification(id), 4200);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }, [id]);

    return (
      <div
        className={`max-w-xs w-full bg-zinc-900/90 border ${themeData.notificationBorder} rounded-xl p-3 text-sm text-cyan-100 shadow-md transform transition-all duration-300 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
      >
        <div className="text-xs text-cyan-300 font-mono mb-1">[SYSTEM]</div>
        <div>{message.replace(/\[SYSTEM\] ?/, "")}</div>
      </div>
    );
  }

  function completeQuest(index: number) {
    console.log("clicked", index);

    const updatedQuests = [...quests];

    if (!updatedQuests[index].completed) {
      const quest = updatedQuests[index];

      // compute new xp and stats for notifications and logic
      const newXp = xp + quest.xp;
      const prevLevel = Math.floor(xp / maxXp) + 1;
      const newLevel = Math.floor(newXp / maxXp) + 1;

      const newStats = {
        ...stats,
        [quest.stat]: stats[quest.stat] + 1,
      } as Record<StatKey, number>;

      const prevPower = stats.STR + stats.INT + stats.DISC + stats.ENG;
      const newPower = newStats.STR + newStats.INT + newStats.DISC + newStats.ENG;
      const prevRank = getRank(prevPower);
      const newRank = getRank(newPower);

      // apply updates
      updatedQuests[index].completed = true;
      setXp(newXp);
      setStats(newStats);

      // streak logic
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

      setStreak((prevStreak) => {
        if (lastCompletedDate === today) return prevStreak;
        return lastCompletedDate === yesterday ? prevStreak + 1 : 1;
      });
      setLastCompletedDate(today);

      setQuests(updatedQuests);

      // Notifications
      pushNotification(`[SYSTEM] Quest completed: ${quest.name} (+${quest.xp} XP)`);
      pushNotification(`[SYSTEM] ${quest.stat} has increased by 1`);

      if (newLevel > prevLevel) {
        pushNotification(`[SYSTEM] Level Up! Lv ${prevLevel} → Lv ${newLevel}`);
      }

      if (newRank !== prevRank) {
        pushNotification(`[SYSTEM] Rank Up! ${prevRank} → ${newRank}`);
      }
    }
  }

  function addQuest() {
    if (!newQuestName || !newQuestXp) return;

    const newQuest = {
      name: newQuestName,
      xp: Number(newQuestXp),
      stat: selectedStat,
      completed: false,
    };

    setQuests([...quests, newQuest]);

    setNewQuestName("");
    setNewQuestXp("");
  }
function deleteQuest(index: number) {
  const updatedQuests = quests.filter(
    (_, i) => i !== index
  );

  setQuests(updatedQuests);
}

function applyEngineeringDayTemplate() {
  const templateQuests = [
    { name: "Research Topic", xp: 20, stat: "INT" as StatKey },
    { name: "CAD Practice", xp: 30, stat: "ENG" as StatKey },
    { name: "Team Meeting", xp: 20, stat: "DISC" as StatKey },
    { name: "Workout", xp: 20, stat: "STR" as StatKey },
  ];

  const newQuests = [...quests];

  // Add each template quest if it doesn't already exist
  for (const template of templateQuests) {
    const questExists = newQuests.some((q) => q.name === template.name);
    if (!questExists) {
      newQuests.push({
        name: template.name,
        xp: template.xp,
        stat: template.stat,
        completed: false,
      });
    }
  }

  setQuests(newQuests);
  pushNotification("[SYSTEM] Engineering Day template loaded!");
}

function quickAddQuest(name: string, stat: StatKey, xp: number) {
  // Check if quest with same name already exists (active or completed)
  const questExists = quests.some((q) => q.name === name);
  
  if (questExists) {
    pushNotification(`[SYSTEM] "${name}" is already in your quest list.`);
    return;
  }

  const newQuest = {
    name,
    xp,
    stat,
    completed: false,
  };

  setQuests([...quests, newQuest]);
  pushNotification(`[SYSTEM] Added: ${name} (+${xp} XP)`);
}

  function resetSystem() {
  localStorage.clear();

  setXp(0);
  setStreak(0);
  setLastCompletedDate("");

  setStats({
    STR: 5,
    INT: 5,
    DISC: 5,
    ENG: 5,
  });

  setQuests([]);
}

  return (
    <main className="min-h-screen bg-black text-white p-8">
      {/* Notifications */}
      <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3">
        {notifications.map((n) => (
          <NotificationItem key={n.id} id={n.id} message={n.message} themeData={theme} />
        ))}
      </div>
      <h1 className="text-5xl font-bold text-cyan-400 mb-2">
        HUNTER SYSTEM
      </h1>

      <p className="text-cyan-200 text-sm tracking-[0.18em] uppercase mb-8">
        {currentDate}
      </p>

      {/* LEVEL CARD */}
        <div className={`bg-gradient-to-br from-zinc-900/80 to-zinc-900/60 p-6 rounded-3xl mb-6 border ${theme.border} border-opacity-50 shadow-lg ${theme.glow} transition-shadow`}>
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-3 rounded-xl bg-black/30 border ${theme.border} border-opacity-30`}>
                <div className="text-xs text-zinc-300 uppercase">Rank</div>
                <div className={`text-2xl font-extrabold ${theme.accent} tracking-wide`}>{rank}</div>
              </div>

              <div>
                <div className="text-sm text-zinc-400">Level</div>
                <div className={`text-3xl font-bold ${theme.highlight}`}>Lv {level}</div>
                <div className="mt-1 text-sm text-amber-200 font-semibold tracking-wide drop-shadow-sm">{title}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-zinc-400">Power</div>
              <div className={`text-2xl font-semibold ${theme.highlight}`}>{power}</div>
              <div className="mt-2 text-xs text-amber-300">🔥 {streak} Day Streak</div>
              <div className={`mt-2 text-xs ${theme.highlight}`}>{currentDate}</div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs text-zinc-400 mb-2">XP</div>
            <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-4 ${theme.xpBar} rounded-full transition-all`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-xs text-zinc-400 mt-2">{xp} / {maxXp} XP</div>
          </div>
        </div>

      

      {/* QUICK ADD */}
      <div className="bg-zinc-900 p-6 rounded-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
          Quick Add
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => quickAddQuest("Research", "INT", 20)}
            className={`${theme.buttonBg} p-3 rounded-xl transition-colors ${theme.buttonHover} font-semibold text-sm`}
          >
            Research
          </button>

          <button
            onClick={() => quickAddQuest("Meeting", "DISC", 20)}
            className={`${theme.buttonBg} p-3 rounded-xl transition-colors ${theme.buttonHover} font-semibold text-sm`}
          >
            Meeting
          </button>

          <button
            onClick={() => quickAddQuest("CAD Practice", "ENG", 30)}
            className={`${theme.buttonBg} p-3 rounded-xl transition-colors ${theme.buttonHover} font-semibold text-sm`}
          >
            CAD Practice
          </button>

          <button
            onClick={() => quickAddQuest("Training", "STR", 20)}
            className={`${theme.buttonBg} p-3 rounded-xl transition-colors ${theme.buttonHover} font-semibold text-sm`}
          >
            Training
          </button>
        </div>
      </div>

      {/* ADD QUEST */}
<div className="bg-zinc-900 p-6 rounded-2xl mb-6">
  <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
    Add Quest
  </h2>

  <div className="flex flex-col gap-4">

    <input
      type="text"
      placeholder="Quest Name"
      value={newQuestName}
      onChange={(e) => setNewQuestName(e.target.value)}
      className="bg-zinc-800 p-3 rounded-xl"
    />

    <input
      type="number"
      placeholder="XP"
      value={newQuestXp}
      onChange={(e) => setNewQuestXp(e.target.value)}
      className="bg-zinc-800 p-3 rounded-xl"
    />

    <select
      value={selectedStat}
      onChange={(e) => setSelectedStat(e.target.value as StatKey)}
      className="bg-zinc-800 p-3 rounded-xl"
    >
      <option value="STR">STR</option>
      <option value="INT">INT</option>
      <option value="DISC">DISC</option>
      <option value="ENG">ENG</option>
    </select>

    <button
      onClick={addQuest}
      className={`${theme.buttonBg} p-3 rounded-xl transition-colors ${theme.buttonHover}`}
    >
      Add Quest
    </button>

  </div>
</div>



      {/* QUESTS */}
      <div className="bg-zinc-900 p-6 rounded-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
          Daily Quests
        </h2>

        {quests.length === 0 ? (
  <p className="text-zinc-400">
    No active quests. Add one above.
  </p>
) : (
  <div className="space-y-3">
    {quests.map((quest, index) => (
      
      <div
  key={index}
  className="flex gap-2"
>
  <button
    onClick={() => completeQuest(index)}
    disabled={quest.completed}
    className={`flex-1 text-left p-4 rounded-xl transition-colors ${
      quest.completed
        ? "bg-green-700"
        : `bg-zinc-800 ${theme.buttonHover}`
    }`}
  >
    {quest.completed ? "✓ " : ""}
    {quest.name} (+{quest.xp} XP)
  </button>

  <button
    onClick={() => deleteQuest(index)}
    className="bg-red-700 px-4 rounded-xl hover:bg-red-900"
  >
    ✕
  </button>
</div>
    ))}
  </div>
)}
      </div>

      {/* STATS */}
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
          Stats
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-800 p-4 rounded-xl">
            STR: {stats.STR}
          </div>

          <div className="bg-zinc-800 p-4 rounded-xl">
            INT: {stats.INT}
          </div>

          <div className="bg-zinc-800 p-4 rounded-xl">
            DISC: {stats.DISC}
          </div>

          <div className="bg-zinc-800 p-4 rounded-xl">
            ENG: {stats.ENG}
          </div>
        </div>
      </div>

      {/* RESET BUTTON */}
      <button
        onClick={resetSystem}
        className="mt-6 bg-red-700 px-6 py-3 rounded-xl hover:bg-red-900"
      >
        Reset System
      </button>
    </main>
  );
}