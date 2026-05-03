export type TimelineType = 'post' | 'section';

export interface TimelineItem {
  id: string;
  date: string;       // 如果是 section，此字段可存储“2026年3月”
  content: string;    // 学习内容
  type: TimelineType; // 节点类型
  timestamp: number;  // 用于排序
}