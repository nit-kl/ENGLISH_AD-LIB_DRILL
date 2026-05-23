import { useGameFlow } from "../application/use-game-flow.js";
import { PlayingScreen } from "./screens/PlayingScreen";
import { RevealScreen } from "./screens/RevealScreen";
import { QuestionListScreen } from "./screens/QuestionListScreen";
import { StageSelectScreen } from "./screens/StageSelectScreen";
import { TitleScreen } from "./screens/TitleScreen";

export function App() {
  const game = useGameFlow();

  if (game.screen === "title") {
    return <TitleScreen onStart={() => game.setScreen("stageSelect")} />;
  }

  if (game.screen === "stageSelect") {
    return (
      <StageSelectScreen onBack={game.handleHome} onSelect={game.handleStartStage} />
    );
  }

  if (game.screen === "questionList" && game.currentStage) {
    return (
      <QuestionListScreen
        stageKey={game.currentStage}
        completedIds={game.stageCompletedIds}
        onBack={() => game.setScreen("stageSelect")}
        onHome={game.handleHome}
        onSelect={(_q, index) => game.handleSelectQuestion(index)}
      />
    );
  }

  const { currentQuestion: q, questions } = game;
  const totalQs = questions.length;

  if (game.screen === "playing" && q) {
    return (
      <PlayingScreen
        question={q}
        questionIndex={game.questionIndex}
        totalQs={totalQs}
        pickMode
        finishLabel={game.finishLabel}
        timeLeft={game.timeLeft}
        answerTimerActive={game.answerTimerActive}
        setupComplete={game.setupComplete}
        onSetupComplete={game.handleSetupComplete}
        userInput={game.userInput}
        onInputChange={game.setUserInput}
        conversationExchanges={game.conversationExchanges}
        totalConversationTurns={game.totalConversationTurns}
        currentTurnIndex={game.currentTurnIndex}
        onFinalTurn={game.onFinalTurn}
        showScoring={game.showScoring}
        feedback={game.feedback}
        animatedScore={game.animatedScore}
        displayedUserAnswer={game.displayedUserAnswer}
        isSubmitting={game.isSubmitting}
        submitError={game.submitError}
        voice={game.voice}
        onHome={game.handleHome}
        onBackToList={() => game.handleReturnToQuestionList(false)}
        onSubmit={() => void game.handleSubmit()}
        onContinueToReveal={game.handleContinueToReveal}
        onNext={game.handleNext}
      />
    );
  }

  if (game.screen === "reveal" && q && game.feedback) {
    return (
      <RevealScreen
        question={q}
        feedback={game.feedback}
        finishLabel={game.finishLabel}
        onHome={game.handleHome}
        onBackToList={() => game.handleReturnToQuestionList(true)}
        onNext={game.handleNext}
      />
    );
  }

  return null;
}
