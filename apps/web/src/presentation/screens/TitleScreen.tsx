import { ChevronRight, Crown, Sparkles } from "lucide-react";
import { BackgroundGlows } from "../components/BackgroundGlows";
import { SparkleField } from "../components/SparkleField";
import { EXPLANATION_VIDEO_TTS_NOTICE } from "../copy/video-notice";

const serif = { fontFamily: '"Noto Serif JP", serif' } as const;
const sans = { fontFamily: '"Noto Sans JP", sans-serif' } as const;

type Props = { onStart: () => void };

export function TitleScreen({ onStart }: Props) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 flex items-center justify-center p-6 relative overflow-hidden">
      <BackgroundGlows />
      <SparkleField />
      <div className="relative z-10 text-center max-w-2xl">
        <div className="inline-block mb-6 px-5 py-2 bg-yellow-400/20 border-2 border-yellow-300 rounded-full backdrop-blur-sm">
          <span className="text-yellow-200 text-xs font-bold tracking-widest">
            AIが採点する英会話アドリブトレーニング
          </span>
        </div>
        <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
        <h1
          className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-yellow-200 mb-3 tracking-tight leading-tight"
          style={serif}
        >
          英会話
          <br />
          アドリブドリル
        </h1>
        <p className="text-yellow-200/80 text-sm tracking-[0.3em] mb-10 font-bold">ENGLISH AD-LIB DRILL</p>
        <p className="text-base md:text-lg text-purple-100 mb-10 leading-loose max-w-lg mx-auto" style={sans}>
          お題に沿って英語でアドリブトーク。
          <br />
          AIがあなたの「<span className="text-yellow-300 font-bold">英語力</span>」を100点満点で採点します。
        </p>
        <button
          type="button"
          onClick={onStart}
          className="group px-12 py-5 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black text-xl rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <span className="flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6" />
            はじめる
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
        <p className="mt-8 text-xs text-purple-300/70 leading-relaxed" style={sans}>
          マイク・キーボード両対応 / 1問60秒
          <br />
          推奨環境: PC の Chrome または Edge（音声のリアルタイム表示）
          <br />
          <span className="text-purple-300/60">{EXPLANATION_VIDEO_TTS_NOTICE}</span>
        </p>
      </div>
    </div>
  );
}
