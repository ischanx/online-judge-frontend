export const parseTimestamp = (timestamp: number) => new Date(timestamp).toLocaleString();

export const parseTime = (time: number) => {
  const t = Math.floor(time / 1000);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t - h * 3600) / 60);
  const s = t % 60;
  if (t < 60) return `${s}秒`;
  else if (t < 3600) {
    return `${m}分${s}秒`;
  } else return `${h}时${m}分${s}秒`;
};
export const parseRemainTime = (beginTime: number, endTime: number) => {
  const now = Date.now();
  if (!beginTime || !endTime) return '-';
  if (now < beginTime)
    return {
      color: 'blue',
      text: '未开始',
    };
  else if (now > endTime)
    return {
      color: 'green',
      text: '已结束',
    };
  return {
    color: 'red',
    text: '进行中',
  };
};
