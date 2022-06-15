export const COLOR = {
  PRIMARY: '#00FC82',
  SECONDARY: '#00F422',
  GREY_1: '#C4C4C4',
  GREY_2: '#9A9A9A',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  BORDER_GREY: '#323232',
  TABLE_BLACK: '#1B1B1B',

  // homepage
  RED: '#FC0E38',
  BLUE: '#1324FB',
  PURPLE: '#6A26FB',
  GREEN_1: '#2AFD8A',
  GREEN_2: '#42FF00',
  GREEN_3: '#00FFD1',
  YELLOW_1: '#FAFF00',
  ORANGE_1: '#FF4D00',

  // antd
  ANTD_ORANGE: '#FAAD14',
};

export const FONT_SIZE = {
  30: '30px',
  28: '28px',
  26: '26px',
  24: '24px',
  22: '22px',
  20: '20px',
  18: '18px',
  16: '16px',
};

export const BREAK_POINT = {
  xxxs: '340px',
  xxs: '375px',
  xs: '480px',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
  xxl: '1600px',
};

export const MEDIA_QUERY = {
  mobileXS: `@media only screen and (max-width: ${BREAK_POINT.xxxs})`,
  mobileS: `@media only screen and (max-width: ${BREAK_POINT.xxs})`,
  mobileM: `@media only screen and (max-width: ${BREAK_POINT.xs})`,
  mobileL: `@media only screen and (max-width: ${BREAK_POINT.sm})`,
  tablet: `@media only screen and (max-width: ${BREAK_POINT.md})`,
  tabletL: `@media only screen and (max-width: ${BREAK_POINT.lg})`,
  laptop: `@media only screen and (max-width: ${BREAK_POINT.xl})`,
  desktop: `@media only screen and (max-width: ${BREAK_POINT.xxl})`,
};
