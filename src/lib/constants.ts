export const GRADE: Record<string, string> = {
  "0": "请选择",
  "1": "一年级",
  "2": "二年级",
  "3": "三年级",
  "4": "四年级",
  "5": "五年级",
  "6": "六年级",
  "7": "七年级",
  "8": "八年级",
  "9": "九年级",
  "10": "高一",
  "11": "高二",
  "12": "高三",
};

export const GRADE_PRICE: Record<string, number> = {
  "1": 110,
  "2": 110,
  "3": 110,
  "4": 120,
  "5": 120,
  "6": 120,
  "7": 130,
  "8": 140,
  "9": 150,
  "10": 160,
  "11": 170,
  "12": 180,
};

export const SUBJECT: Record<string, string> = {
  "0": "请选择",
  "1": "数学",
  "2": "英语",
  "3": "物理",
  "4": "化学",
  "5": "生物",
  "6": "政治",
  "7": "历史",
  "8": "地理",
  "9": "语文",
};

export const CLASS_WAY: Record<string, string> = {
  "0": "请选择",
  "1": "线上",
  "2": "线下",
};

export const CLASS_TYPE: Record<string, string> = {
  "0": "请选择",
  "1": "一对一",
  "2": "小班",
  "3": "大班",
};

export const CLASS_MAIN: Record<string, string> = {
  "1": "正课",
  "2": "试听",
};

export const WEEK_DAY: Record<string, string> = {
  "0": "星期日",
  "1": "星期一",
  "2": "星期二",
  "3": "星期三",
  "4": "星期四",
  "5": "星期五",
  "6": "星期六",
};

export function calculateSalary(grade: string, classPeriod: number): number {
  const price = GRADE_PRICE[grade];
  if (!price) return 0;
  return Number((classPeriod * price).toFixed(2));
}

export function calculateClassPeriod(
  startTime: string,
  endTime: string
): number {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const diffMinutes = endH * 60 + endM - (startH * 60 + startM);
  return Number((diffMinutes / 60).toFixed(1));
}

export function getWeekDay(dateStr: string): string {
  const day = new Date(dateStr).getDay();
  return WEEK_DAY[String(day)];
}

export function formatSalary(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)} 万`;
  }
  return amount.toLocaleString("zh-CN");
}
