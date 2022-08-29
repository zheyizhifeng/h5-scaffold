// 金额分隔符
export function separator(account) {
  return account.toLocaleString("id");
}
// 时间格式转换
export function formatTime(seconds) {
  var d, h, m, s;
  if (seconds > 3600 * 24) {
    d = Math.floor(seconds / 86400);
    h = Math.floor((seconds % 86400) / 3600);
    return `${d}d${h}h`;
  } else if (seconds > 3600) {
    h = Math.floor(seconds / 3600);
    m = Math.floor((seconds / 60) % 60);
    return `${h}h${m}m`;
  } else {
    m = Math.floor((seconds / 60) % 60);
    s = Math.floor(seconds % 60);
    return `${m}m${s}s`;
  }
}
