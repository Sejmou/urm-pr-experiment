export function getResultsFilename(task: string, participantId: string) {
  return `${task}_${participantId}_${Date.now()}.csv`;
}
