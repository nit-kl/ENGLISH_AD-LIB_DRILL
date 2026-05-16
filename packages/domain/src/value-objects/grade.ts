export type GradeData = {
  rank: string;
  label: string;
  description: string;
  toeicEquivalent: string;
  colorClass: string;
};

const GRADE_TABLE: { min: number; data: GradeData }[] = [
  {
    min: 90,
    data: {
      rank: "神",
      label: "アドリブの神",
      description: "あなたは英会話アドリブの神です！",
      toeicEquivalent: "TOEIC 900+ 相当",
      colorClass: "from-amber-300 via-yellow-400 to-amber-500",
    },
  },
  {
    min: 80,
    data: {
      rank: "1",
      label: "1級",
      description: "ネイティブに迫る流暢さ。素晴らしい。",
      toeicEquivalent: "TOEIC 800〜895 相当",
      colorClass: "from-rose-400 to-pink-500",
    },
  },
  {
    min: 70,
    data: {
      rank: "2",
      label: "2級",
      description: "自信を持って会話できるレベル。",
      toeicEquivalent: "TOEIC 700〜795 相当",
      colorClass: "from-violet-400 to-purple-500",
    },
  },
  {
    min: 60,
    data: {
      rank: "3",
      label: "3級",
      description: "安定した中級スピーカー。",
      toeicEquivalent: "TOEIC 600〜695 相当",
      colorClass: "from-sky-400 to-blue-500",
    },
  },
  {
    min: 50,
    data: {
      rank: "4",
      label: "4級",
      description: "順調に伸びています。",
      toeicEquivalent: "TOEIC 500〜595 相当",
      colorClass: "from-emerald-400 to-teal-500",
    },
  },
  {
    min: 0,
    data: {
      rank: "5",
      label: "5級",
      description: "まずは継続。必ず話せるようになります。",
      toeicEquivalent: "TOEIC 〜495 相当",
      colorClass: "from-stone-400 to-slate-500",
    },
  },
];

export class Grade {
  private constructor(readonly data: GradeData) {}

  static fromAverageScore(averageScore: number): Grade {
    const clamped = Math.max(0, Math.min(100, Math.round(averageScore)));
    const entry =
      GRADE_TABLE.find((row) => clamped >= row.min) ??
      GRADE_TABLE[GRADE_TABLE.length - 1];
    return new Grade(entry.data);
  }

  get rank(): string {
    return this.data.rank;
  }

  get label(): string {
    return this.data.label;
  }

  get description(): string {
    return this.data.description;
  }

  get toeicEquivalent(): string {
    return this.data.toeicEquivalent;
  }

  get colorClass(): string {
    return this.data.colorClass;
  }
}
