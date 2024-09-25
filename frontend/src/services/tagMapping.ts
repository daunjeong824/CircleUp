const tagMap: { [key: string]: number } = {
  요리: 1,
  베이킹: 2,
  운동: 3,
  요가: 4,
  기술: 5,
  예술: 6,
  드로잉: 7,
  음악: 8,
  피아노: 9,
  프로그래밍: 10,
  포토그래피: 11,
  인테리어: 12,
  공예: 13,
};

export const tagMapping = (tags: string[]): number[] => {
  const arr: number[] = [];
  tags.forEach((tag) => {
    if (tag in tagMap) {
      arr.push(tagMap[tag]);
    } else {
      console.error(`Tag "${tag}" not found in tagMap`);
    }
  });

  return arr;
};
