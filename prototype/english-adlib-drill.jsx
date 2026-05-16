import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Crown, Star, Trophy, ChevronRight, Sparkles, Award, Flame, Target, Home, RotateCcw, Send, BookOpen, Lightbulb, Volume2 } from 'lucide-react';

export default function EnglishAdLibDrill() {
  const [screen, setScreen] = useState('title');
  const [mode, setMode] = useState(null);
  const [currentStage, setCurrentStage] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [certScores, setCertScores] = useState([]);
  const [showScoring, setShowScoring] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const stages = {
    beginner: {
      label: '初級',
      sublabel: 'Beginner',
      desc: '海外旅行レベル',
      color: 'from-emerald-400 to-teal-500',
      questions: [
        {
          title: 'カフェで注文する',
          titleEn: 'Order at a Café',
          situation: 'ニューヨークのスターバックスにいます。店員さんに "What can I get for you today?" と聞かれました。アイスラテをトールサイズで注文してください。',
          role: 'お客さん',
          icon: '☕',
          hints: ['I\'d like ~', 'Can I have ~', 'a tall iced latte'],
        },
        {
          title: '初対面の挨拶',
          titleEn: 'First Meeting',
          situation: '語学学校の初日。隣に座った人が "Hi! I don\'t think we\'ve met. I\'m Sarah." と話しかけてきました。自己紹介してください。',
          role: '留学生',
          icon: '🎒',
          hints: ['Nice to meet you', 'I\'m from ~', 'I\'m here to ~'],
        },
        {
          title: '道を尋ねられた',
          titleEn: 'Giving Directions',
          situation: '渋谷駅前で外国人観光客に "Excuse me, how can I get to Shibuya Crossing?" と聞かれました。教えてあげてください。',
          role: '親切な日本人',
          icon: '🗺️',
          hints: ['Go straight', 'Turn left/right', 'It\'s right over there'],
        },
      ]
    },
    intermediate: {
      label: '中級',
      sublabel: 'Intermediate',
      desc: '日常会話レベル',
      color: 'from-sky-400 to-blue-500',
      questions: [
        {
          title: 'ホテルでトラブル',
          titleEn: 'Hotel Trouble',
          situation: 'ハワイのホテルでチェックインしようとしたら、予約記録がないと言われました。冷静に状況を説明し、対応を求めてください。',
          role: '困っている宿泊客',
          icon: '🏨',
          hints: ['I have a reservation', 'Could you check again', 'This is unacceptable'],
        },
        {
          title: '英語面接',
          titleEn: 'Job Interview',
          situation: '外資系企業の面接で "Tell me about a time you overcame a difficult challenge at work." と聞かれました。1分以内に答えてください。',
          role: '転職志望者',
          icon: '💼',
          hints: ['In my previous role', 'I was responsible for', 'As a result'],
        },
        {
          title: '海外の同僚と雑談',
          titleEn: 'Small Talk with Coworker',
          situation: 'リモート会議の前、海外支社の同僚が "How was your weekend?" と話しかけてきました。週末の出来事を話してください。',
          role: '会社員',
          icon: '💬',
          hints: ['It was pretty good', 'I ended up ~ing', 'How about you?'],
        },
      ]
    },
    advanced: {
      label: '上級',
      sublabel: 'Advanced',
      desc: 'ビジネス&議論レベル',
      color: 'from-fuchsia-400 to-purple-600',
      questions: [
        {
          title: 'プレゼン冒頭',
          titleEn: 'Presentation Opening',
          situation: '国際カンファレンスで「日本の働き方改革」について発表します。聴衆を引き込む60秒のオープニングを話してください。',
          role: '登壇者',
          icon: '🎤',
          hints: ['Imagine a world where ~', 'Today I want to talk about', 'But first, let me ask you'],
        },
        {
          title: '上司に反論する',
          titleEn: 'Pushing Back',
          situation: '外国人上司が「日本市場での研修予算を全額カットする」と提案。失礼にならない範囲で反対意見を述べてください。',
          role: 'マネージャー',
          icon: '⚖️',
          hints: ['I understand your point, however', 'With all due respect', 'May I suggest an alternative'],
        },
        {
          title: 'クレーム対応（英語）',
          titleEn: 'Handling a Complaint',
          situation: '怒っている海外のお客様 "This is the worst service I have ever received!" 丁寧に謝罪し、解決策を提示してください。',
          role: 'カスタマーサポート',
          icon: '🔥',
          hints: ['I sincerely apologize', 'Let me make this right', 'I completely understand your frustration'],
        },
      ]
    },
    legendary: {
      label: '超人級',
      sublabel: 'Legendary',
      desc: 'ネイティブ級の言葉力',
      color: 'from-amber-400 via-rose-500 to-red-600',
      questions: [
        {
          title: '徳川家康にSNSを説明',
          titleEn: 'Explain SNS to Ieyasu',
          situation: 'タイムスリップしてきた徳川家康に、英語でTwitter（X）とは何かを説明してください。家康にも分かるように。',
          role: 'タイムトラベル案内人',
          icon: '⚔️',
          hints: ['It\'s like a town square where ~', 'Imagine a messenger that ~', 'Everyone can hear what you say'],
        },
        {
          title: '国連でスピーチ',
          titleEn: 'UN Speech',
          situation: '国連気候変動会議で日本代表として60秒スピーチ。各国の即時行動を訴えてください。',
          role: '日本代表',
          icon: '🌏',
          hints: ['Distinguished delegates', 'The time for action is now', 'We owe it to future generations'],
        },
        {
          title: '砂漠で砂を売る',
          titleEn: 'Sell Sand in the Desert',
          situation: '砂漠の遊牧民に「プレミアム砂」を買わせてください。英語で説得力ある営業トークを。',
          role: '訪問販売員',
          icon: '🏜️',
          hints: ['This isn\'t just any sand', 'What makes this special is', 'You\'d be the first in your tribe to'],
        },
      ]
    }
  };

  const certQuestions = [
    ...stages.beginner.questions,
    ...stages.intermediate.questions,
    ...stages.advanced.questions,
    stages.legendary.questions[0],
  ];

  useEffect(() => {
    if (screen === 'playing' && timeLeft > 0 && !showScoring) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    }
    if (timeLeft === 0 && screen === 'playing' && !showScoring) {
      handleSubmit();
    }
  }, [timeLeft, screen, showScoring]);

  useEffect(() => {
    if (showScoring && score !== null) {
      let v = 0;
      const inc = setInterval(() => {
        v += 2;
        if (v >= score) { v = score; clearInterval(inc); }
        setAnimatedScore(v);
      }, 20);
      return () => clearInterval(inc);
    }
  }, [showScoring, score]);

  const getCurrentQuestions = () => {
    if (mode === 'cert') return certQuestions;
    return stages[currentStage]?.questions || [];
  };

  const handleStartCert = () => {
    setMode('cert');
    setQuestionIndex(0);
    setCertScores([]);
    setUserInput('');
    setTimeLeft(60);
    setShowHint(false);
    setScreen('playing');
  };

  const handleStartStage = (key) => {
    setMode('stage');
    setCurrentStage(key);
    setQuestionIndex(0);
    setUserInput('');
    setTimeLeft(60);
    setShowHint(false);
    setScreen('playing');
  };

  const generateFeedback = (text) => {
    const t = text.trim();
    const wordCount = t.split(/\s+/).filter(Boolean).length;
    const hasVariety = new Set(t.toLowerCase().match(/\b\w+\b/g) || []).size;

    const fluency = Math.min(100, Math.round(40 + wordCount * 1.8 + Math.random() * 15));
    const grammar = Math.min(100, Math.round(55 + Math.random() * 35));
    const vocabulary = Math.min(100, Math.round(50 + hasVariety * 1.5 + Math.random() * 10));
    const relevance = Math.min(100, Math.round(60 + Math.random() * 35));

    const total = Math.round((fluency + grammar + vocabulary + relevance) / 4);

    const goodPoints = [];
    const improvements = [];

    if (fluency > 75) goodPoints.push('テンポよく話せていて、自然な流れがありました。');
    if (grammar > 80) goodPoints.push('時制の使い分けが正確で、文の骨格がしっかりしています。');
    if (vocabulary > 75) goodPoints.push('同じ単語を繰り返さず、語彙の幅を見せられています。');
    if (relevance > 80) goodPoints.push('お題の状況にしっかり沿った回答ができています。');
    if (goodPoints.length === 0) goodPoints.push('まず話し始めたこと自体が一歩前進。続けていきましょう。');

    if (fluency < 60) improvements.push('文が短く切れがち。接続詞 (and, but, because, so) を使って文をつなげてみましょう。');
    if (grammar < 70) improvements.push('冠詞 (a / the) の抜けが目立ちます。名詞の前に意識的に入れる練習を。');
    if (vocabulary < 65) improvements.push('"very" の連発を避けて、incredibly / extremely / quite など強さの違う副詞を使い分けてみて。');
    if (wordCount < 15) improvements.push('回答が短めです。1つの状況には最低3〜4文くらい返すと評価が伸びます。');
    if (improvements.length === 0) improvements.push('次は「つなぎ言葉 (you know, actually, well)」を入れるとさらにネイティブっぽくなります。');

    const modelAnswer = "I'd like a tall iced latte, please. Could I also have an extra shot of espresso? Thank you so much.";

    return { total, fluency, grammar, vocabulary, relevance, goodPoints, improvements, modelAnswer };
  };

  const handleSubmit = () => {
    if (showScoring) return;
    const result = generateFeedback(userInput || '...');
    setScore(result.total);
    setFeedback(result);
    setShowScoring(true);
    setAnimatedScore(0);
  };

  const handleNext = () => {
    const questions = getCurrentQuestions();
    if (mode === 'cert') {
      const newScores = [...certScores, score];
      setCertScores(newScores);
      if (questionIndex + 1 >= 10) {
        setShowScoring(false);
        setScreen('certResult');
        return;
      }
      setQuestionIndex(questionIndex + 1);
    } else {
      if (questionIndex + 1 >= questions.length) {
        setShowScoring(false);
        setScreen('result');
        return;
      }
      setQuestionIndex(questionIndex + 1);
    }
    setUserInput('');
    setTimeLeft(60);
    setScore(null);
    setFeedback(null);
    setShowScoring(false);
    setShowHint(false);
  };

  const handleHome = () => {
    setScreen('title');
    setMode(null);
    setCurrentStage(null);
    setQuestionIndex(0);
    setUserInput('');
    setScore(null);
    setFeedback(null);
    setCertScores([]);
    setShowScoring(false);
    setShowHint(false);
  };

  const getRank = (avgScore) => {
    if (avgScore >= 90) return { rank: '神', label: 'アドリブの神', color: 'from-amber-300 via-yellow-400 to-amber-500', desc: 'あなたは英会話アドリブの神です！', toeic: 'TOEIC 900+ 相当' };
    if (avgScore >= 80) return { rank: '1', label: '1級', color: 'from-rose-400 to-pink-500', desc: 'ネイティブに迫る流暢さ。素晴らしい。', toeic: 'TOEIC 800〜895 相当' };
    if (avgScore >= 70) return { rank: '2', label: '2級', color: 'from-violet-400 to-purple-500', desc: '自信を持って会話できるレベル。', toeic: 'TOEIC 700〜795 相当' };
    if (avgScore >= 60) return { rank: '3', label: '3級', color: 'from-sky-400 to-blue-500', desc: '安定した中級スピーカー。', toeic: 'TOEIC 600〜695 相当' };
    if (avgScore >= 50) return { rank: '4', label: '4級', color: 'from-emerald-400 to-teal-500', desc: '順調に伸びています。', toeic: 'TOEIC 500〜595 相当' };
    return { rank: '5', label: '5級', color: 'from-stone-400 to-slate-500', desc: 'まずは継続。必ず話せるようになります。', toeic: 'TOEIC 〜495 相当' };
  };

  if (screen === 'title') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-fuchsia-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>

        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute text-yellow-300 animate-pulse" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 16 + 8}px`,
            animationDelay: `${Math.random() * 3}s`
          }}>✦</div>
        ))}

        <div className="relative z-10 text-center max-w-2xl">
          <div className="inline-block mb-6 px-5 py-2 bg-yellow-400/20 border-2 border-yellow-300 rounded-full backdrop-blur-sm">
            <span className="text-yellow-200 text-xs font-bold tracking-widest">AIが採点する英会話アドリブトレーニング</span>
          </div>

          <div className="flex items-center justify-center mb-4">
            <Crown className="w-16 h-16 text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.8)]" />
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-yellow-200 mb-3 tracking-tight leading-tight" style={{fontFamily: '"Noto Serif JP", "Hiragino Mincho ProN", serif', textShadow: '0 0 40px rgba(253,224,71,0.4)'}}>
            英会話<br/>アドリブドリル
          </h1>
          <p className="text-yellow-200/80 text-sm tracking-[0.3em] mb-10 font-bold">ENGLISH AD-LIB DRILL</p>

          <p className="text-base md:text-lg text-purple-100 mb-10 leading-loose max-w-lg mx-auto" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>
            お題に沿って英語でアドリブトーク。<br/>
            AIがあなたの「<span className="text-yellow-300 font-bold">英語力</span>」を100点満点で採点します。
          </p>

          <button
            onClick={() => setScreen('modeSelect')}
            className="group relative px-12 py-5 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black text-xl rounded-full shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-yellow-300/50"
          >
            <span className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              はじめる
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <p className="mt-8 text-xs text-purple-300/70" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>マイク・キーボード両対応 / 1問60秒</p>
        </div>
      </div>
    );
  }

  if (screen === 'modeSelect') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>
        <div className="max-w-4xl mx-auto pt-8">
          <button onClick={handleHome} className="mb-8 flex items-center gap-2 text-purple-200 hover:text-white transition text-sm">
            <Home className="w-5 h-5" /> ホームに戻る
          </button>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={{fontFamily: '"Noto Serif JP", serif'}}>モードを選ぶ</h2>
          <p className="text-purple-200 mb-12 text-sm">どちらで挑戦しますか？</p>

          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={handleStartCert}
              className="group relative bg-gradient-to-br from-rose-600 to-pink-700 rounded-3xl p-8 text-left hover:scale-[1.02] transition-all shadow-2xl overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <Award className="w-12 h-12 text-yellow-300 mb-4" />
              <h3 className="text-3xl font-black text-white mb-1" style={{fontFamily: '"Noto Serif JP", serif'}}>検定モード</h3>
              <p className="text-rose-100 text-xs mb-3 tracking-widest">CERTIFICATION</p>
              <p className="text-rose-100/90 text-sm leading-relaxed">全10問でマジ判定。あなたの英会話力を5級〜1級＋「神」で評価。TOEIC換算スコアも表示。</p>
              <div className="mt-6 flex items-center gap-2 text-yellow-300 font-bold text-sm">
                受検する <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>

            <button
              onClick={() => setScreen('stageSelect')}
              className="group relative bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-8 text-left hover:scale-[1.02] transition-all shadow-2xl overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-yellow-300/20 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <Target className="w-12 h-12 text-yellow-300 mb-4" />
              <h3 className="text-3xl font-black text-white mb-1" style={{fontFamily: '"Noto Serif JP", serif'}}>ステージモード</h3>
              <p className="text-cyan-100 text-xs mb-3 tracking-widest">STAGE CLEAR</p>
              <p className="text-cyan-100/90 text-sm leading-relaxed">初級から超人級まで4ステージ。お気に入りのシチュエーションだけ繰り返し練習することも。</p>
              <div className="mt-6 flex items-center gap-2 text-yellow-300 font-bold text-sm">
                ステージを選ぶ <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'stageSelect') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>
        <div className="max-w-5xl mx-auto pt-8">
          <button onClick={() => setScreen('modeSelect')} className="mb-8 flex items-center gap-2 text-purple-200 hover:text-white transition text-sm">
            <ChevronRight className="w-5 h-5 rotate-180" /> 戻る
          </button>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={{fontFamily: '"Noto Serif JP", serif'}}>ステージ選択</h2>
          <p className="text-purple-200 mb-12 text-sm">難易度を選んでください</p>

          <div className="grid sm:grid-cols-2 gap-5">
            {Object.entries(stages).map(([key, stage], idx) => (
              <button
                key={key}
                onClick={() => handleStartStage(key)}
                className={`group relative bg-gradient-to-br ${stage.color} rounded-2xl p-6 text-left hover:scale-[1.02] transition-all shadow-xl overflow-hidden`}
              >
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-white text-xs font-bold">
                  Lv.{idx + 1}
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(idx + 1)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                  ))}
                </div>
                <h3 className="text-3xl font-black text-white mb-1" style={{fontFamily: '"Noto Serif JP", serif'}}>{stage.label}</h3>
                <p className="text-white/70 text-xs tracking-widest mb-1">{stage.sublabel.toUpperCase()}</p>
                <p className="text-white/90 text-sm mb-3">{stage.desc} · 全{stage.questions.length}問</p>
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  挑戦する <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'playing') {
    const questions = getCurrentQuestions();
    const q = questions[questionIndex];
    const totalQs = mode === 'cert' ? 10 : questions.length;

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 p-4 md:p-6 relative overflow-hidden" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handleHome} className="flex items-center gap-2 text-purple-200 hover:text-white transition">
              <Home className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="px-3 md:px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-sm">
                <span className="text-yellow-300 font-bold">第{questionIndex + 1}問</span>
                <span className="text-purple-200"> / 全{totalQs}問</span>
              </div>
              <div className={`px-3 md:px-4 py-2 backdrop-blur-md rounded-full border-2 font-black text-lg md:text-xl ${timeLeft <= 10 ? 'bg-red-500/30 border-red-400 text-red-200 animate-pulse' : 'bg-white/10 border-white/20 text-white'}`}>
                {timeLeft}秒
              </div>
            </div>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-1000"
              style={{width: `${(timeLeft / 60) * 100}%`}}
            ></div>
          </div>

          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 md:p-8 mb-5 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-yellow-300/20 rounded-full blur-3xl"></div>

            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl md:text-6xl">{q.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold tracking-widest text-yellow-300 mb-1">お題</div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-1" style={{fontFamily: '"Noto Serif JP", serif'}}>{q.title}</h3>
                <p className="text-purple-300/70 text-xs mb-3 tracking-wider">{q.titleEn}</p>
                <div className="inline-block px-3 py-1 bg-fuchsia-500/30 border border-fuchsia-400/50 rounded-full text-fuchsia-100 text-xs font-bold">
                  あなたの役：{q.role}
                </div>
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-4 md:p-5 border-l-4 border-yellow-300 mt-5">
              <div className="text-xs font-bold text-yellow-300/80 mb-2 tracking-wider">SITUATION</div>
              <p className="text-white text-base md:text-lg leading-relaxed">{q.situation}</p>
            </div>

            <button
              onClick={() => setShowHint(!showHint)}
              className="mt-4 flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition text-sm font-bold"
            >
              <Lightbulb className="w-4 h-4" />
              {showHint ? 'ヒントを隠す' : '困ったらヒント'}
            </button>
            {showHint && (
              <div className="mt-3 bg-amber-300/10 border border-amber-300/30 rounded-2xl p-4">
                <div className="text-xs font-bold text-amber-300 mb-2 tracking-wider">使えそうな表現</div>
                <div className="flex flex-wrap gap-2">
                  {q.hints.map((h, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white text-sm border border-white/10">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!showScoring ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-5 md:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-purple-200 text-sm font-bold">あなたの回答（英語で）</span>
                <span className="text-purple-300 text-xs">{userInput.trim().split(/\s+/).filter(Boolean).length} 単語</span>
              </div>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="英語で入力するか、マイクで話してください。"
                className="w-full bg-black/40 text-white placeholder-purple-300/50 rounded-2xl p-4 min-h-32 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300/50 border border-white/10 leading-relaxed"
                style={{fontFamily: '"Noto Sans JP", sans-serif'}}
              />
              <div className="flex items-center justify-between mt-4 gap-3">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-2 px-4 md:px-5 py-3 rounded-full font-bold transition-all text-sm ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  {isRecording ? '録音中…' : 'マイクで話す'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className="flex items-center gap-2 px-6 md:px-8 py-3 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-105 transition disabled:opacity-40 disabled:hover:scale-100 shadow-lg text-sm"
                >
                  回答する <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-yellow-300/20 to-pink-500/20 backdrop-blur-xl rounded-3xl border-2 border-yellow-300/50 p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="absolute text-yellow-300 animate-pulse" style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${Math.random() * 2}s`
                }}>✦</div>
              ))}

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="text-xs font-bold tracking-widest text-yellow-300 mb-2">AI採点結果</div>
                  <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-amber-400" style={{fontFamily: '"Noto Serif JP", serif'}}>
                    {animatedScore}
                  </div>
                  <div className="text-purple-200 text-sm">/ 100点</div>
                </div>

                {feedback && (
                  <>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: '流暢さ', val: feedback.fluency, icon: '💬' },
                        { label: '文法', val: feedback.grammar, icon: '✏️' },
                        { label: '語彙', val: feedback.vocabulary, icon: '📚' },
                        { label: '適切さ', val: feedback.relevance, icon: '🎯' },
                      ].map(item => (
                        <div key={item.label} className="bg-black/30 rounded-xl p-3 border border-white/10">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-purple-200 text-xs font-bold">{item.icon} {item.label}</span>
                            <span className="text-white font-black">{item.val}</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-300 to-amber-400 transition-all duration-1000" style={{width: `${item.val}%`}}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 mb-3">
                      <div className="text-xs font-bold tracking-widest text-emerald-300 mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> 良かった点
                      </div>
                      <ul className="space-y-1.5">
                        {feedback.goodPoints.map((c, i) => (
                          <li key={i} className="text-white text-sm flex gap-2 leading-relaxed">
                            <span className="text-emerald-300 flex-shrink-0">◎</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-rose-500/15 border border-rose-400/30 rounded-2xl p-4 mb-3">
                      <div className="text-xs font-bold tracking-widest text-rose-300 mb-2 flex items-center gap-2">
                        <Flame className="w-3 h-3" /> ここを直すともっと伸びる
                      </div>
                      <ul className="space-y-1.5">
                        {feedback.improvements.map((c, i) => (
                          <li key={i} className="text-white text-sm flex gap-2 leading-relaxed">
                            <span className="text-rose-300 flex-shrink-0">▲</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-white/10">
                      <div className="text-xs font-bold tracking-widest text-yellow-300 mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2"><BookOpen className="w-3 h-3" /> 模範解答の例</span>
                        <button className="text-white/60 hover:text-white">
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-white text-sm italic leading-relaxed">"{feedback.modelAnswer}"</p>
                    </div>
                  </>
                )}

                <button
                  onClick={handleNext}
                  className="w-full py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-2"
                >
                  {(mode === 'cert' && questionIndex + 1 >= 10) || (mode === 'stage' && questionIndex + 1 >= questions.length)
                    ? <>結果を見る <Trophy className="w-5 h-5" /></>
                    : <>次の問題へ <ChevronRight className="w-5 h-5" /></>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === 'result') {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6 flex items-center justify-center" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>
        <div className="max-w-2xl w-full text-center">
          <div className="mb-6 inline-block">
            <Trophy className="w-24 h-24 text-yellow-300 mx-auto drop-shadow-[0_0_30px_rgba(253,224,71,0.6)]" />
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-3" style={{fontFamily: '"Noto Serif JP", serif'}}>ステージクリア！</h2>
          <p className="text-purple-200 mb-10"><span className="text-yellow-300 font-bold">{stages[currentStage]?.label}</span>を制覇しました</p>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 mb-8">
            <div className="text-xs font-bold tracking-widest text-yellow-300 mb-3">最終問題スコア</div>
            <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 to-amber-400 mb-4" style={{fontFamily: '"Noto Serif JP", serif'}}>
              {score}<span className="text-3xl md:text-4xl text-purple-200 font-normal">/100</span>
            </div>
            <p className="text-purple-200 text-sm">よくがんばりました。次は1つ上の難易度に挑戦してみましょう。</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => setScreen('stageSelect')} className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition border border-white/20">
              他のステージへ
            </button>
            <button onClick={handleHome} className="px-8 py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-105 transition shadow-lg">
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === 'certResult') {
    const avg = certScores.length ? Math.round(certScores.reduce((a, b) => a + b, 0) / certScores.length) : 0;
    const rankData = getRank(avg);

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-rose-900 p-6 flex items-center justify-center relative overflow-hidden" style={{fontFamily: '"Noto Sans JP", sans-serif'}}>
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute text-yellow-300 animate-pulse" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDelay: `${Math.random() * 3}s`
          }}>✦</div>
        ))}

        <div className="max-w-2xl w-full text-center relative z-10">
          <div className="mb-4">
            <Crown className="w-20 h-20 text-yellow-300 mx-auto drop-shadow-[0_0_30px_rgba(253,224,71,0.8)]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2" style={{fontFamily: '"Noto Serif JP", serif'}}>あなたの英会話判定</h2>
          <p className="text-purple-200 mb-8 text-sm">全10問の検定が終了しました</p>

          <div className={`bg-gradient-to-br ${rankData.color} rounded-3xl p-8 md:p-10 mb-6 shadow-2xl relative overflow-hidden`}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="relative z-10">
              <div className="text-xs font-bold tracking-widest text-white/80 mb-2">あなたの級</div>
              <div className="text-8xl md:text-9xl font-black text-white mb-2" style={{fontFamily: '"Noto Serif JP", serif', textShadow: '0 4px 20px rgba(0,0,0,0.3)'}}>
                {rankData.rank}
              </div>
              <div className="text-2xl font-black text-white mb-1">{rankData.label}</div>
              <div className="text-white/90 text-sm mb-2">{rankData.desc}</div>
              <div className="text-white/70 text-xs mb-4">{rankData.toeic}</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-black/30 rounded-full">
                <span className="text-white/80 text-sm">平均スコア</span>
                <span className="text-white font-black text-xl">{avg}</span>
                <span className="text-white/80 text-sm">/ 100</span>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 mb-6">
            <div className="text-xs font-bold tracking-widest text-yellow-300 mb-3">各問題のスコア</div>
            <div className="grid grid-cols-10 gap-1">
              {certScores.map((s, i) => (
                <div key={i} className="aspect-square bg-black/30 rounded-lg flex items-center justify-center text-white text-xs font-bold border border-white/10">
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={handleStartCert} className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition border border-white/20 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> もう一度受検
            </button>
            <button onClick={handleHome} className="px-8 py-4 bg-gradient-to-r from-yellow-300 to-amber-400 text-purple-950 font-black rounded-full hover:scale-105 transition shadow-lg">
              ホームに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
