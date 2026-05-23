/** Workers 失敗後に Gemini を 1 回試行。両方失敗時は secondary のエラーを throw */
export async function withAiFallback<T>(
  primary: () => Promise<T>,
  secondary: () => Promise<T>,
  onFallback?: () => void,
): Promise<T> {
  try {
    return await primary();
  } catch {
    onFallback?.();
    return await secondary();
  }
}
