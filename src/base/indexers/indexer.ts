import { Progress, WorkspaceFolder } from 'vscode';

export abstract class Indexer<D = any> {
  /**
   * The name of the indexer
   */
  public abstract getName(): string;

  /**
   * Main indexer function
   */
  public abstract index(
    workspaceFolder: WorkspaceFolder,
    progress: Progress<{
      message?: string;
      increment?: number;
    }>
  ): Promise<void>;

  /**
   * Returns the data for the indexer
   */
  public abstract getData(): D;
}
