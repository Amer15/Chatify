export const sortUserIdsInAscOrder = (
  userId1: number,
  userId2: number
): [user_id_1: number, user_id_2: number] =>
  userId1 < userId2 ? [userId1, userId2] : [userId2, userId1];

export const convertToChunkArray = (arr: string[], size: number): string[][] =>
  arr.length > size
    ? [arr.slice(0, size), ...convertToChunkArray(arr.slice(size), size)]
    : [arr];
