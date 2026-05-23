import type { Stage, StageRepository } from "@english-adlib/domain";

/** 全ステージ一覧を返す */
export class ListStagesUseCase {
  constructor(private readonly stageRepository: StageRepository) {}

  execute(): Stage[] {
    return this.stageRepository.getAllStages();
  }
}
