// LOTTO Labs 디자인 시스템 컬러
export const Colors = {
  // Primary
  primary: '#1E3A5F',
  primaryLight: '#2E5A8F',
  primaryDark: '#0E2A4F',
  
  // Secondary (Gold)
  secondary: '#FFD700',
  secondaryLight: '#FFE44D',
  secondaryDark: '#CCB000',
  
  // Accent (Coral)
  accent: '#FF6B6B',
  accentLight: '#FF8E8E',
  accentDark: '#E64545',
  
  // Background
  background: '#F8FAFC',
  backgroundDark: '#E2E8F0',
  surface: '#FFFFFF',
  
  // Text
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textMuted: '#A0AEC0',
  textInverse: '#FFFFFF',
  
  // Status
  success: '#48BB78',
  warning: '#ECC94B',
  error: '#F56565',
  info: '#4299E1',
  
  // Fortune Colors
  fortuneExcellent: '#FFD700', // 90-100
  fortuneGood: '#48BB78',      // 70-89
  fortuneNormal: '#4299E1',    // 50-69
  fortuneBad: '#ECC94B',       // 30-49
  fortunePoor: '#F56565',      // 0-29
  
  // Lotto Ball Colors (Korean Lotto)
  ball1to10: '#FBC400',    // 1-10: 노란색
  ball11to20: '#69C8F2',   // 11-20: 파란색
  ball21to30: '#FF7272',   // 21-30: 빨간색
  ball31to40: '#AAAAAA',   // 31-40: 회색
  ball41to45: '#B0D840',   // 41-45: 초록색
  
  // Ranking
  rankGold: '#FFD700',
  rankSilver: '#C0C0C0',
  rankBronze: '#CD7F32',
  
  // Border
  border: '#E2E8F0',
  borderFocus: '#1E3A5F',
};

// 운세 점수에 따른 색상 반환
export const getScoreColor = (score: number): string => {
  if (score >= 90) return Colors.fortuneExcellent;
  if (score >= 70) return Colors.fortuneGood;
  if (score >= 50) return Colors.fortuneNormal;
  if (score >= 30) return Colors.fortuneBad;
  return Colors.fortunePoor;
};

// 로또 번호에 따른 색상 반환
export const getBallColor = (number: number): string => {
  if (number <= 10) return Colors.ball1to10;
  if (number <= 20) return Colors.ball11to20;
  if (number <= 30) return Colors.ball21to30;
  if (number <= 40) return Colors.ball31to40;
  return Colors.ball41to45;
};

// 랭킹 순위에 따른 색상 반환
export const getRankColor = (rank: number): string => {
  if (rank === 1) return Colors.rankGold;
  if (rank === 2) return Colors.rankSilver;
  if (rank === 3) return Colors.rankBronze;
  return Colors.textSecondary;
};

export default Colors;
